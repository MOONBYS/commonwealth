/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ProjectInterface extends ethers.utils.Interface {
  functions: {
    "acceptedTokens(uint256)": FunctionFragment;
    "addNominations(address[])": FunctionFragment;
    "back(address,uint256)": FunctionFragment;
    "backWithETH()": FunctionFragment;
    "curate(address,uint256)": FunctionFragment;
    "curateWithETH()": FunctionFragment;
    "curatorFee()": FunctionFragment;
    "deadline()": FunctionFragment;
    "funded()": FunctionFragment;
    "getBToken(address)": FunctionFragment;
    "getCToken(address)": FunctionFragment;
    "initialize(tuple,address[],address[],uint256,uint256,uint256)": FunctionFragment;
    "isAcceptedToken(address)": FunctionFragment;
    "isNominationed(address)": FunctionFragment;
    "lockedWithdraw()": FunctionFragment;
    "metaData()": FunctionFragment;
    "redeemBToken(address,uint256)": FunctionFragment;
    "redeemCToken(address,uint256)": FunctionFragment;
    "removeNominations(address[])": FunctionFragment;
    "setBeneficiary(address)": FunctionFragment;
    "setCwUrl(bytes32)": FunctionFragment;
    "setIpfsHash(bytes32)": FunctionFragment;
    "setName(bytes32)": FunctionFragment;
    "threshold()": FunctionFragment;
    "totalFunding()": FunctionFragment;
    "withdraw()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "acceptedTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addNominations",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "back",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "backWithETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "curate",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "curateWithETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "curatorFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "deadline", values?: undefined): string;
  encodeFunctionData(functionFragment: "funded", values?: undefined): string;
  encodeFunctionData(functionFragment: "getBToken", values: [string]): string;
  encodeFunctionData(functionFragment: "getCToken", values: [string]): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      {
        name: BytesLike;
        ipfsHash: BytesLike;
        cwUrl: BytesLike;
        beneficiary: string;
        creator: string;
        id: BigNumberish;
        factory: string;
        hashBytes: BytesLike;
      },
      string[],
      string[],
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isAcceptedToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isNominationed",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "lockedWithdraw",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "metaData", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeemBToken",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemCToken",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeNominations",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setBeneficiary",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setCwUrl", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "setIpfsHash",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "setName", values: [BytesLike]): string;
  encodeFunctionData(functionFragment: "threshold", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalFunding",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "acceptedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addNominations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "back", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "backWithETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "curate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "curateWithETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "curatorFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deadline", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "funded", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getCToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isAcceptedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isNominationed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockedWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "metaData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemBToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redeemCToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeNominations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBeneficiary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setCwUrl", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setIpfsHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setName", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "threshold", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalFunding",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "Curate(address,address,uint256)": EventFragment;
    "Deposit(address,address,uint256)": EventFragment;
    "Failed()": EventFragment;
    "Nominated(uint256,address)": EventFragment;
    "Succeeded()": EventFragment;
    "Withdraw(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Curate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Failed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Nominated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Succeeded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export class Project extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ProjectInterface;

  functions: {
    acceptedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    addNominations(
      _nominations: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    back(
      _token: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    backWithETH(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    curate(
      _token: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    curateWithETH(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    curatorFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    deadline(overrides?: CallOverrides): Promise<[BigNumber]>;

    funded(overrides?: CallOverrides): Promise<[boolean]>;

    getBToken(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    getCToken(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _metaData: {
        name: BytesLike;
        ipfsHash: BytesLike;
        cwUrl: BytesLike;
        beneficiary: string;
        creator: string;
        id: BigNumberish;
        factory: string;
        hashBytes: BytesLike;
      },
      _tokens: string[],
      _nominations: string[],
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isAcceptedToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isNominationed(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    lockedWithdraw(overrides?: CallOverrides): Promise<[boolean]>;

    metaData(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, string, BigNumber, string, string] & {
        name: string;
        ipfsHash: string;
        cwUrl: string;
        beneficiary: string;
        creator: string;
        id: BigNumber;
        factory: string;
        hashBytes: string;
      }
    >;

    redeemBToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemCToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeNominations(
      _nominations: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setBeneficiary(
      _beneficiary: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setCwUrl(
      _cwUrl: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setIpfsHash(
      _ipfsHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setName(
      _name: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    threshold(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalFunding(overrides?: CallOverrides): Promise<[BigNumber]>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  acceptedTokens(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  addNominations(
    _nominations: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  back(
    _token: string,
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  backWithETH(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  curate(
    _token: string,
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  curateWithETH(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  curatorFee(overrides?: CallOverrides): Promise<BigNumber>;

  deadline(overrides?: CallOverrides): Promise<BigNumber>;

  funded(overrides?: CallOverrides): Promise<boolean>;

  getBToken(arg0: string, overrides?: CallOverrides): Promise<string>;

  getCToken(arg0: string, overrides?: CallOverrides): Promise<string>;

  initialize(
    _metaData: {
      name: BytesLike;
      ipfsHash: BytesLike;
      cwUrl: BytesLike;
      beneficiary: string;
      creator: string;
      id: BigNumberish;
      factory: string;
      hashBytes: BytesLike;
    },
    _tokens: string[],
    _nominations: string[],
    _threshold: BigNumberish,
    _deadline: BigNumberish,
    _curatorFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isAcceptedToken(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  isNominationed(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  lockedWithdraw(overrides?: CallOverrides): Promise<boolean>;

  metaData(
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, string, string, BigNumber, string, string] & {
      name: string;
      ipfsHash: string;
      cwUrl: string;
      beneficiary: string;
      creator: string;
      id: BigNumber;
      factory: string;
      hashBytes: string;
    }
  >;

  redeemBToken(
    _token: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemCToken(
    _token: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeNominations(
    _nominations: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setBeneficiary(
    _beneficiary: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setCwUrl(
    _cwUrl: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setIpfsHash(
    _ipfsHash: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setName(
    _name: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  threshold(overrides?: CallOverrides): Promise<BigNumber>;

  totalFunding(overrides?: CallOverrides): Promise<BigNumber>;

  withdraw(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    addNominations(
      _nominations: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    back(
      _token: string,
      _value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    backWithETH(overrides?: CallOverrides): Promise<boolean>;

    curate(
      _token: string,
      _value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    curateWithETH(overrides?: CallOverrides): Promise<boolean>;

    curatorFee(overrides?: CallOverrides): Promise<BigNumber>;

    deadline(overrides?: CallOverrides): Promise<BigNumber>;

    funded(overrides?: CallOverrides): Promise<boolean>;

    getBToken(arg0: string, overrides?: CallOverrides): Promise<string>;

    getCToken(arg0: string, overrides?: CallOverrides): Promise<string>;

    initialize(
      _metaData: {
        name: BytesLike;
        ipfsHash: BytesLike;
        cwUrl: BytesLike;
        beneficiary: string;
        creator: string;
        id: BigNumberish;
        factory: string;
        hashBytes: BytesLike;
      },
      _tokens: string[],
      _nominations: string[],
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isAcceptedToken(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    isNominationed(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    lockedWithdraw(overrides?: CallOverrides): Promise<boolean>;

    metaData(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, string, BigNumber, string, string] & {
        name: string;
        ipfsHash: string;
        cwUrl: string;
        beneficiary: string;
        creator: string;
        id: BigNumber;
        factory: string;
        hashBytes: string;
      }
    >;

    redeemBToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    redeemCToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    removeNominations(
      _nominations: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    setBeneficiary(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setCwUrl(_cwUrl: BytesLike, overrides?: CallOverrides): Promise<void>;

    setIpfsHash(_ipfsHash: BytesLike, overrides?: CallOverrides): Promise<void>;

    setName(_name: BytesLike, overrides?: CallOverrides): Promise<void>;

    threshold(overrides?: CallOverrides): Promise<BigNumber>;

    totalFunding(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    Curate(
      sender?: null,
      token?: null,
      amount?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { sender: string; token: string; amount: BigNumber }
    >;

    Deposit(
      sender?: null,
      token?: null,
      amount?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { sender: string; token: string; amount: BigNumber }
    >;

    Failed(): TypedEventFilter<[], {}>;

    Nominated(
      projectId?: null,
      addr?: null
    ): TypedEventFilter<
      [BigNumber, string],
      { projectId: BigNumber; addr: string }
    >;

    Succeeded(): TypedEventFilter<[], {}>;

    Withdraw(
      sender?: null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { sender: string; amount: BigNumber }
    >;
  };

  estimateGas: {
    acceptedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addNominations(
      _nominations: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    back(
      _token: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    backWithETH(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    curate(
      _token: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    curateWithETH(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    curatorFee(overrides?: CallOverrides): Promise<BigNumber>;

    deadline(overrides?: CallOverrides): Promise<BigNumber>;

    funded(overrides?: CallOverrides): Promise<BigNumber>;

    getBToken(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    getCToken(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _metaData: {
        name: BytesLike;
        ipfsHash: BytesLike;
        cwUrl: BytesLike;
        beneficiary: string;
        creator: string;
        id: BigNumberish;
        factory: string;
        hashBytes: BytesLike;
      },
      _tokens: string[],
      _nominations: string[],
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isAcceptedToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isNominationed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    lockedWithdraw(overrides?: CallOverrides): Promise<BigNumber>;

    metaData(overrides?: CallOverrides): Promise<BigNumber>;

    redeemBToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemCToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeNominations(
      _nominations: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setBeneficiary(
      _beneficiary: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setCwUrl(
      _cwUrl: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setIpfsHash(
      _ipfsHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setName(
      _name: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    threshold(overrides?: CallOverrides): Promise<BigNumber>;

    totalFunding(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addNominations(
      _nominations: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    back(
      _token: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    backWithETH(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    curate(
      _token: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    curateWithETH(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    curatorFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deadline(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    funded(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _metaData: {
        name: BytesLike;
        ipfsHash: BytesLike;
        cwUrl: BytesLike;
        beneficiary: string;
        creator: string;
        id: BigNumberish;
        factory: string;
        hashBytes: BytesLike;
      },
      _tokens: string[],
      _nominations: string[],
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isAcceptedToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isNominationed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockedWithdraw(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    metaData(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeemBToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemCToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeNominations(
      _nominations: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setBeneficiary(
      _beneficiary: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setCwUrl(
      _cwUrl: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setIpfsHash(
      _ipfsHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setName(
      _name: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    threshold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalFunding(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
