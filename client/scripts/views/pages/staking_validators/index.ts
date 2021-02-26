import 'pages/staking_validators.scss';

import m from 'mithril';
import mixpanel from 'mixpanel-browser';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import app, { ApiStatus } from 'state';
import { Coin, formatCoin } from 'adapters/currency';
import { makeDynamicComponent } from 'models/mithril';
import { u32 } from '@polkadot/types';
import { HeaderExtended } from '@polkadot/api-derive';
import { IValidators, SubstrateAccount } from 'controllers/chain/substrate/account';
import { ICosmosValidator } from 'controllers/chain/cosmos/account';
import User from 'views/components/widgets/user';
import PageLoading from 'views/pages/loading';
import { ChainBase, Account, ChainClass } from 'models';
import Substrate from 'controllers/chain/substrate/main';
import Cosmos from 'controllers/chain/cosmos/main';
import Sublayout from 'views/sublayout';
import { ICommissionInfo } from 'controllers/chain/substrate/staking';
import { Button } from 'construct-ui';

import * as CosmosValidationViews from './cosmos';
import { SubstratePreHeader, SubstratePresentationComponent } from './substrate';
import { formatAddressShort } from '../../../../../shared/utils';

export interface IValidatorAttrs {
  stash: string;
  total?: Coin;
  otherTotal?: Coin;
  nominators?: any;
  error?: any;
  sending?: boolean;
  name?: string;
  bonded?: Coin;
  nominated?: Coin;
  controller?: string;
  hasNominated?: boolean;
  onChangeHandler?: any;
  waiting?: boolean;
  eraPoints?: string;
  toBeElected?: boolean;
  blockCount?: u32;
  hasMessage?: boolean;
  isOnline?: boolean;
  commission?: number;
  apr?: number;
  rewardStats?: IStatsData;
  slashesStats?: IStatsData;
  offencesStats?: IStatsData;
}

export interface IStatsData {
  avg: number;
  count: number;
}

export interface IValidatorPageState {
  dynamic: {
    validators: IValidators | { [address: string]: ICosmosValidator };
    lastHeader: HeaderExtended,
    annualPercentRate: ICommissionInfo;
    valCount: Number;
    globalStatistics: { waiting?: any; totalStaked?: any; elected?: any; count?: any; nominators?: any; offences?: any; aprPercentage?: any; lastBlockNumber?: string; };
    sender: SubstrateAccount;
  };
}

export const ViewNominatorsModal: m.Component<{ nominators, validatorAddr, waiting: boolean }> = {
  view: (vnode) => {
    return m('.ViewNominatorsModal', [
      m('.compact-modal-title', [
        m('h3', `Nominators for ${formatAddressShort(vnode.attrs.validatorAddr, null)}`), // TODO: provide chain
      ]),
      m('.compact-modal-body', [
        m('table.modal-table', [
          // m('tr', [
          //   m('th', 'Nominator'),
          //   m(`th${vnode.attrs.waiting
          //     ? '.priority'
          //     : '.amount'}`, vnode.attrs.waiting
          //     ? 'Priority'
          //     : 'Amount'),
          // ]),
          vnode.attrs.nominators.map((n) => {
            return m('tr.modal-table-row', [
              m('td', m(User, {
                user: app.chain.accounts.get(n.stash),
                linkify: true,
                onclick: () => {
                  this.trigger('modalexit');
                }
              })),
              m(`td${vnode.attrs.waiting
                ? '.priority'
                : '.amount'}`, vnode.attrs.waiting
                ? n.balance
                // : formatCoin(n.balance, true)),
                : n.balance.format(true)),
            ]);
          }),
        ])
      ]),
      m('.row.button-row', m('.col-xs-12.button-col', m(Button, {
        label: 'Dismiss',
        class: 'modal_dismissBtn',
        href: '#',
        onclick: (e) => {
          e.preventDefault();
          app.modals.getList().forEach((k) => app.modals.remove(k));
        }
      })))
    ]);
  }
};

const shouldFetchFromDB = (chain:Substrate, dbBlockNumber:string) => {
  const pad = 1000;
  return parseInt(dbBlockNumber, 10) >= (chain.block.height - pad);
};

