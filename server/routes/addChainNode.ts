import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import { factory, formatFilename } from '../../shared/logging';
import { ChainBase, ChainType } from '../../shared/types';
import testSubstrateSpec from '../util/testSubstrateSpec';
import { DB } from '../database';

const log = factory.getLogger(formatFilename(__filename));
export const Errors = {
  NotLoggedIn: 'Not logged in',
  MustBeAdmin: 'Must be admin',
  MissingParams: 'Must provide chain ID, name, symbol, network, and node url',
  NodeExists: 'Node already exists',
  MustSpecifyContract: 'This is a contract, you must specify a contract address',
  InvalidJSON: 'Substrate spec supplied has invalid JSON'
};

const addChainNode = async (models: DB, req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new Error(Errors.NotLoggedIn));
  }
  if (!req.user.isAdmin && req.body?.base !== ChainBase.NEAR) {
    return next(new Error(Errors.MustBeAdmin));
  }
  if (!req.body.id || !req.body.name || !req.body.symbol || !req.body.network || !req.body.node_url || !req.body.base) {
    return next(new Error(Errors.MissingParams));
  }

  let sanitizedSpec;
  if (req.body.substrate_spec) {
    try {
      sanitizedSpec = await testSubstrateSpec(req.body.substrate_spec, req.body.node_url);
    } catch (e) {
      return next(new Error('Failed to validate Substrate Spec'));
    }
  }

  let chain = await models.Chain.findOne({ where: {
    // TODO: should we only check id?
    [Op.or]: [
      { id: req.body.id },
      { name: req.body.name }
    ]
  } });
  if (chain) {
    const existingNode = await models.ChainNode.findOne({ where: {
      chain: chain.id,
      url: req.body.node_url,
    } });
    if (existingNode) {
      return next(new Error(Errors.NodeExists));
    }
  } else {
    chain = await models.Chain.create({
      id: req.body.id,
      name: req.body.name,
      symbol: req.body.symbol,
      network: req.body.network,
      icon_url: req.body.icon_url,
      active: true,
      base: req.body.base,
      substrate_spec: sanitizedSpec || '',
      website: req.body.website ? req.body.website : '',
      discord: req.body.discord ? req.body.discord : '',
      telegram: req.body.telegram ? req.body.telegram : '',
      github: req.body.github ? req.body.github : '',
      element: req.body.element ? req.body.element : '',
      description: req.body.description ? req.body.description : '',
      type: req.body.type ? req.body.type : ChainType.Chain,
      // TODO: set this to true for Comp/Aave
      has_chain_events_listener: false,
      bech32_prefix: req.body.bech32_prefix || null,
    });
  }

  if (chain.type === ChainType.DAO && !req.body.address && req.body.base !== ChainBase.NEAR) {
    return next(new Error(Errors.MustSpecifyContract));
  }

  const node = await models.ChainNode.create({
    chain: chain.id,
    url: req.body.node_url,
    address: req.body.address || '',
    token_name: req.body.token_name || null,
    eth_chain_id: req.body.eth_chain_id || null, // TODO: will this work on nullable field?
  });

  // TODO: trigger migration job if turning on chain events for Comp/Aave

  return res.json({ status: 'Success', result: node.toJSON() });
};

export default addChainNode;
