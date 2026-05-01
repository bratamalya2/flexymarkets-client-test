import CandlestickChartOutlinedIcon from '@mui/icons-material/CandlestickChartOutlined';
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import TradeModalContent from './TradeModalContent';
import SetBalanceModalContent from './SetBalanceModalContent';

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

const commonDetailsData = (isReal) => isReal
    ?
    {
        "Number": "#404714946",
        "Platform": "mt5",
        "Type": "Standard",
        "Server": `${SHORT_BRAND_NAME}-MT5Real8`,
        "Free margin": "0.00 USD",
        "Actual leverage": "1:200",
        "Max leverage": "1:200"
    }
    :
    {
        "Number": "#239177571",
        "Platform": "mt5",
        "Type": "Standard",
        "Server": `${SHORT_BRAND_NAME}-MT5Trial6`,
        "Free margin": "0.00 USD",
        "Actual leverage": "1:200",
        "Max leverage": "1:200"
    }


const menuData = (isReal) => isReal
    ?
    [
        "Transfer funds",
        "Change max leverage",
        "Add nickname",
        "Account information",
        "Set read-only access",
        "Manage your statements",
        "Change trading password",
        "Archive account"
    ]
    :
    [
        "Change max leverage",
        "Add nickname",
        "Account information",
        "Set read-only access",
        "Manage your statements",
        "Change trading password",
        "Archive account"
    ];

const commonButtons = (isReal) => [
    { name: "Trade", icon: CandlestickChartOutlinedIcon, type: "modal", modalType: TradeModalContent },
    !isReal && { name: "Set Balance", icon: ArrowCircleDownOutlinedIcon, type: "modal", modalType: SetBalanceModalContent },
    isReal && { name: "Deposit", icon: ArrowCircleDownOutlinedIcon, type: "redirect", link: "/client/transactions/deposit" },
    isReal && { name: "Withdraw", icon: ArrowCircleUpOutlinedIcon, type: "redirect", link: "/client/transactions/withdrawal" },
].filter(Boolean);

// Demo Account Data
export const demoGridAccountDetails = {
    detailsData: commonDetailsData(false),
    accountTypeAndNumber: { type: 'Demo', number: "#239177571" },
    menuData: menuData(false),
    actionButtons: commonButtons(false)
};

// Real Account Data
export const realGridAccountDetails = {
    detailsData: commonDetailsData(true),
    accountTypeAndNumber: { type: 'Real', number: "#404714946" },
    menuData: menuData(true),
    actionButtons: commonButtons(true)
};