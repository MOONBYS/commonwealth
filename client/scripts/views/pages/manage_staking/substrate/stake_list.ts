import m from 'mithril';
import app from 'state';
import { makeDynamicComponent } from 'models/mithril';
import { StakerState, sortStashes } from 'controllers/chain/substrate/staking';
import StakeRow from 'views/pages/manage_staking/substrate/stake_row';
import { SubstrateAccount } from 'client/scripts/controllers/chain/substrate/account';

export interface IStakeListState {
  dynamic: { }
}

export interface StakeListAttrs {
  ownStashInfos?: StakerState[],
}

interface IModel {
  foundStashes: StakerState[]
}

const model: IModel = {
  foundStashes: []
};

const StakeList = makeDynamicComponent<StakeListAttrs, IStakeListState>({
  oncreate: (vnode) => {
    const { ownStashInfos } = vnode.attrs;
    model.foundStashes = ownStashInfos.sort(sortStashes);
  },
  getObservables: () => ({
    groupKey: app.chain.class.toString()
  }),
  view: () => {
    return m('div.account_actions',
      m('table.staking-table', [
        m('tr.validators-heading', [
          m('th.val-stashes', 'Stashes'),
          m('th.val-controller', 'Controller'),
          m('th.val-rewards', 'Rewards'),
          m('th.val-bonded', 'Bonded Amount'),
          m('th.val-nominations', 'Nominations'),
          m('th.val-action', 'Options'),
        ]),
        model.foundStashes.map((info) => {
          return m(StakeRow, { info });
        }),
        !model.foundStashes.length && m('tr.ManageStakingRow', [
          m('td', { colspan: '7' }, 'No funds staked yet. Bond funds to validate or nominate a validator')
        ])
      ]));
  }
});

export default StakeList;
