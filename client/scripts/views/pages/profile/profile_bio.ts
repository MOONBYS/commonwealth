import m from 'mithril';
import _ from 'lodash';
import { notifyError, notifySuccess } from 'controllers/app/notifications';
import { Button, Icons } from 'construct-ui';
import MarkdownFormattedText from '../../components/markdown_formatted_text';
import User from '../../components/widgets/user';
import { initChain } from '../../../app';
import SubstrateIdentity from '../../../controllers/chain/substrate/identity';
import app from '../../../state';
import LoginWithWalletDropdown from '../../components/login_with_wallet_dropdown';
import { confirmationModalWithText } from '../../modals/confirm_modal';
import EditIdentityModal from '../../modals/edit_identity_modal';
import { setActiveAccount } from '../../../controllers/app/login';
import EditProfileModal from '../../modals/edit_profile_modal';
import TwitterAttestationModal from '../../modals/twitter_attestation_modal';
import { isAddressOnSite } from 'helpers';

const editIdentityAction = (account, currentIdentity: SubstrateIdentity, vnode) => {
  const chainObj = app.config.chains.getById(account.chain);
  if (!chainObj) return;

  // TODO: look up the chainObj's chain base
  return (account.chain.indexOf('edgeware') !== -1 || account.chain.indexOf('kusama') !== -1) && m(Button, {
    intent: 'primary',
    // wait for info to load before making it clickable
    disabled: vnode.state.chainLoading,
    onclick: async () => {
      if (app.activeId() !== chainObj.id) {
        let confirmed = false;
        const msg = `Must switch to ${chainObj.name} to set on-chain identity. Continue?`;
        confirmed = await confirmationModalWithText(msg)();
        if (confirmed) {
          m.route.set(`/${chainObj.id}/account/${account.address}`, {
            setIdentity: true
          });
        }
      } else if (!app.chain?.loaded) {
        vnode.state.chainLoading = true;
        initChain().then(() => {
          vnode.state.chainLoading = false;
          app.modals.create({
            modal: EditIdentityModal,
            data: { account, currentIdentity },
          });
        }).catch((err) => {
          vnode.state.chainLoading = false;
        });
      } else {
        app.modals.create({
          modal: EditIdentityModal,
          data: { account, currentIdentity },
        });
      }
    },
    loading: !!vnode.state.chainLoading,
    label: currentIdentity?.exists ? 'Edit identity' : 'Set identity'
  });
};
export interface IProfileHeaderAttrs {
  account;
  setIdentity: boolean;
  refreshCallback: Function;
  onLinkedProfile: boolean;
  onOwnProfile: boolean;
}

export interface IProfileHeaderState {
  identity: SubstrateIdentity | null;
  copied: boolean;
  loading: boolean;
  showProfileRight: boolean;
}

