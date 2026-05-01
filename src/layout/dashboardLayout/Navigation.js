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
import { useGetUserDataQuery } from '../../globalState/userState/userStateApis';
import LogoutIcon from '@mui/icons-material/Logout';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';


// export const NAVIGATION = [
export const getNavigationConfig = (isIbOrSubIb = false) => [
    // {
    //     segment: '/client/dashboard',
    //     title: 'Dashboard',
    //     icon: DashboardOutlinedIcon,
    // },
    {
        segment: '/client/myAccount',
        title: 'My Account',
        icon: AccountBoxOutlinedIcon
    },
    {
        title: 'MT5 List',
        icon: ChecklistIcon,
        children: [
            // {
            //     segment: '/client/MT5RequestList',
            //     title: 'MT5 request list',
            //     icon: CircleOutlinedIcon
            // },
            {
                segment: '/client/MT5AccountList',
                title: 'MT5 account list',
                icon: CircleOutlinedIcon
            },
        ]
    },
    {
        title: 'Compliance',
        icon: UploadFileOutlinedIcon,
        children: [
            // {
            //     segment: '/client/compliance/documentUpload',
            //     title: 'Document Upload',
            //     icon: CircleOutlinedIcon,
            // },
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
    {
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
            // {
            //     segment: '/client/transactions/history',
            //     title: 'Transactions history',
            //     icon: CircleOutlinedIcon,
            // },
            {
                segment: '/client/transactions/depositWithdrawList',
                title: 'Deposit withdraw list',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/transactions/transactionsList',
                title: 'Transactions List',
                icon: CircleOutlinedIcon
            },
        ],
    },
    // {
    //     title: 'Analytics',
    //     icon: InsertChartOutlinedIcon,
    //     children: [
    //         {
    //             segment: 'https://flexymarkets.com/economic_calender',
    //             title: 'Economic Calendar',
    //             icon: CircleOutlinedIcon,
    //             external: true
    //         },
    //         {
    //             segment: '/client/analytics/analystViews',
    //             title: 'Analyst Views',
    //             icon: CircleOutlinedIcon
    //         },
    //         {
    //             segment: '/client/analytics/marketNews',
    //             title: 'Market News',
    //             icon: CircleOutlinedIcon
    //         }
    //     ],
    // },
    {
        title: 'Performance',
        icon: SignalCellularAltIcon,
        children: [
            // {
            //     segment: '/client/performance/ordersSummary',
            //     title: 'Summary',
            //     icon: CircleOutlinedIcon
            // },
            {
                segment: '/client/performance/ordersHistory',
                title: 'History of orders',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/performance/benefits',
                title: 'Benefits',
                icon: CircleOutlinedIcon
            },
            {
                segment: '/client/performance/quotes',
                title: 'Quotes',
                icon: CircleOutlinedIcon
            }
        ],
    },
    // {
    //     title: "Promotions",
    //     icon: CardGiftcardOutlinedIcon,
    //     segment: "/client/promotions"
    // },
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
            // {
            //     segment: '/client/settings/virtualPrivateServer',
            //     title: 'Virtual Private Server',
            //     icon: CircleOutlinedIcon,
            // }
        ],
    },
    {
        title: 'IB Programme',
        icon: AssistantOutlinedIcon,
        children: isIbOrSubIb ?
            [
                // {
                //     segment: '/client/IBProgramme/IBDashboard',
                //     title: 'IB ELITE',
                //     icon: CircleOutlinedIcon
                // },
                {
                    segment: '/client/IBProgramme/IBDashboard',
                    title: 'IB Dashboard',
                    icon: CircleOutlinedIcon
                },
                {
                    segment: '/client/IBProgramme/IBOverview',
                    title: 'IB Overview',
                    icon: CircleOutlinedIcon
                },
                {
                    segment: '/client/IBProgramme/myClients',
                    title: 'My Clients',
                    icon: CircleOutlinedIcon
                },
                // {
                //     segment: '/client/IBProgramme/treeChart',
                //     title: 'Tree Chart',
                //     icon: CircleOutlinedIcon
                // },
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
                        // {
                        //     segment: '/client/IBProgramme/teamDepositReport',
                        //     title: 'Deposit Report',
                        //     icon: CircleOutlinedIcon
                        // },
                        // {
                        //     segment: '/client/IBProgramme/teamWithdrawReport',
                        //     title: 'Withdraw Report',
                        //     icon: CircleOutlinedIcon
                        // },
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
                                // {
                                //     segment: '/client/IBProgramme/commissionReport',
                                //     title: 'Commission',
                                //     icon: CircleOutlinedIcon
                                // },
                                {
                                    segment: '/client/IBProgramme/analyticsReport',
                                    title: 'Analytics',
                                    icon: CircleOutlinedIcon
                                },
                            ]
                        }
                    ]
                },
                // {
                //     segment: '/client/IBProgramme/myCommission',
                //     title: 'My Commission',
                //     icon: CircleOutlinedIcon
                // },
                // {
                //     segment: '/client/IBProgramme/IBWithdraw',
                //     title: 'IB Withdraw',
                //     icon: CircleOutlinedIcon
                // },
                // {
                //     segment: '/client/IBProgramme/teamDepositReport',
                //     title: 'Team Deposit Report',
                //     icon: CircleOutlinedIcon
                // },
                // {
                //     segment: '/client/IBProgramme/teamWithdrawReport',
                //     title: 'Team Withdraw Report',
                //     icon: CircleOutlinedIcon
                // },
            ]
            :
            [
                {
                    segment: '/client/IBProgramme/IBRequest',
                    title: 'IB Request',
                    icon: CircleOutlinedIcon
                }
            ]
    },
    // {
    //     title: 'My Reports',
    //     icon: AssessmentOutlinedIcon,
    //     children: [
    //         {
    //             segment: '/client/myReports/deposit',
    //             title: 'Deposit Report',
    //             icon: CircleOutlinedIcon,
    //         },
    //         {
    //             segment: '/client/myReports/withdrawal',
    //             title: 'Withdraw Report',
    //             icon: CircleOutlinedIcon,
    //         },
    //         {
    //             segment: '/client/myReports/internalTransfer',
    //             title: 'Internal Transfer Report',
    //             icon: CircleOutlinedIcon,
    //         },
    //         {
    //             segment: '/client/myReports/dealReport',
    //             title: 'Deal Report',
    //             icon: CircleOutlinedIcon,
    //         }
    //     ],
    // },
    // {
    //     title: 'My Wallet',
    //     icon: AccountBalanceWalletOutlinedIcon,
    //     children: [
    //         {
    //             segment: '/client/myWallet/walletHistory',
    //             title: 'Wallet History',
    //             icon: CircleOutlinedIcon,
    //         },
    //         {
    //             segment: '/client/myWallet/MT5ToWallet',
    //             title: 'MT5 To Wallet',
    //             icon: CircleOutlinedIcon,
    //         },
    //         {
    //             segment: '/client/myWallet/walletToMT5',
    //             title: 'Wallet To MT5',
    //             icon: CircleOutlinedIcon,
    //         }
    //     ],
    // },
    // {
    //     segment: '/client/news',
    //     title: 'News',
    //     icon: ArticleOutlinedIcon,
    // },
    {
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
    },
    {
        title: 'Logout',
        icon: LogoutIcon,
    },
];