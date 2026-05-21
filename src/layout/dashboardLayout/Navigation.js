import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ChecklistIcon from '@mui/icons-material/Checklist';
import LogoutIcon from '@mui/icons-material/Logout';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

// Features enabled by default — set to 'false' in .env to disable
const USER_MANAGEMENT_ENABLED = import.meta.env.VITE_ENABLE_USER_MANAGEMENT !== 'false';
const TRANSACTION_ENABLED = import.meta.env.VITE_ENABLE_TRANSACTION !== 'false';
const PARTNER_MANAGEMENT_ENABLED = import.meta.env.VITE_ENABLE_PARTNER_MANAGEMENT !== 'false';
const TICKETS_ENABLED = import.meta.env.VITE_ENABLE_TICKETS !== 'false';
const NEWS_ENABLED = import.meta.env.VITE_ENABLE_NEWS !== 'false';
const REWARDS_ENABLED = import.meta.env.VITE_ENABLE_REWARDS !== 'false';
const ALL_REPORTS_ENABLED = import.meta.env.VITE_ENABLE_ALL_REPORTS !== 'false';

// Features disabled by default — set to 'true' in .env to enable
const COPY_TRADING_ENABLED = import.meta.env.VITE_ENABLE_COPY_TRADING === 'true';
const BOT_MANAGEMENT_ENABLED = import.meta.env.VITE_ENABLE_BOT_MANAGEMENT === 'true';

// Helper: returns Partner Programme sub-menu items based on user type
const getPartnerProgrammeMenu = (userType) => {
    // Full IB access
    if (userType === 'ib') {
        return [
            {
                segment: '/client/IBProgramme/IBDashboard',
                title: 'Partner Dashboard',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/IBProgramme/IBOverview',
                title: 'Partner Overview',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/IBProgramme/myClients',
                title: 'Partner Clients',
                icon: CircleOutlinedIcon
            },
            {
                title: 'Reports',
                icon: InsertChartOutlinedIcon,
                children: [
                    {
                        segment: '/client/IBProgramme/myCommission',
                        title: 'My Commission',
                        icon: CircleOutlinedIcon
                    },
                    {
                        segment: '/client/IBProgramme/IBWithdraw',
                        title: 'IB Withdraw',
                        icon: CircleOutlinedIcon
                    },
                    {
                        segment: '/client/IBProgramme/myClientTransaction',
                        title: 'Client Transaction',
                        icon: CircleOutlinedIcon
                    },
                    {
                        title: 'Trader/Sub IB',
                        icon: InsertChartOutlinedIcon,
                        children: [
                            {
                                segment: '/client/IBProgramme/transactionReport',
                                title: 'Transaction',
                                icon: CircleOutlinedIcon
                            },
                            {
                                segment: '/client/IBProgramme/tradeReport',
                                title: 'Trade',
                                icon: CircleOutlinedIcon
                            },
                            {
                                segment: '/client/IBProgramme/liveAccountReport',
                                title: 'Live Account',
                                icon: CircleOutlinedIcon
                            },
                            {
                                segment: '/client/IBProgramme/analyticsReport',
                                title: 'Analytics',
                                icon: CircleOutlinedIcon
                            },
                        ]
                    }
                ]
            },
        ];
    }

    // Sub-IB: limited access
    if (userType === 'subIb') {
        return [
            {
                segment: '/client/IBProgramme/IBDashboard',
                title: 'Partner Dashboard',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/IBProgramme/myClients',
                title: 'My Clients',
                icon: CircleOutlinedIcon
            },
            {
                title: 'Reports',
                icon: InsertChartOutlinedIcon,
                children: [
                    {
                        segment: '/client/IBProgramme/myCommission',
                        title: 'My Commission',
                        icon: CircleOutlinedIcon
                    },
                    {
                        segment: '/client/IBProgramme/IBWithdraw',
                        title: 'IB Withdraw',
                        icon: CircleOutlinedIcon
                    },
                    {
                        segment: '/client/IBProgramme/myClientTransaction',
                        title: 'Client Transaction',
                        icon: CircleOutlinedIcon
                    },
                ]
            },
        ];
    }

    // Regular client: only IB application
    return [
        {
            segment: '/client/IBProgramme/IBRequest',
            title: 'IB Request',
            icon: CircleOutlinedIcon
        }
    ];
};

