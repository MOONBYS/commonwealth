import 'modals/select_address_modal.scss';

import m from 'mithril';
import $ from 'jquery';
import { Tag, Button, Icon, Icons } from 'construct-ui';

import app from 'state';
import { Account, RoleInfo, RolePermission } from 'models';
import { UserBlock } from 'views/components/widgets/user';
import { isSameAccount, formatAsTitleCase, formatAddressShort } from 'helpers';
import { notifyError, notifySuccess } from 'controllers/app/notifications';
import { setActiveAccount } from 'controllers/app/login';
import { confirmationModalWithText } from 'views/modals/confirm_modal';
import LoginWithWalletDropdown from 'views/components/login_with_wallet_dropdown';

const SelectAddressModal: m.Component<{}, { selectedIndex: number, loading: boolean }> = {
  view: (vnode) => {
    const activeAccountsByRole: Array<[Account<any>, RoleInfo]> = app.user.getActiveAccountsByRole();

    const createRole = (e) => {
      vnode.state.loading = true;

      const [account, role] = activeAccountsByRole[vnode.state.selectedIndex];
      const addressInfo = app.user.addresses
        .find((a) => a.address === account.address && a.chain === account.chain.id);
      const activeEntityInfo = app.community ? app.community.meta : app.chain.meta.chain;
      app.user.createRole({
        address: addressInfo,
        chain: app.activeChainId(),
        community: app.activeCommunityId(),
      }).then(() => {
        vnode.state.loading = false;
        m.redraw();
        vnode.state.selectedIndex = null;
        // select the address, and close the form
        notifySuccess(`Joined with ${formatAddressShort(addressInfo.address)}`);
        setActiveAccount(account);
        $(e.target).trigger('modalexit');
      }).catch((err: any) => {
        vnode.state.loading = false;
        m.redraw();
        notifyError(err.responseJSON.error);
      });
    };

    const deleteRole = async (index, e) => {
      vnode.state.loading = true;
      const [account, role] = activeAccountsByRole[index];
      const addressInfo = app.user.addresses
        .find((a) => a.address === account.address && a.chain === account.chain.id);
      const activeEntityInfo = app.community ? app.community.meta : app.chain.meta.chain;

      // confirm
      const confirmed = await confirmationModalWithText('Remove this address from the community?')();
      if (!confirmed) {
        vnode.state.loading = false;
        m.redraw();
        return;
      }

      app.user.deleteRole({
        address: addressInfo,
        chain: app.activeChainId(),
        community: app.activeCommunityId(),
      }).then(() => {
        vnode.state.loading = false;
        m.redraw();
        vnode.state.selectedIndex = null;
        // unset activeAccount, or set it to the next activeAccount
        if (app.user.activeAccount === account) {
          const remainingAccounts = app.user.activeAccounts.filter((a) => a !== account);
          if (remainingAccounts[0]) {
            setActiveAccount(remainingAccounts[0]);
          } else {
            app.user.ephemerallySetActiveAccount(null);
          }
        }
      }).catch((err: any) => {
        vnode.state.loading = false;
        m.redraw();
        notifyError(err.responseJSON.error);
      });
    };

    return m('.SelectAddressModal', [
      m('.compact-modal-title', [
        m('h3', 'Manage addresses'),
      ]),
      m('.compact-modal-body', [
        m('.select-address-options', [
          activeAccountsByRole.length === 0 && m('.select-address-placeholder', [
            'No linked addresses'
          ]),
          activeAccountsByRole.map(([account, role], index) => role && m('.select-address-option.existing', [
            m(UserBlock, { user: account, showRole: true }),
            m('.role-remove', [
              m('span.already-connected', 'Already joined'),
              m('span.icon', {
                onclick: deleteRole.bind(this, index)
              }, m(Icon, { name: Icons.X })),
            ]),
          ])),
          activeAccountsByRole.map(([account, role], index) => !role && m('.select-address-option', {
            class: vnode.state.selectedIndex === index ? 'selected' : '',
            onclick: async (e) => {
              e.preventDefault();
              vnode.state.selectedIndex = index;
            },
          }, [
            m(UserBlock, { user: account, showRole: true, selected: vnode.state.selectedIndex === index }),
            role && m('.role-permission', [
              m(Tag, { label: formatAsTitleCase(role.permission), rounded: true, size: 'sm' }),
              role.is_user_default && m(Tag, { label: 'Last used', rounded: true, size: 'sm' }),
            ]),
          ])),
        ]),
        // m('.select-address-explanation', [
        //   'You can link multiple addresses in one community, e.g. ',
        //   'separate voting and staking addresses.',
        // ]),
        m(Button, {
          label: 'Join community with address',
          intent: 'primary',
          compact: true,
          fluid: true,
          disabled: vnode.state.selectedIndex === undefined || vnode.state.loading,
          onclick: createRole.bind(this),
        }),
        m(LoginWithWalletDropdown, {
          loggingInWithAddress: false,
          joiningCommunity: app.activeCommunityId(),
          joiningChain: app.activeChainId(),
          label: 'Connect a new address',
          // compact: true,
          // fluid: true,
          // disabled: vnode.state.loading,
          // intent: 'none',
        }),
      ]),
    ]);
  }
};

export default SelectAddressModal;
