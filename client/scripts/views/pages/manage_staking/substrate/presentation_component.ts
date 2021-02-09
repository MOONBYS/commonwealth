import m from 'mithril';
import app from 'state';
import Substrate from 'controllers/chain/substrate/main';
import StakeList from 'views/pages/manage_staking/substrate/stake_list';
import GroupList from 'views/pages/manage_staking/groups/group_list';
import { SubstrateAccount } from 'client/scripts/controllers/chain/substrate/account';
import Tabs from '../../../components/widgets/tabs';
import { SubstratePreHeader } from '.';

const PresentationComponent = (state, chain: Substrate) => {
  const { ownStashInfos } = state.dynamic;

  return m('div.manage-staking-presentation',
    [
      m(Tabs, [{
        name: 'Manage Staking',
        content: [m(SubstratePreHeader, {
          sender: app.user.activeAccount as SubstrateAccount,
        }), m(StakeList, { ownStashInfos })]
      }]),
      app.user.jwt && m(Tabs, [{
        name: 'Saved Groups',
        content: m(GroupList)
      }])
    ]);
};

export default PresentationComponent;
