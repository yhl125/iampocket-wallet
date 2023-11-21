import {
  IConditionalLogic,
  IExecutionConstraints,
  ICircuitLog,
  ICheckWhenConditionMetLog,
  IConditionLog,
  ITransactionLog,
  IUserOperationLog,
  IFetchActionViemTransaction,
  IFetchActionZeroDevUserOperation,
  IViemContractCondition,
  IViemEventCondition,
  IViemTransactionAction,
  IWebhookCondition,
  IZeroDevUserOperationAction,
} from '@lit-listener-sdk/types';
import { LIT_NETWORKS_KEYS } from '@lit-protocol/types';

export interface Circuit {
  _id: string;

  name?: string;

  description?: string;

  type: 'viem' | 'zerodev';

  status: 'running' | 'stopped' | 'server-down-stopped';

  pkpPubKey: string;

  litNetwork: LIT_NETWORKS_KEYS;

  conditions: (
    | IWebhookCondition
    | IViemContractCondition
    | IViemEventCondition
  ) &
    { name?: string; description?: string }[];

  conditionalLogic: IConditionalLogic;

  options: IExecutionConstraints;

  actions: (
    | IFetchActionViemTransaction
    | IViemTransactionAction
    | IFetchActionZeroDevUserOperation
    | IZeroDevUserOperationAction
  ) &
    { name?: string; description?: string }[];

  circuitLogs: ICircuitLog[];

  conditionLogs: IConditionLog[];

  checkWhenConditionMetLogs: ICheckWhenConditionMetLog[];

  transactionLogs: ITransactionLog[];

  userOperationLogs: IUserOperationLog[];
}
