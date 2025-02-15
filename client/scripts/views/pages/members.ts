import 'pages/members.scss';

import m from 'mithril';
import _ from 'lodash';
import { Tag, Table, Spinner } from 'construct-ui';
import $ from 'jquery';

import app from 'state';
import { navigateToSubpage } from 'app';

import PageLoading from 'views/pages/loading';
import User from 'views/components/widgets/user';
import Sublayout from 'views/sublayout';
import { CommunityOptionsPopover } from './discussions';
import { ConsoleLoggerImpl } from 'typescript-logging';
import { Profile } from 'client/scripts/models';
import address from 'server/models/address';
import { min } from 'underscore';
import ConfirmSnapshotVoteModal from '../modals/confirm_snapshot_vote_modal';

// The number of member profiles that are batch loaded
const DEFAULT_MEMBER_REQ_SIZE = 20;

interface MemberInfo {
  chain: string;
  address: string;
  count: number;
}

interface ProfileInfo {
  profile: Profile
  postCount: number
}


const MembersPage : m.Component<
  {}, 
  { 
    membersRequested: boolean, 
    membersLoaded: MemberInfo[], 
    profilesLoaded: ProfileInfo[], 
    profilesFinishedLoading: boolean, 
    numProfilesLoaded: number, 
    initialProfilesLoaded: boolean, 
    initialScrollFinished: boolean,
    onscroll: any 
  }
