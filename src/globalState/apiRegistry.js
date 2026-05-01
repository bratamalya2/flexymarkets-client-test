import { authApi } from './auth/authApis';
import { complianceStateApis } from './complianceState/complianceStateApis';
import { ibStateApis } from './ibState/ibStateApis';
import { referralStateApis } from './referralState/referralStateApis';
import { userStateApis } from './userState/userStateApis';
import { mt5StateApis } from './mt5State/mt5StateApis';
import { groupStateApis } from './groupState/groupStateApis';
import { supportStateApis } from './supportState/supportStateApis';
import { otherContentStateApis } from './otherContentState/otherContentStateApis';
import { tradeStateApis } from './trade/tradeApis';

export const allApiSlices = [
  authApi,
  complianceStateApis,
  referralStateApis,
  userStateApis,
  supportStateApis,
  groupStateApis,
  ibStateApis,
  mt5StateApis,
  otherContentStateApis,
  tradeStateApis
];