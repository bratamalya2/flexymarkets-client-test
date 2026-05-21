import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import IBConditionRouting from '../components/IBConditionRouting.jsx';
import RedirectIfIB from '../components/RedirectIfIB';
import MT5AccountsDetails from '../pages/MT5Account/mt5AccountList/MT5AccountsDetails.jsx';
import OrderHistory from '../pages/performance/orderHistory/OrderHistory.jsx';
import QuotesTable from '../pages/performance/quotes/QuotesTable.jsx';
import Quotes from '../pages/performance/quotes/Quotes.jsx';
import BotList from '../pages/bots/BotList.jsx';
import IBTransactionListPage from '../pages/IBProgramme/IBDashboard/Transaction/IBTransactionListPage.jsx';
import KYCListPage from '../pages/IBProgramme/IBDashboard/KycData/KYCListPage.jsx';

// Promotions
const FullDepositBonus = lazy(() => import('../pages/promotions/fullDepositBonus/FullDepositBonus.jsx'));
const TradeOrTreatLuckyDraw = lazy(() => import('../pages/promotions/tradeOrTreatLuckyDraw/TradeOrTreatLuckyDraw.jsx'));
const FreeVPS = lazy(() => import('../pages/promotions/freeVPS/FreeVPS.jsx'));

// Lazy loaded pages
const Deposit = lazy(() => import("../pages/transactions/deposit/Deposit.jsx"));
const WithDrawal = lazy(() => import("../pages/transactions/withdrawal/WithDrawal.jsx"));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard.jsx'));
const DocumentsUpload = lazy(() => import('../pages/compliance/documentsUpload/DocumentsUpload.jsx'));
const DealReport = lazy(() => import('../pages/myReports/dealReport/DealReport.jsx'));
const DepositReport = lazy(() => import('../pages/myReports/depositReport/DepositReport.jsx'));
const WithdrawReport = lazy(() => import('../pages/myReports/withdrawReport/WithdrawReport.jsx'));
const InternalTransferReport = lazy(() => import('../pages/myReports/internalTransferReport/InternalTransferReport.jsx'));
const WalletHistory = lazy(() => import("../pages/myWallet/walletHistory/WalletHistory.jsx"));
const MT5ToWallet = lazy(() => import("../pages/myWallet/MT5ToWallet/MT5ToWallet.jsx"));
const WalletToMT5 = lazy(() => import("../pages/myWallet/walletToMT5/WalletToMT5.jsx"));
const News = lazy(() => import("../pages/news/News.jsx"));
const MyTickets = lazy(() => import("../pages/helpDesk/myTickets/MyTickets.jsx"));
const NewTicket = lazy(() => import("../pages/helpDesk/newTicket/NewTicket.jsx"));
const IBDashboard = lazy(() => import("../pages/IBProgramme/IBDashboard/IBDashboard.jsx"));
const MyClients = lazy(() => import("../pages/IBProgramme/myClients/MyClients.jsx"));
const TreeChart = lazy(() => import("../pages/IBProgramme/treeChart/TreeChart.jsx"));
const MyCommission = lazy(() => import("../pages/IBProgramme/myCommission/MyCommission.jsx"));
const IBWithdraw = lazy(() => import("../pages/IBProgramme/IBWithdraw/IBWithdraw.jsx"));
const TeamDepositReport = lazy(() => import("../pages/IBProgramme/teamDepositReport/TeamDepositReport.jsx"));
const TeamWithdrawReport = lazy(() => import("../pages/IBProgramme/teamWithdrawReport/TeamWithdrawReport.jsx"));
const UploadedDocumentList = lazy(() => import("../pages/compliance/documentList/DocumentList.jsx"));
const MyAccount = lazy(() => import("../pages/myAccount/liveAccount/MyAccount.jsx"));
const OpenAccountPlanSection = lazy(() => import('../pages/myAccount/liveAccount/openAccount/openAccountPlanSection/OpenAccountPlanSection.jsx'));
const OpenAccountFormLayout = lazy(() => import('../pages/myAccount/liveAccount/openAccount/openAccountForm/OpenAccountFormLayout.jsx'));
const BankDepositForm = lazy(() => import('../pages/transactions/deposit/bankDeposit/BankDepositForm.jsx'));
const BankWithdrawalForm = lazy(() => import('../pages/transactions/withdrawal/bankWithdrawal/BankWithdrawalForm.jsx'));
const TransactionsHistory = lazy(() => import("../pages/transactions/transactionsHistory/TransactionsHistory.jsx"));
const Analytics = lazy(() => import("../pages/analytics/Analytics.jsx"));
const Performance = lazy(() => import("../pages/performance/Performance.jsx"));
const Settings = lazy(() => import('../pages/settings/Settings.jsx'));
const KycVerification = lazy(() => import('../pages/kycVerification/KycVerification.jsx'));
const AddBank = lazy(() => import('../pages/compliance/addBank/AddBank.jsx'));
const IBRequest = lazy(() => import('../pages/IBProgramme/IBRequest/IBRequest.jsx'));
const DepositWithdrawList = lazy(() => import('../pages/transactions/depositWithdrawList/DepositWithdrawList.jsx'));
const TransactionsList = lazy(() => import('../pages/transactions/transactionsList/TransactionsList.jsx'));
const Auth = lazy(() => import('../authPages/Auth.jsx'));
const ResetPassword = lazy(() => import('../authPages/resetPassword/ResetPassword.jsx'));
const MT5AccountList = lazy(() => import('../pages/MT5Account/mt5AccountList/MT5AccountList.jsx'));
const CryptoDeposit = lazy(() => import('../pages/transactions/deposit/cryptoDeposit/CryptoDeposit.jsx'));
const ShowTicket = lazy(() => import('../pages/helpDesk/showTicket/ShowTicket.jsx'));
const CryptoWithdrawal = lazy(() => import('../pages/transactions/withdrawal/cryptoWithdrawal/CryptoWithdrawal.jsx'));
const Transfer = lazy(() => import('../pages/transactions/transfer/Transfer.jsx'));
const TransferWithdrawal = lazy(() => import('../pages/transactions/transfer/transferWithdrawal/TransferWithdrawal.jsx'));
const DocumentList = lazy(() => import('../pages/compliance/documentList/DocumentList.jsx'));
const BankDeposit = lazy(() => import('../pages/transactions/deposit/bankDeposit/BankDeposit.jsx'));
const TradingTerminal = lazy(() => import('../pages/tradingTerminal/TradingTerminal.jsx'));
const AnalyticsReport = lazy(() => import("../pages/IBProgramme/traderSubIB/analytics/AnalyticsReport.jsx"));
const CommissionReport = lazy(() => import('../pages/IBProgramme/traderSubIB/commission/CommissionReport.jsx'));
const TradeReport = lazy(() => import('../pages/IBProgramme/traderSubIB/trade/TradeReport.jsx'));
const LiveAccount = lazy(() => import('../pages/IBProgramme/traderSubIB/liveAccount/LiveAccount.jsx'));
const TransactionReport = lazy(() => import('../pages/IBProgramme/traderSubIB/transaction/TransactionReport.jsx'));
const IBOverviews = lazy(() => import('../pages/IBProgramme/IBOverviews/IBOverviews.jsx'));
const IBSummary = lazy(() => import('../pages/IBProgramme/IBOverviews/IBSummary/IBSummary.jsx'));
const IBStatistics = lazy(() => import('../pages/IBProgramme/IBOverviews/IBStatistics/IBStatistics.jsx'));
const IBCommission = lazy(() => import('../pages/IBProgramme/IBDashboard/IBCommission/IBCommission.jsx'));
const Promotions = lazy(() => import('../pages/promotions/Promotions.jsx'));
const MT5Requestlist = lazy(() => import('../pages/MT5Account/MT5Requestlist/MT5Requestlist.jsx'));
const CopyTrading = lazy(() => import('../pages/copytrading/copyTrading.jsx'));

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