> = {
  view: (vnode) => {
    const activeEntity = app.community ? app.community : app.chain;
    if (!activeEntity) return m(PageLoading, {
      message: 'Loading members',
      title: [
        'Members',
        m(Tag, { size: 'xs', label: 'Beta', style: 'position: relative; top: -2px; margin-left: 6px' })
      ],
      showNewProposalButton: true,
    });

     // get members once
    const activeInfo = app.community ? app.community.meta : app.chain.meta.chain;
    if (!vnode.state.membersRequested) {
      vnode.state.membersRequested = true;
      activeInfo.getMembers(activeInfo.id).then(() => {
        const activeMembersHash = {};
        const membersActive: MemberInfo[] = app.recentActivity.getMostActiveUsers().map((user) => {
          const { chain, address } = user.info;
          activeMembersHash[`${chain}##${address}`] = true;
          return { chain, address, count: user.count };
        });
        const membersInactive: MemberInfo[] = activeInfo.members.map((role) => {
          return { address: role.address, chain: role.address_chain, count: 0 };
        }).filter((info) => {
          const { chain, address } = info;
          return (!activeMembersHash[`${chain}##${address}`]);
        });
        vnode.state.membersLoaded = membersActive.concat(membersInactive).sort((a, b) => b.count - a.count);
        m.redraw();
      });
    }


    if (!vnode.state.membersLoaded) return m(PageLoading, {
      message: 'Loading members',
      title: [
        'Members',
        m(Tag, { size: 'xs', label: 'Beta', style: 'position: relative; top: -2px; margin-left: 6px' })
      ],
      showNewProposalButton: true,
    });

    const navigatedFromAccount = app.lastNavigatedBack() && app.lastNavigatedFrom().includes(`/${app.activeId()}/account/`)
    && localStorage[`${app.activeId()}-members-scrollY`]

    // Load default number of profiles on mount
    if (!vnode.state.initialProfilesLoaded) {
      vnode.state.initialScrollFinished = false
      vnode.state.initialProfilesLoaded = true

      // Set initial number loaded (contingent on navigation)
      if (navigatedFromAccount) {
        vnode.state.numProfilesLoaded = Math.min(Number(localStorage[`${app.activeId()}-members-numProfilesAlreadyLoaded`]))
      } else {
        vnode.state.numProfilesLoaded = Math.min(DEFAULT_MEMBER_REQ_SIZE, vnode.state.membersLoaded.length);
      }
      vnode.state.profilesFinishedLoading = vnode.state.numProfilesLoaded >= vnode.state.membersLoaded.length;

      let profileInfos: ProfileInfo[] = vnode.state.membersLoaded.slice(0, vnode.state.numProfilesLoaded).map((member) => {
        return {profile: app.profiles.getProfile(member.chain, member.address), postCount: member.count}
      })

      vnode.state.profilesLoaded = profileInfos;
    }

    // Check if all profiles have been loaded
    if (!vnode.state.profilesFinishedLoading) {
      if (vnode.state.profilesLoaded.length >= vnode.state.membersLoaded.length) {
        vnode.state.profilesFinishedLoading = true
      }
    }

    // Return to correct scroll position upon redirect from accounts page
    if (navigatedFromAccount && !vnode.state.initialScrollFinished) {
      vnode.state.initialScrollFinished = true
      setTimeout(() => {
        window.scrollTo(0, Number(localStorage[`${app.activeId()}-members-scrollY`]));
      }, 100);
    }

    // Infinite Scroll 
    $(window).off('scroll');    
    vnode.state.onscroll = _.debounce(() => {
      const scrollHeight = $(document).height();
      const scrollPos = $(window).height() + $(window).scrollTop();
      if (scrollPos > scrollHeight - 400) {
        if (!vnode.state.profilesFinishedLoading) {
          const lastLoadedProfileIndex = vnode.state.numProfilesLoaded
          const newBatchSize = Math.min(DEFAULT_MEMBER_REQ_SIZE, vnode.state.membersLoaded.length - lastLoadedProfileIndex)
          const newBatchEnd = lastLoadedProfileIndex + newBatchSize;
          
          for (let i = lastLoadedProfileIndex; i < newBatchEnd; i++) {
            const member = vnode.state.membersLoaded[i];
            const profileInfo: ProfileInfo = {profile: app.profiles.getProfile(member.chain, member.address), postCount: member.count}
            vnode.state.profilesLoaded.push(profileInfo);
          }

          vnode.state.numProfilesLoaded += newBatchSize
          m.redraw();
        }
      } 
    }, 400)
    $(window).on('scroll', vnode.state.onscroll)

    return m(Sublayout, {
      class: 'MembersPage',
      title: [
        'Members',
        m(Tag, { size: 'xs', label: 'Beta', style: 'position: relative; top: -2px; margin-left: 6px' })
      ],
      showNewProposalButton: true,
    }, [
      m('.title', 'Members'),
      m(Table, [
        m('tr', [
          m('th', 'Member'),
          m('th.align-right', 'Posts / Month'),
        ]),
        vnode.state.profilesLoaded.map((profileInfo) => {
            return m('tr', [
              m('td.members-item-info', [
                m('a', {
                  href: `/${app.activeId()}/account/${profileInfo.profile.address}?base=${profileInfo.profile.chain}`,
                  onclick: (e) => {
                    e.preventDefault();
                    localStorage[`${app.activeId()}-members-scrollY`] = window.scrollY;
                    localStorage[`${app.activeId()}-members-numProfilesAlreadyLoaded`] = vnode.state.numProfilesLoaded;
                    navigateToSubpage(`/account/${profileInfo.profile.address}?base=${profileInfo.profile.chain}`);
                  }
                }, [
                  m(User, { user: profileInfo.profile, showRole: true }),
                ]),
              ]),
              m('td.align-right', profileInfo.postCount),
            ]);
        })]),
        m('.infinite-scroll-wrapper', [
          vnode.state.profilesFinishedLoading ? 
          m('.infinite-scroll-reached-end', [
            `Showing all ${vnode.state.membersLoaded.length} community members`,
          ]) :
          m('.infinite-scroll-spinner-wrap', [
            m(Spinner, {
              active: true,
              size: 'lg',
            }),
          ])
        ]),
      ])
  }
};

const buildMemberProfiles = () => {

}
export default MembersPage;