export const Validators = makeDynamicComponent<{}, IValidatorPageState>({
  oncreate: async (vnode) => {
    vnode.state.dynamic.globalStatistics = await app.staking.globalStatistics(app.chain.meta.chain.id);
    vnode.state.dynamic.validators = undefined;
    // Only fetch data from DB when HistoricalValidatorStatistics table is synced with chain
    if (shouldFetchFromDB(app.chain as Substrate, vnode.state.dynamic.globalStatistics.lastBlockNumber)) {
      const validatorsFromDB = await app.staking.validatorNamesAddress() as any;
      const vfdb = {};
      validatorsFromDB.profileData.forEach((q) => { vfdb[q.address] = ({ state: q.state } as IValidators); });
      vnode.state.dynamic.validators = validatorsFromDB.profileData;
    }
    vnode.state.dynamic.sender = app.user.activeAccount as SubstrateAccount;
  },
  getObservables: (attrs) => ({
    // we need a group key to satisfy the dynamic object constraints, so here we use the chain class
    groupKey: app.chain.class.toString(),
    // validators: (app.chain.base === ChainBase.Substrate) ? (app.chain as Substrate).staking.validators : null,
    valCount: (app.chain.base === ChainBase.Substrate) ? (app.chain as Substrate).staking.validatorCount : null,
    currentSession: (app.chain.base === ChainBase.Substrate) ? (app.chain as Substrate).chain.session : null,
    currentEra: (app.chain.base === ChainBase.Substrate) ? (app.chain as Substrate).chain.currentEra : null,
    activeEra: (app.chain.base === ChainBase.Substrate) ? (app.chain as Substrate).chain.activeEra : null,
    stakingLedger: (app.chain.base === ChainBase.Substrate && app.user.activeAccount)
      ? (app.user.activeAccount as SubstrateAccount).stakingLedger
      : null,
    lastHeader: (app.chain.base === ChainBase.Substrate)
      ? (app.chain as Substrate).staking.lastHeader
      : null,
    // nominatedBy: (app.chain.base === ChainBase.Substrate)
    //   ? (app.chain as Substrate).staking.nominatedBy
    //   : null,
    annualPercentRate: (app.chain.base === ChainBase.Substrate)
      ? (app.chain as Substrate).staking.annualPercentRate
      : null
  }),
  view: (vnode) => {
    if (vnode.state.dynamic.globalStatistics
        && !shouldFetchFromDB(app.chain as Substrate, vnode.state.dynamic.globalStatistics.lastBlockNumber)
        && !vnode.state.dynamic.validators) {
      vnode.state.dynamic.validators = {};
      const gsUpdates = vnode.state.dynamic.globalStatistics;
      gsUpdates.aprPercentage = -1;
      gsUpdates.totalStaked = 0;
      gsUpdates.offences = -1;
      gsUpdates.nominators = -1;

      (app.chain as Substrate).staking.validators.pipe(first()).subscribe((val) => {
        const q = val;
        vnode.state.dynamic.validators = (Object.keys(q).map((d) => { return { address:d, ...q[d], state: q[d].isElected ? 'Active' : 'Waiting', dataFetched: true }; })) as any;
        gsUpdates.totalStaked =  Object.values(q).filter((v) => v.exposure?.total).map((v) => app.chain.chain.coins(v.exposure?.total.toBn())).reduce((acc, v) => acc.add(v));
        gsUpdates.waiting = Object.values(q).filter((v) => !v.isElected).length;
        gsUpdates.nominators = new Set(Object.values(q).filter((v) => v.exposure?.others).map((v) => v.exposure?.others.map((b) => b.who.toString())).reduce((a, b) => [...a, ...b])).size;
      });
    }
    let vComponents = [];
    switch (app.chain.class) {
      case ChainClass.Edgeware:
        vComponents = [
          m(SubstratePreHeader, {
            sender: app.user.activeAccount as SubstrateAccount,
            annualPercentRate: vnode.state.dynamic.annualPercentRate,
            validators: vnode.state.dynamic.validators as IValidators,
            valCount: vnode.state.dynamic.valCount,
            globalStatistics: vnode.state.dynamic.globalStatistics,
          }),
          m(SubstratePresentationComponent, {
            validators: vnode.state.dynamic.validators as IValidators,
            valCount: vnode.state.dynamic.valCount,
          })

        ];
        break;
      case ChainClass.Kusama:
      case ChainClass.Polkadot: {
        vComponents = [
          m(SubstratePreHeader, {
            sender: app.user.activeAccount as SubstrateAccount,
            annualPercentRate: vnode.state.dynamic.annualPercentRate,
            validators: vnode.state.dynamic.validators as IValidators,
            valCount: vnode.state.dynamic.valCount,
            globalStatistics: vnode.state.dynamic.globalStatistics,
          }),
          m(SubstratePresentationComponent, {
            validators: vnode.state.dynamic.validators as IValidators,
            valCount: vnode.state.dynamic.valCount,
          })
        ];
        break;
      }
      case ChainClass.CosmosHub:
        vComponents = [
          CosmosValidationViews.ValidationPreHeader(app.chain as Cosmos),
          CosmosValidationViews.ValidatorPresentationComponent(app.chain as Cosmos),
        ];
        break;
      default:
        break;
    }

    return m('.Validators', vComponents);
  }
});

const ValidatorPage : m.Component<{}> = {
  oncreate: (vnode) => {
    mixpanel.track('PageVisit', { 'Page Name': 'ValidatorPage' });
  },
  view: (vnode) => {
    if (!app.chain) return m(PageLoading);

    // Catch a Substrate validators issue where app.chain.accounts.validators
    // makes a call using the API, which fails when API is not loaded.
    if (app.chain.base === ChainBase.Substrate) {
      try {
        (app.chain as Substrate).accounts.validators;
      } catch (e) {
        return m(PageLoading, {
          message: 'Connecting to chain'
        });
      }
    }

    return m(Sublayout, {
      class: 'ValidatorPage',
    }, [
      m(Validators),
      m('.clear'),
    ]);
  },
};

export default ValidatorPage;