const ProfileBio: m.Component<IProfileHeaderAttrs, IProfileHeaderState> = {
  oninit: (vnode) => {
    vnode.state.showProfileRight = false;
  },
  oncreate:() => {
    if (window.location.search) {
      const query = new URLSearchParams(window.location.search);
      if (query.get('continueTwitterAttestation')) {
        app.modals.create({ modal: TwitterAttestationModal });
      }
    }
  },
  view: (vnode) => {
    const { account, refreshCallback, onOwnProfile, onLinkedProfile } = vnode.attrs;
    const showJoinCommunityButton = vnode.attrs.setIdentity && !onOwnProfile;      
    const isClaimable = !isAddressOnSite(account.address) || !account.profile;

    window.addEventListener('scroll',
      () => {
        if (window.scrollY > 142 && vnode.state.showProfileRight === false) {
          vnode.state.showProfileRight = true;
          m.redraw();
        } else if (window.scrollY < 142 && vnode.state.showProfileRight === true) {
          vnode.state.showProfileRight = false;
          m.redraw();
        }
      },
      { passive:true });

    const joinCommunity = async () => {
      if (!app.activeChainId() || onOwnProfile) return;
      vnode.state.loading = true;
      const addressInfo = app.user.addresses
        .find((a) => a.address === account.address && a.chain === app.activeChainId());
      try {
        await app.user.createRole({
          address: addressInfo,
          chain: app.activeChainId(),
          community: app.activeCommunityId(),
        });
        vnode.state.loading = false;
        await setActiveAccount(account);
        m.redraw();
        notifySuccess('Joined community');
      } catch (err) {
        vnode.state.loading = false;
        notifyError('Failed to join community');
      }
    };

    return m('.ProfileBio', [
      m(`.ProfileHeader${vnode.state.showProfileRight ? '.show-profile' : '.hide-profile'}`, [
        m('.bio-main', [
          account.profile && m('.bio-left', [ // TODO: Rename class to non-bio to avoid confusion with Bio component
            m('.avatar', account.profile?.getAvatar(90)),
          ]),
          m('.bio-right', [
            m('.name-row', [
              m('.User', account.profile
                ? m(User, { user: account, hideAvatar: true, showRole: true })
                : account.address),
            ]),
            m('.address-block-right', [
              m('.address', `${account.address.slice(0, 6)}...${account.address.slice(account.address.length - 6)}`),
              m('img', {
                src: '/static/img/copy_default.svg',
                alt: '',
                class: 'cursor-pointer',
                onclick: (e) => {
                  window.navigator.clipboard.writeText(account.address)
                    .then(() => notifySuccess('Copied address to clipboard'));
                }
              }),
            ]),
          ]),
        ]),
      ]),
      m('.bio-actions-right', [
        onOwnProfile ? [
          editIdentityAction(account, vnode.state.identity, vnode),
          m(Button, {
            intent: 'primary',
            style: 'background: #FFFFFF; border: 1px solid #4723AD; color: #4723AD;',
            onclick: () => {
              app.modals.create({
                modal: EditProfileModal,
                data: { account, refreshCallback },
              });
            },
            label: 'Edit'
          }),
          m('.twitter-link', [
            !isClaimable && onOwnProfile && m(Button, {
              intent: 'primary',
              style: 'background-color: rgb(33, 114, 229); border: 0px solid white; color: white;',
              onclick: () => {
                window.location.href = `/api/auth/twitter?redirect=${encodeURIComponent(window.location.pathname)}${window.location.search ? 
                  `${encodeURIComponent(window.location.search)}%26` : '%3F'}continueTwitterAttestation=true`;
              },
              label: 'Add a Public Identity',
              iconRight: Icons.TWITTER,
            }),
            m('p', 'Connecting your Twitter to your address can help people find you and delegate votes to you')]
          ),
        ] : (showJoinCommunityButton && app.activeChainId())
          ? m(Button, {
            intent: 'primary',
            onclick: async () => {
              if (onLinkedProfile) {
                vnode.state.loading = true;
                try {
                  await setActiveAccount(account);
                  m.redraw();
                } catch (e) {
                  vnode.state.loading = false;
                  notifyError(e);
                }
              } else {
                try {
                  await joinCommunity();
                  m.redraw();
                } catch (e) {
                  vnode.state.loading = false;
                  notifyError(e);
                }
              }
            },
            label: onLinkedProfile ? 'Switch to address' : 'Join community'
          })
          : [
            isClaimable && m(LoginWithWalletDropdown, {
              prepopulateAddress: account.address,
              loggingInWithAddress: !app.isLoggedIn(),
              joiningCommunity: app.activeCommunityId(),
              joiningChain: app.activeChainId(),
              label: 'Claim address',
            }),
          ]
      ]),
      m(`.address-block-right${vnode.state.showProfileRight ? '.hide-address' : '.show-address'}`, [
        m('.address', `${account.address.slice(0, 6)}...${account.address.slice(account.address.length - 6)}`),
        m('img', {
          src: '/static/img/copy_default.svg',
          alt: '',
          class: 'cursor-pointer',
          onclick: (e) => {
            window.navigator.clipboard.writeText(account.address)
              .then(() => notifySuccess('Copied address to clipboard'));
          }
        }),
      ]),
      m('.header', 'Bio'),
      account.profile && account.profile.bio
        ? m('p', [
          m(MarkdownFormattedText, { doc: account.profile.bio })
        ])
        : m('.no-items', [
          (account.profile && account.profile.name) ? account.profile.name : 'This account',
          ' hasn\'t created a bio'
        ]),
    ]);
  }
};

export default ProfileBio;
