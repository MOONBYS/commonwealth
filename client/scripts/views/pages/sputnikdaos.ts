import 'pages/sputnikdaos.scss';

import m from 'mithril';
import _ from 'lodash';
import { Tag, Table } from 'construct-ui';

import app from 'state';
import { ChainInfo, CommunityInfo } from 'models';

import PageLoading from 'views/pages/loading';
import SputnikDaoRow from 'views/components/sputnik_dao_row';
import Sublayout from 'views/sublayout';
import Near from 'controllers/chain/near/main';
import { IDaoInfo } from 'controllers/chain/near/chain';

const SputnikDAOsPage : m.Component<{}, { daosRequested: boolean, daosList: IDaoInfo[] }> = {
  view: (vnode) => {
    if (app.activeId() && app.activeId() !== 'near')
      m.route.set(`/${app.activeId()}`);

    const activeEntity = app.community ? app.community : app.chain;
    const allCommunities = (app.config.communities.getAll() as (CommunityInfo | ChainInfo)[])
      .concat(app.config.chains.getAll());

    if (!activeEntity) return m(PageLoading, {
      message: 'Loading Sputnik DAOs',
      title: [
        'Sputnik DAOs',
        m(Tag, {
          size: 'xs',
          label: 'Beta',
          style: 'position: relative; top: -2px; margin-left: 6px'
        })
      ],
      showNewProposalButton: true,
    });

    if ((app.activeId() === 'near' || app.activeId() === 'near-testnet') && !vnode.state.daosRequested) {
      vnode.state.daosRequested = true;
      (app.chain as Near).chain.viewDaoList().then((daos) => {
        const isMainnet = app.activeId() === 'near';
        vnode.state.daosList = daos;
        vnode.state.daosList.sort((d1, d2) => {
          const d1Exist = allCommunities.filter(c => isMainnet
            ? c.id === `${d1.name}.sputnik-dao.near`
            : c.id === `${d1.name}.sputnikv2.testnet`).length;
          const d2Exist = allCommunities.filter(c => isMainnet
            ? c.id === `${d2.name}.sputnik-dao.near`
            : c.id === `${d1.name}.sputnikv2.testnet`).length;
          if(d1Exist !== d2Exist)
            return d2Exist - d1Exist;
          else
            return parseFloat(d2.amount) - parseFloat(d1.amount);
        });
        m.redraw();
      })
    }

    if (!vnode.state.daosList) {
      if (app.activeId() === 'near' || app.activeId() === 'near-testnet') {
        return m(PageLoading, {
          message: 'Loading Sputnik DAOs',
          title: [
            'Sputnik DAOs',
            m(Tag, {
              size: 'xs',
              label: 'Beta',
              style: 'position: relative; top: -2px; margin-left: 6px'
            })
          ],
          showNewProposalButton: true,
        });
      } else return m(PageLoading, { message: 'Redirecting...' });
    }

    return m(Sublayout, {
      class: 'SputnikDAOsPage',
      title: [
        'Sputnik DAOs',
        m(Tag, {
          size: 'xs',
          label: 'Beta',
          style: 'position: relative; top: -2px; margin-left: 6px'
        })
      ],
      showNewProposalButton: true,
    }, [
      m('.title', 'Sputnik DAOs'),
      m(Table, [
        m('tr', [
          m('th', {
            style: { width: '27%' }
          }, 'Name'),
          m('th', {
            style: { width: '20%' }
          }, 'Dao Funds ', [
            m('span.nearBadge', 'Ⓝ')
          ]),
          m('th', {
            style: { width: '17%' }
          }, 'Council Size'),
          m('th', {
            style: { width: '19%' }
          }, 'Bond ', [m('span.nearBadge', 'Ⓝ') ]),
          m('th', {
            style: { width: '17%' }
          }, 'Vote Period'),
        ]),
        vnode.state.daosList.map((dao) => {
          return m(SputnikDaoRow, {
            dao,
            clickable: allCommunities.some((c) => c.id === dao.contractId),
          });
        })
      ]),
    ]);
  }
};

export default SputnikDAOsPage;