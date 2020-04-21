import { Response, NextFunction } from 'express';
import { NotificationCategories } from '../../shared/types';
import { UserRequest } from '../types';

import lookupCommunityIsVisibleToUser from '../util/lookupCommunityIsVisibleToUser';
import lookupAddressIsOwnedByUser from '../util/lookupAddressIsOwnedByUser';
import { createCommonwealthUrl } from '../util/routeUtils';

const createComment = async (models, req: UserRequest, res: Response, next: NextFunction) => {
  const [chain, community] = await lookupCommunityIsVisibleToUser(models, req.body, req.user, next);
  const author = await lookupAddressIsOwnedByUser(models, req, next);
  const { parent_id, root_id, text } = req.body;

  const mentions = typeof req.body['mentions[]'] === 'string'
    ? [req.body['mentions[]']]
    : typeof req.body['mentions[]'] === 'undefined'
      ? []
      : req.body['mentions[]'];

  if (parent_id) {
    // check that parent comment is in the same community
    const parentCommentIsVisibleToUser = await models.OffchainComment.findOne({
      where: community ? {
        id: parent_id,
        community: community.id,
      } : {
        id: parent_id,
        chain: chain.id,
      }
    });
    if (!parentCommentIsVisibleToUser) return next(new Error('Invalid parent'));
  }

  if (!root_id) {
    return next(new Error('Must provide root_id'));
  }
  if ((!text || !text.trim())
      && (!req.body['attachments[]'] || req.body['attachments[]'].length === 0)) {
    return next(new Error('Must provide text or attachment'));
  }
  try {
    const quillDoc = JSON.parse(decodeURIComponent(text));
    if (quillDoc.ops.length === 1 && quillDoc.ops[0].insert.trim() === ''
        && (!req.body['attachments[]'] || req.body['attachments[]'].length === 0)) {
      return next(new Error('Must provide text or attachment'));
    }
  } catch (e) {
    // check always passes if the comment text isn't a Quill document
  }

  // New comments get an empty version history initialized, which is passed
  // the comment's first version, formatted on the frontend with timestamps
  const versionHistory = [];
  versionHistory.push(req.body.versionHistory);
  const commentContent = {
    root_id,
    child_comments: [],
    text,
    version_history: versionHistory,
    address_id: author.id,
    chain: null,
    community: null,
    parent_id: null,
  };
  if (community) Object.assign(commentContent, { community: community.id });
  else if (chain) Object.assign(commentContent, { chain: chain.id });
  if (parent_id) Object.assign(commentContent, { parent_id });

  const comment = await models.OffchainComment.create(commentContent);

  if (parent_id) {
    const parentComment = await models.OffchainComment.findOne({
      where: community ? {
        id: parent_id,
        community: community.id,
      } : {
        id: parent_id,
        chain: chain.id,
      }
    });
    const arr = parentComment.child_comments;
    arr.push(Number(comment.id));
    parentComment.child_comments = arr;
    await parentComment.save();
  }

  // To-do: attachments can likely be handled like mentions (see lines 10 & 11)
  if (req.body['attachments[]'] && typeof req.body['attachments[]'] === 'string') {
    await models.OffchainAttachment.create({
      attachable: 'comment',
      attachment_id: comment.id,
      url: req.body['attachments[]'],
      description: 'image',
    });
  } else if (req.body['attachments[]']) {
    await Promise.all(req.body['attachments[]'].map((url) => models.OffchainAttachment.create({
      attachable: 'comment',
      attachment_id: comment.id,
      url,
      description: 'image',
    })));
  }
  // fetch attached objects to return to user
  const finalComment = await models.OffchainComment.findOne({
    where: { id: comment.id },
    include: [models.Address, models.OffchainAttachment],
  });
  const commentedObject = root_id.startsWith('discussion_')
    ? await models.OffchainThread.findOne({
      where: { id: root_id.replace('discussion_', '') }
    })
    : null;

  // grab mentions to notify tagged users
  let mentionedAddresses;
  if (mentions && mentions.length) {
    try {
      mentionedAddresses = await Promise.all(mentions.map(async (mention) => {
        mention = mention.split(',');
        const user = await models.Address.findOne({
          where: {
            chain: mention[0],
            address: mention[1],
          },
          include: [ models.User, models.Role ]
        });
        return user;
      }));
    } catch (err) {
      console.log(err);
    }
  }

  // craft commonwealth url
  const thread = await models.OffchainThread.findOne({ where: { id: finalComment.root_id.split('_')[1] } });
  const activeId = (finalComment.community) ? finalComment.community : finalComment.chain;
  const cwUrl = (process.env.NODE_ENV === 'production')
    ? `https://commonwealth.im/${activeId}/proposal/discussion/${thread.id}-${thread.title.toLowerCase()}?comment=${finalComment.id}`
    : `http://localhost:8080/${activeId}/proposal/discussion/${thread.id}-${thread.title.toLowerCase()}?comment=${finalComment.id}`;

  // dispatch notifications
  await models.Subscription.emitNotifications(
    models,
    NotificationCategories.NewComment,
    root_id,
    {
      created_at: new Date(),
      object_title: commentedObject?.title,
      root_id,
      comment_text: finalComment.text,
      comment_id: finalComment.id,
      chain_id: finalComment.chain,
      community_id: finalComment.community,
      author_address: finalComment.Address.address,
      author_chain: finalComment.Address.chain,
    },
    {
      user: finalComment.Address.address,
      url: createCommonwealthUrl(thread, finalComment),
      title: thread.title,
      chain: finalComment.chain,
      community: finalComment.community,
    },
    req.wss,
  );

  // notify mentioned users if they have permission to view the originating forum
  if (mentionedAddresses?.length) {
    await Promise.all(mentionedAddresses.map(async (mentionedAddress) => {
      if (!mentionedAddress.User) return; // some Addresses may be missing users, e.g. if the user removed the address

      let shouldNotifyMentionedUser = true;
      if (finalComment.community) {
        const originCommunity = await models.OffchainCommunity.findOne({
          where: { id: finalComment.community }
        });
        if (originCommunity.privacyEnabled) {
          const destinationCommunity = mentionedAddress.Roles
            .find((role) => role.offchain_community_id === originCommunity.id);
          if (destinationCommunity === undefined) shouldNotifyMentionedUser = false;
        }
      }
      if (shouldNotifyMentionedUser) await models.Subscription.emitNotifications(
        models,
        NotificationCategories.NewMention,
        `user-${mentionedAddress.User.id}`,
        {
          created_at: new Date(),
          mention_context: 'comment',
          thread_title: commentedObject?.title,
          thread_id: commentedObject?.id,
          root_id,
          comment_text: finalComment.text,
          comment_id: finalComment.id,
          chain_id: finalComment.chain,
          community_id: finalComment.community,
          author_address: finalComment.Address.address,
          author_chain: finalComment.Address.chain,
        },
        req.wss
      );
    }));
  }
  return res.json({ status: 'Success', result: finalComment.toJSON() });
};

export default createComment;
