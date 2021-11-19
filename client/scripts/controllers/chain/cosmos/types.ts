import BN from 'bn.js';
import moment from 'moment';
import { Coin } from 'adapters/currency';
import { IIdentifiable, ICompletable } from 'adapters/shared';

export class CosmosToken extends Coin {
  public toCoinObject() {
    return {
      denom: this.denom,
      amount: this.asBN.toString(),
    };
  }
}

export type CosmosProposalType = 'text' | 'upgrade' | 'parameter';
export type CosmosVoteChoice = 'Yes' | 'No' | 'NoWithVeto' | 'Abstain';
export type CosmosProposalState = 'DepositPeriod' | 'VotingPeriod' | 'Passed' | 'Rejected' | 'Failed';
export interface ICosmosProposalTally {
  yes: CosmosToken;
  abstain: CosmosToken;
  no: CosmosToken;
  noWithVeto: CosmosToken;
}

// TODO: note that these vote number values are in terms of _stake_
export interface ICosmosProposalState extends ICompletable {
  status: CosmosProposalState;
  depositors: Array<[ string, BN ]>;
  totalDeposit: BN;
  voters: Array<[ string, CosmosVoteChoice ]>;
  tally: ICosmosProposalTally;
}

export interface ICosmosProposal extends IIdentifiable {
  type: CosmosProposalType;
  title: string;
  description: string;
  proposer: string;
  submitTime: moment.Moment;
  depositEndTime: moment.Moment;
  votingStartTime: moment.Moment;
  votingEndTime: moment.Moment;

  // partially populated initial state update -- no depositors or voters
  state: ICosmosProposalState;
}