// Routes
export const routing = [
    // Auth — always accessible
    { path: "/accounts/:tab", element: <Auth /> },
    { path: "/accounts/resetPassword", element: <ResetPassword /> },
    { path: "/", element: <Navigate to="/accounts/signIn" replace /> },
    { path: "/accounts", element: <Navigate to="/accounts/signIn" replace /> },

    // Settings & Trading Terminal — always accessible once logged in
    { path: "/client/settings/:tab", element: <Settings /> },
    { path: "/client/kyc", element: <KycVerification /> },
    { path: "/terminal", element: <TradingTerminal /> },

    // User Management — My Account, Trading Accounts, Compliance
    ...(USER_MANAGEMENT_ENABLED ? [
        { path: "/client/myAccount", element: <MyAccount /> },
        { path: "/client/MT5AccountList", element: <MT5AccountList /> },
        { path: "/client/MT5AccountsDetails/:tab/:id", element: <MT5AccountsDetails /> },
        { path: "/client/newAccount", element: <OpenAccountPlanSection /> },
        { path: "/client/newAccount/newAccountForm", element: <OpenAccountFormLayout /> },
        { path: "/client/compliance/documentUpload", element: <DocumentsUpload /> },
        { path: "/client/compliance/document/list", element: <DocumentList /> },
        { path: "/client/compliance/bank/add", element: <AddBank />, isHalfKycRequired: true },
    ] : []),

    // Transactions
    ...(TRANSACTION_ENABLED ? [
        { path: "/client/transactions/deposit", element: <Deposit /> },
        { path: "/client/transactions/deposit/bankDeposit", element: <BankDeposit /> },
        { path: "/client/transactions/deposit/cryptoDeposit", element: <CryptoDeposit /> },
        { path: "/client/transactions/withdrawal", element: <WithDrawal /> },
        { path: "/client/transactions/withdrawal/cryptoWithdrawalForm", element: <CryptoWithdrawal />, isKycRequired: true },
        { path: "/client/transactions/withdrawal/withdrawalFrom", element: <BankWithdrawalForm />, isKycRequired: true, isBankVerificationRequired: true },
        { path: "/client/transactions/internalTransfer", element: <Transfer /> },
        { path: "/client/transactions/internalTransfer/internalTransferWithdrawal", element: <TransferWithdrawal />, isHalfKycRequired: true },
        { path: "/client/transactions/history", element: <TransactionsHistory /> },
        { path: "/client/transactions/depositWithdrawList", element: <DepositWithdrawList /> },
        { path: "/client/transactions/transactionsList", element: <TransactionsList /> },
        { path: "/client/myWallet/walletHistory", element: <WalletHistory /> },
        { path: "/client/myWallet/MT5ToWallet", element: <MT5ToWallet /> },
        { path: "/client/myWallet/walletToMT5", element: <WalletToMT5 /> },
    ] : []),

    // Partner Management
    ...(PARTNER_MANAGEMENT_ENABLED ? [
        { path: "/client/IBProgramme/IBTransactionList", element: <IBConditionRouting><IBTransactionListPage /></IBConditionRouting> },
        { path: "/client/IBProgramme/IBKycList", element: <IBConditionRouting><KYCListPage /></IBConditionRouting> },
        { path: "/client/IBProgramme/IBRequest", element: <RedirectIfIB><IBRequest /></RedirectIfIB> },
        { path: "/client/IBProgramme/IBDashboard", element: <IBConditionRouting><IBDashboard /></IBConditionRouting> },
        { path: "/client/IBProgramme/IBCommission", element: <IBConditionRouting><IBCommission /></IBConditionRouting> },
        { path: "/client/IBProgramme/IBOverview", element: <IBConditionRouting><IBOverviews /></IBConditionRouting> },
        { path: "/client/IBProgramme/IBSummary", element: <IBConditionRouting><IBSummary /></IBConditionRouting> },
        { path: "/client/IBProgramme/IBStatistics", element: <IBConditionRouting><IBStatistics /></IBConditionRouting> },
        { path: "/client/IBProgramme/myClients", element: <IBConditionRouting><MyClients /></IBConditionRouting> },
        { path: "/client/IBProgramme/myCommission", element: <IBConditionRouting><MyCommission /></IBConditionRouting> },
        { path: "/client/IBProgramme/IBWithdraw", element: <IBConditionRouting><IBWithdraw /></IBConditionRouting> },
        { path: "/client/IBProgramme/myClientTransaction", element: <IBConditionRouting><TeamWithdrawReport /></IBConditionRouting> },
        { path: "/client/IBProgramme/analyticsReport", element: <IBConditionRouting><AnalyticsReport /></IBConditionRouting> },
        { path: "/client/IBProgramme/commissionReport", element: <IBConditionRouting><CommissionReport /></IBConditionRouting> },
        { path: "/client/IBProgramme/tradeReport", element: <IBConditionRouting><TradeReport /></IBConditionRouting> },
        { path: "/client/IBProgramme/liveAccountReport", element: <IBConditionRouting><LiveAccount /></IBConditionRouting> },
        { path: "/client/IBProgramme/transactionReport", element: <IBConditionRouting><TransactionReport /></IBConditionRouting> },
    ] : []),

    // All Reports — order history, my reports
    ...(ALL_REPORTS_ENABLED ? [
        { path: "/client/ordersHistory", element: <OrderHistory /> },
        { path: "/client/myReports/deposit", element: <DepositReport /> },
        { path: "/client/myReports/withdrawal", element: <WithdrawReport /> },
        { path: "/client/myReports/internalTransfer", element: <InternalTransferReport /> },
        { path: "/client/myReports/dealReport", element: <DealReport /> },
    ] : []),

    // Help Desk / Tickets
    ...(TICKETS_ENABLED ? [
        { path: "/client/helpDesk/myTickets", element: <MyTickets /> },
        { path: "/client/helpDesk/showTicket", element: <ShowTicket /> },
        { path: "/client/helpDesk/newTicket", element: <NewTicket /> },
    ] : []),

    // News
    ...(NEWS_ENABLED ? [
        { path: "/client/news", element: <News /> },
    ] : []),

    // Promotions / Rewards
    ...(REWARDS_ENABLED ? [
        { path: "/client/promotions", element: <Promotions /> },
        { path: "/client/promotions/fullDepositBonus", element: <FullDepositBonus /> },
        { path: "/client/promotions/tradeOrTreatLuckyDraw", element: <TradeOrTreatLuckyDraw /> },
        { path: "/client/promotions/freeVPS", element: <FreeVPS /> },
    ] : []),

    // Copy Trading
    ...(COPY_TRADING_ENABLED ? [
        { path: "/client/copytrading", element: <CopyTrading /> },
    ] : []),

    // Bot Management
    ...(BOT_MANAGEMENT_ENABLED ? [
        { path: "/client/bots", element: <BotList /> },
    ] : []),
];
