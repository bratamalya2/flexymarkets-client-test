import CandlestickChartOutlinedIcon from '@mui/icons-material/CandlestickChartOutlined';
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TradeModalContent from './TradeModalContent';
import SetBalanceModalContent from './SetBalanceModalContent';
import { useMt5AccountListQuery } from '../../../../globalState/mt5State/mt5StateApis';
import ChangeMaxLeverageModalContent from './ChangeMaxLeverageModalContent';
import AccountInformationModalContent from './AccountInformationModalContent';
import ChangeMT5PasswordModalDetails from '../../ChangeMT5PasswordModalDetails';
import SetReadOnlyAccessModalContent from './SetReadOnlyAccessModalContent';
import MetaDeposit from '../accountDetailsAccordian/MetaDeposit';
import MetaWithdraw from '../accountDetailsAccordian/MetaWithdraw';

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

const commonDetailsData = {
    "Actual leverage": "1:200 (max 1:200)",
    "Free margin": "0.00 USD",
    "Unrealized P&L": "0.00 USD",
    "Equity": "0.00 USD"
};

const commonAccountDetailsID = (server, id) => [
    { type: "Server", id: server, icon: ContentCopyIcon },
    { type: "MT5 login", id, icon: ContentCopyIcon }
];

const commonButtons = (isReal) => [
    { name: "Trade", icon: CandlestickChartOutlinedIcon, type: "modal", modal: TradeModalContent },
    !isReal && { name: "Set Balance", icon: ArrowCircleDownOutlinedIcon, type: "modal", modal: SetBalanceModalContent },
    isReal && { name: "Deposit", icon: ArrowCircleDownOutlinedIcon, type: "redirect", modal: MetaDeposit },
    isReal && { name: "Withdraw", icon: ArrowCircleUpOutlinedIcon, type: "redirect", modal: MetaWithdraw },
    {
        icon: MoreVertOutlinedIcon,
        type: "menu",
        menuItems: isReal
            ?
            [
                { name: "Transfer funds", link: "/client/transactions/internalTransfer" },
                { name: "Change max leverage", modalContent: ChangeMaxLeverageModalContent },
                { name: "Account information", modalContent: AccountInformationModalContent },
                { name: "Set read-only access", modalContent: SetReadOnlyAccessModalContent },
                { name: "Change trading password", modalContent: ChangeMT5PasswordModalDetails }
            ]
            :
            [
                { name: "Change max leverage", modalContent: ChangeMaxLeverageModalContent },
                { name: "Account information", modalContent: AccountInformationModalContent },
                { name: "Set read-only access", modalContent: SetReadOnlyAccessModalContent },
                { name: "Change trading password", modalContent: ChangeMT5PasswordModalDetails }
            ]
    }
].filter(Boolean);

// Demo Account Data
export const demoListAccountDetails = {
    detailsData: commonDetailsData,
    typeDetails: { type: "Demo", MTVersion: "MT5", accountType: "Standard", accountId: "#239177571", totalAmount: "0" },
    detailsID: commonAccountDetailsID(`${SHORT_BRAND_NAME}-MT5Trial6`, "239177571"),
    actionButtons: commonButtons(false)
};

// Real Account Data
export const realListAccountDetails = {
    detailsData: commonDetailsData,
    typeDetails: { type: "Real", MTVersion: "MT5", accountType: "Standard", accountId: "#404714946", totalAmount: "0" },
    detailsID: commonAccountDetailsID(`${SHORT_BRAND_NAME}-server`, "404714946"),
    actionButtons: commonButtons(true)
};