export const getNavigationConfig = (userType = 'client') => [
    // My Account, Trading Accounts, Compliance
    ...(USER_MANAGEMENT_ENABLED ? [
        {
            segment: '/client/myAccount',
            title: 'My Account',
            icon: AccountBoxOutlinedIcon
        },
        {
            segment: '/client/MT5AccountList',
            title: 'Trading Accounts',
            icon: ChecklistIcon
        },
        {
            title: 'Compliance',
            icon: UploadFileOutlinedIcon,
            children: [
                {
                    segment: '/client/compliance/bank/add',
                    title: 'Bank Details',
                    icon: CircleOutlinedIcon
                },
                {
                    segment: '/client/compliance/document/list',
                    title: 'Document List',
                    icon: CircleOutlinedIcon
                },
            ],
        },
    ] : []),

    // My Transactions
    ...(TRANSACTION_ENABLED ? [{
        title: 'My Transactions',
        icon: AccountBalanceOutlinedIcon,
        children: [
            {
                segment: '/client/transactions/deposit',
                title: 'Deposit',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/transactions/withdrawal',
                title: 'Withdrawal',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/transactions/internalTransfer',
                title: 'Internal transfer',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/transactions/depositWithdrawList',
                title: 'Wallet Transactions History',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/transactions/transactionsList',
                title: 'Accounts Transaction History',
                icon: CircleOutlinedIcon
            },
        ],
    }] : []),

    // History of orders
    ...(ALL_REPORTS_ENABLED ? [{
        segment: '/client/ordersHistory',
        title: 'History of orders',
        icon: HistoryToggleOffIcon
    }] : []),

    // Copy Trading
    ...(COPY_TRADING_ENABLED ? [{
        segment: '/client/copytrading',
        title: 'Copy Trading',
        icon: ConnectWithoutContactIcon
    }] : []),

    // Bots
    ...(BOT_MANAGEMENT_ENABLED ? [{
        segment: '/client/bots',
        title: 'Bots',
        icon: SmartToyOutlinedIcon
    }] : []),

    // Promotions
    ...(REWARDS_ENABLED ? [{
        segment: '/client/promotions',
        title: 'Promotions',
        icon: CardGiftcardOutlinedIcon,
    }] : []),

    // News
    ...(NEWS_ENABLED ? [{
        segment: '/client/news',
        title: 'News',
        icon: ArticleOutlinedIcon,
    }] : []),

    // Settings — always visible
    {
        title: 'Settings',
        icon: SettingsOutlinedIcon,
        children: [
            {
                segment: '/client/settings/profile',
                title: 'Profile',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/settings/securitySettings',
                title: 'Security Settings',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/settings/tradingTerminals',
                title: 'Trading Terminals',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/settings/tradingConditions',
                title: 'Trading Conditions',
                icon: CircleOutlinedIcon
            },
        ],
    },

    // Partner Programme
    ...(PARTNER_MANAGEMENT_ENABLED ? [{
        title: 'Partner Programme',
        icon: AssistantOutlinedIcon,
        children: getPartnerProgrammeMenu(userType)
    }] : []),

    // Help Desk
    ...(TICKETS_ENABLED ? [{
        title: 'Help Desk',
        icon: HelpCenterOutlinedIcon,
        children: [
            {
                segment: '/client/helpDesk/newTicket',
                title: 'New Ticket',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/helpDesk/myTickets',
                title: 'My Tickets',
                icon: CircleOutlinedIcon
            }
        ],
    }] : []),

    // Logout — always visible
    {
        title: 'Logout',
        icon: LogoutIcon,
    },
];
