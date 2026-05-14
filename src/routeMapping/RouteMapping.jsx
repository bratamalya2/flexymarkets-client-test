// import { lazy, Suspense } from 'react';
// import Loader from '../components/Loader.jsx';
// import { Navigate } from 'react-router-dom';
// import IBConditionRouting from '../components/IBConditionRouting.jsx';
// import RedirectIfIB from '../components/RedirectIfIB';
// import FullDepositBonus from '../pages/promotions/fullDepositBonus/FullDepositBonus.jsx';
// import TradeOrTreatLuckyDraw from '../pages/promotions/tradeOrTreatLuckyDraw/TradeOrTreatLuckyDraw.jsx';
// import FreeVPS from '../pages/promotions/freeVPS/FreeVPS.jsx';

// const Deposit = lazy(() => import("../pages/transactions/deposit/Deposit.jsx"));
// const WithDrawal = lazy(() => import("../pages/transactions/withdrawal/WithDrawal.jsx"));
// const Dashboard = lazy(() => import('../pages/dashboard/Dashboard.jsx'));
// const DocumentsUpload = lazy(() => import('../pages/compliance/documentsUpload/DocumentsUpload.jsx'));
// const DealReport = lazy(() => import('../pages/myReports/dealReport/DealReport.jsx'));
// const DepositReport = lazy(() => import('../pages/myReports/depositReport/DepositReport.jsx'));
// const WithdrawReport = lazy(() => import('../pages/myReports/withdrawReport/WithdrawReport.jsx'));
// const InternalTransferReport = lazy(() => import('../pages/myReports/internalTransferReport/InternalTransferReport.jsx'));
// const WalletHistory = lazy(() => import("../pages/myWallet/walletHistory/WalletHistory.jsx"))
// const MT5ToWallet = lazy(() => import("../pages/myWallet/MT5ToWallet/MT5ToWallet.jsx"))
// const WalletToMT5 = lazy(() => import("../pages/myWallet/walletToMT5/WalletToMT5.jsx"))
// const News = lazy(() => import("../pages/news/News.jsx"))
// const MyTickets = lazy(() => import("../pages/helpDesk/myTickets/MyTickets.jsx"))
// const NewTicket = lazy(() => import("../pages/helpDesk/newTicket/NewTicket.jsx"))
// const IBDashboard = lazy(() => import("../pages/IBProgramme/IBDashboard/IBDashboard.jsx"))
// const MyClients = lazy(() => import("../pages/IBProgramme/myClients/MyClients.jsx"))
// const TreeChart = lazy(() => import("../pages/IBProgramme/treeChart/TreeChart.jsx"))
// const MyCommission = lazy(() => import("../pages/IBProgramme/myCommission/MyCommission.jsx"))
// const IBWithdraw = lazy(() => import("../pages/IBProgramme/IBWithdraw/IBWithdraw.jsx"))
// const TeamDepositReport = lazy(() => import("../pages/IBProgramme/teamDepositReport/TeamDepositReport.jsx"))
// const TeamWithdrawReport = lazy(() => import("../pages/IBProgramme/teamWithdrawReport/TeamWithdrawReport.jsx"))
// const UploadedDocumentList = lazy(() => import("../pages/compliance/documentList/DocumentList.jsx"))
// const MyAccount = lazy(() => import("../pages/myAccount/liveAccount/MyAccount.jsx"))
// const OpenAccountPlanSection = lazy(() => import('../pages/myAccount/liveAccount/openAccount/openAccountPlanSection/OpenAccountPlanSection.jsx'))
// const OpenAccountFormLayout = lazy(() => import('../pages/myAccount/liveAccount/openAccount/openAccountForm/OpenAccountFormLayout.jsx'));
// const BankDepositForm = lazy(() => import('../pages/transactions/deposit/bankDeposit/BankDepositForm.jsx'));
// const BankWithdrawalForm = lazy(() => import('../pages/transactions/withdrawal/bankWithdrawal/BankWithdrawalForm.jsx'));
// const TransactionsHistory = lazy(() => import("../pages/transactions/transactionsHistory/TransactionsHistory.jsx"))
// const Analytics = lazy(() => import("../pages/analytics/Analytics.jsx"))
// const Performance = lazy(() => import("../pages/performance/Performance.jsx"));
// const Settings = lazy(() => import('../pages/settings/Settings.jsx'));
// const KycVerification = lazy(() => import('../pages/kycVerification/KycVerification.jsx'));
// const AddBank = lazy(() => import('../pages/compliance/addBank/AddBank.jsx'));
// const IBRequest = lazy(() => import('../pages/IBProgramme/IBRequest/IBRequest.jsx'));
// const DepositWithdrawList = lazy(() => import('../pages/transactions/depositWithdrawList/DepositWithdrawList.jsx'));
// const TransactionsList = lazy(() => import('../pages/transactions/transactionsList/TransactionsList.jsx'));
// const Auth = lazy(() => import('../authPages/Auth.jsx'));
// const ResetPassword = lazy(() => import('../authPages/resetPassword/ResetPassword.jsx'));
// const MT5AccountList = lazy(() => import('../pages/mt5AccountList/MT5AccountList.jsx'));
// const CryptoDeposit = lazy(() => import('../pages/transactions/deposit/cryptoDeposit/CryptoDeposit.jsx'));
// // const Tree = lazy(() => import('../pages/IBProgramme/treeChart/Tree.jsx'));
// const ShowTicket = lazy(() => import('../pages/helpDesk/showTicket/ShowTicket.jsx'));
// const CryptoWithdrawal = lazy(() => import('../pages/transactions/withdrawal/cryptoWithdrawal/CryptoWithdrawal.jsx'));
// const Transfer = lazy(() => import('../pages/transactions/transfer/Transfer.jsx'));
// const TransferWithdrawal = lazy(() => import('../pages/transactions/transfer/transferWithdrawal/TransferWithdrawal.jsx'));
// // const MetaWithdrawal = lazy(() => import('../pages/transactions/withdrawal/withdrawalForm/metaWithdrawal/MetaWithdrawal.jsx'));
// // const MetaDeposit = lazy(() => import('../pages/transactions/deposit/metaDeposit/MetaDeposit.jsx'));
// const DocumentList = lazy(() => import('../pages/compliance/documentList/DocumentList.jsx'));
// const BankDeposit = lazy(() => import('../pages/transactions/deposit/bankDeposit/BankDeposit.jsx'));
// const TradingTerminal = lazy(() => import('../pages/tradingTerminal/TradingTerminal.jsx'));
// const AnalyticsReport = lazy(() => import("../pages/IBProgramme/traderSubIB/analytics/AnalyticsReport.jsx"));
// const CommissionReport = lazy(() => import('../pages/IBProgramme/traderSubIB/commission/CommissionReport.jsx'));
// const TradeReport = lazy(() => import('../pages/IBProgramme/traderSubIB/trade/TradeReport.jsx'));
// const LiveAccount = lazy(() => import('../pages/IBProgramme/traderSubIB/liveAccount/LiveAccount.jsx'));
// const TransactionReport = lazy(() => import('../pages/IBProgramme/traderSubIB/transaction/TransactionReport.jsx'));
// const IBOverviews = lazy(() => import('../pages/IBProgramme/IBOverviews/IBOverviews.jsx'));
// const IBSummary = lazy(() => import('../pages/IBProgramme/IBOverviews/IBSummary/IBSummary.jsx'));
// const IBStatistics = lazy(() => import('../pages/IBProgramme/IBOverviews/IBStatistics/IBStatistics.jsx'));
// const IBCommission = lazy(() => import('../pages/IBProgramme/IBDashboard/IBCommission/IBCommission.jsx'));
// const Promotions = lazy(() => import('../pages/promotions/Promotions.jsx'));


// export const routing = [
//     { path: "/accounts/:tab", element: <Suspense fallback={<Loader />}><Auth /></Suspense> },
//     { path: "/accounts/resetPassword", element: <Suspense fallback={<Loader />}><ResetPassword /></Suspense> },
//     { path: "/", element: <Navigate to="/accounts/signIn" replace /> },
//     { path: "/accounts", element: <Navigate to="/accounts/signIn" replace /> },

//     // { path: "/client/dashboard", element: <Suspense fallback={<Loader />}><Dashboard /></Suspense> },
//     { path: "/client/myAccount", element: <Suspense fallback={<Loader />}><MyAccount /></Suspense> },
//     { path: "/client/MT5AccountList", element: <Suspense fallback={<Loader />}><MT5AccountList /></Suspense> },
//     { path: "/client/newAccount", element: <Suspense fallback={<Loader />}><OpenAccountPlanSection /></Suspense> },
//     { path: "/client/newAccount/newAccountForm", element: <Suspense fallback={<Loader />}><OpenAccountFormLayout /></Suspense> },
//     { path: "/client/transactions/deposit", element: <Suspense fallback={<Loader />}><Deposit /></Suspense> },
//     { path: "/client/transactions/deposit/bankDeposit", element: <Suspense fallback={<Loader />}><BankDeposit /></Suspense> },
//     { path: "/client/transactions/deposit/cryptoDeposit", element: <Suspense fallback={<Loader />}><CryptoDeposit /></Suspense> },
//     // { path: "/client/transactions/deposit/metaDepositForm", element: <Suspense fallback={<Loader />}><MetaDeposit /></Suspense> },
//     { path: "/client/transactions/withdrawal", element: <Suspense fallback={<Loader />}><WithDrawal /></Suspense> },
//     { path: "/client/transactions/withdrawal/cryptoWithdrawalForm", element: <Suspense fallback={<Loader />}><CryptoWithdrawal /></Suspense>, isKycRequired: true },
//     // { path: "/client/transactions/withdrawal/metaWithdrawalForm", element: <Suspense fallback={<Loader />}><MetaWithdrawal /></Suspense> },
//     { path: "/client/transactions/withdrawal/withdrawalFrom", element: <Suspense fallback={<Loader />}><BankWithdrawalForm /></Suspense>, isKycRequired: true, isBankVerificationRequired: true },
//     { path: "/client/transactions/internalTransfer", element: <Suspense fallback={<Loader />}><Transfer /></Suspense> },
//     {
//         path: "/client/transactions/internalTransfer/internalTransferWithdrawal", element: <Suspense fallback={<Loader />}><TransferWithdrawal /></Suspense>,
//         //  isKycRequired: true,
//         isHalfKycRequired: true
//     },
//     { path: "/client/transactions/history", element: <Suspense fallback={<Loader />}><TransactionsHistory /></Suspense> },
//     { path: "/client/transactions/depositWithdrawList", element: <Suspense fallback={<Loader />}><DepositWithdrawList /></Suspense> },
//     { path: "/client/transactions/transactionsList", element: <Suspense fallback={<Loader />}><TransactionsList /></Suspense> },

//     // { path: "/client/analytics", element: <Navigate to="/client/analytics/analystViews" replace /> },
//     // { path: "/client/analytics/:tab", element: <Suspense fallback={<Loader />}><Analytics /></Suspense> },
//     { path: "/client/performance/:tab", element: <Suspense fallback={<Loader />}><Performance /></Suspense> },
//     { path: "/client/settings/:tab", element: <Suspense fallback={<Loader />}><Settings /></Suspense> },

//     { path: "/client/IBProgramme/IBRequest", element: <RedirectIfIB><Suspense fallback={<Loader />}><IBRequest /></Suspense></RedirectIfIB> },
//     { path: "/client/IBProgramme/IBDashboard", element: <IBConditionRouting><Suspense fallback={<Loader />}><IBDashboard /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/IBCommission", element: <IBConditionRouting><Suspense fallback={<Loader />}><IBCommission /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/IBOverview", element: <IBConditionRouting><Suspense fallback={<Loader />}><IBOverviews /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/IBSummary", element: <IBConditionRouting><Suspense fallback={<Loader />}><IBSummary /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/IBStatistics", element: <IBConditionRouting><Suspense fallback={<Loader />}><IBStatistics /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/myClients", element: <IBConditionRouting><Suspense fallback={<Loader />}><MyClients /></Suspense></IBConditionRouting> },
//     // { path: "/client/IBProgramme/treeChart", element: <IBConditionRouting><Suspense fallback={<Loader />}><Tree /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/myCommission", element: <IBConditionRouting><Suspense fallback={<Loader />}><MyCommission /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/IBWithdraw", element: <IBConditionRouting><Suspense fallback={<Loader />}><IBWithdraw /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/teamDepositReport", element: <IBConditionRouting><Suspense fallback={<Loader />}><TeamDepositReport /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/teamWithdrawReport", element: <IBConditionRouting><Suspense fallback={<Loader />}><TeamWithdrawReport /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/analyticsReport", element: <IBConditionRouting><Suspense fallback={<Loader />}><AnalyticsReport /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/commissionReport", element: <IBConditionRouting><Suspense fallback={<Loader />}><CommissionReport /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/tradeReport", element: <IBConditionRouting><Suspense fallback={<Loader />}><TradeReport /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/liveAccountReport", element: <IBConditionRouting><Suspense fallback={<Loader />}><LiveAccount /></Suspense></IBConditionRouting> },
//     { path: "/client/IBProgramme/transactionReport", element: <IBConditionRouting><Suspense fallback={<Loader />}><TransactionReport /></Suspense></IBConditionRouting> },

//     { path: "/client/compliance/documentUpload", element: <Suspense fallback={<Loader />}><DocumentsUpload /></Suspense> },
//     { path: "/client/compliance/document/list", element: <Suspense fallback={<Loader />}><DocumentList /></Suspense> },
//     {
//         path: "/client/compliance/bank/add", element: <Suspense fallback={<Loader />}><AddBank /></Suspense>,
//         //  isKycRequired: true,
//         isHalfKycRequired: true
//     },

//     { path: "/client/myReports/deposit", element: <Suspense fallback={<Loader />}><DepositReport /></Suspense> },
//     { path: "/client/myReports/withdrawal", element: <Suspense fallback={<Loader />}><WithdrawReport /></Suspense> },
//     { path: "/client/myReports/internalTransfer", element: <Suspense fallback={<Loader />}><InternalTransferReport /></Suspense> },
//     { path: "/client/myReports/dealReport", element: <Suspense fallback={<Loader />}><DealReport /></Suspense> },

//     { path: "/client/myWallet/walletHistory", element: <Suspense fallback={<Loader />}><WalletHistory /></Suspense> },
//     { path: "/client/myWallet/MT5ToWallet", element: <Suspense fallback={<Loader />}><MT5ToWallet /></Suspense> },
//     { path: "/client/myWallet/walletToMT5", element: <Suspense fallback={<Loader />}><WalletToMT5 /></Suspense> },

//     { path: "/client/news", element: <Suspense fallback={<Loader />}><News /></Suspense> },

//     { path: "/client/helpDesk/myTickets", element: <Suspense fallback={<Loader />}><MyTickets /></Suspense> },
//     { path: "/client/helpDesk/showTicket", element: <Suspense fallback={<Loader />}><ShowTicket /></Suspense> },
//     { path: "/client/helpDesk/newTicket", element: <Suspense fallback={<Loader />}><NewTicket /></Suspense> },

//     { path: "/client/kyc", element: <Suspense fallback={<Loader />}><KycVerification /></Suspense> },

//     { path: "/client/promotions", element: <Suspense fallback={<Loader />}><Promotions /></Suspense> },
//     { path: "/client/promotions/fullDepositBonus", element: <Suspense fallback={<Loader />}><FullDepositBonus /></Suspense> },
//     { path: "/client/promotions/tradeOrTreatLuckyDraw", element: <Suspense fallback={<Loader />}><TradeOrTreatLuckyDraw /></Suspense> },
//     { path: "/client/promotions/freeVPS", element: <Suspense fallback={<Loader />}><FreeVPS /></Suspense> },

//     { path: "/terminal", element: <Suspense fallback={<Loader />}><TradingTerminal /></Suspense> }
// ];












































import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import IBConditionRouting from '../components/IBConditionRouting.jsx';
import RedirectIfIB from '../components/RedirectIfIB';

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

// Social Trading
const SOCIAL_TRADING_ENABLED = import.meta.env.VITE_ENABLE_SOCIAL_TRADING !== 'false';
const MasterTraderDiscovery = lazy(() => import('../pages/socialTrading/masterTraderDiscovery/MasterTraderDiscovery.jsx'));
const MasterTraderDetail = lazy(() => import('../pages/socialTrading/masterTraderDetail/MasterTraderDetail.jsx'));
const MySubscriptions = lazy(() => import('../pages/socialTrading/mySubscriptions/MySubscriptions.jsx'));
const MyWatchlist = lazy(() => import('../pages/socialTrading/myWatchlist/MyWatchlist.jsx'));
const MyMasterTraderProfile = lazy(() => import('../pages/socialTrading/myMasterTraderProfile/MyMasterTraderProfile.jsx'));

// Routes
export const routing = [
    { path: "/accounts/:tab", element: <Auth /> },
    { path: "/accounts/resetPassword", element: <ResetPassword /> },
    { path: "/", element: <Navigate to="/accounts/signIn" replace /> },
    { path: "/accounts", element: <Navigate to="/accounts/signIn" replace /> },

    { path: "/client/myAccount", element: <MyAccount /> },
    { path: "/client/MT5AccountList", element: <MT5AccountList /> },
    // { path: "/client/MT5RequestList", element: <MT5Requestlist /> },
    { path: "/client/newAccount", element: <OpenAccountPlanSection /> },
    { path: "/client/newAccount/newAccountForm", element: <OpenAccountFormLayout /> },
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

    { path: "/client/performance/:tab", element: <Performance /> },
    { path: "/client/settings/:tab", element: <Settings /> },

    { path: "/client/IBProgramme/IBRequest", element: <RedirectIfIB><IBRequest /></RedirectIfIB> },
    { path: "/client/IBProgramme/IBDashboard", element: <IBConditionRouting><IBDashboard /></IBConditionRouting> },
    { path: "/client/IBProgramme/IBCommission", element: <IBConditionRouting><IBCommission /></IBConditionRouting> },
    { path: "/client/IBProgramme/IBOverview", element: <IBConditionRouting><IBOverviews /></IBConditionRouting> },
    { path: "/client/IBProgramme/IBSummary", element: <IBConditionRouting><IBSummary /></IBConditionRouting> },
    { path: "/client/IBProgramme/IBStatistics", element: <IBConditionRouting><IBStatistics /></IBConditionRouting> },
    { path: "/client/IBProgramme/myClients", element: <IBConditionRouting><MyClients /></IBConditionRouting> },
    { path: "/client/IBProgramme/myCommission", element: <IBConditionRouting><MyCommission /></IBConditionRouting> },
    { path: "/client/IBProgramme/IBWithdraw", element: <IBConditionRouting><IBWithdraw /></IBConditionRouting> },
    // { path: "/client/IBProgramme/teamDepositReport", element: <IBConditionRouting><TeamDepositReport /></IBConditionRouting> },
    // { path: "/client/IBProgramme/teamWithdrawReport", element: <IBConditionRouting><TeamWithdrawReport /></IBConditionRouting> },
    { path: "/client/IBProgramme/myClientTransaction", element: <IBConditionRouting><TeamWithdrawReport /></IBConditionRouting> },
    { path: "/client/IBProgramme/analyticsReport", element: <IBConditionRouting><AnalyticsReport /></IBConditionRouting> },
    { path: "/client/IBProgramme/commissionReport", element: <IBConditionRouting><CommissionReport /></IBConditionRouting> },
    { path: "/client/IBProgramme/tradeReport", element: <IBConditionRouting><TradeReport /></IBConditionRouting> },
    { path: "/client/IBProgramme/liveAccountReport", element: <IBConditionRouting><LiveAccount /></IBConditionRouting> },
    { path: "/client/IBProgramme/transactionReport", element: <IBConditionRouting><TransactionReport /></IBConditionRouting> },

    { path: "/client/compliance/documentUpload", element: <DocumentsUpload /> },
    { path: "/client/compliance/document/list", element: <DocumentList /> },
    { path: "/client/compliance/bank/add", element: <AddBank />, isHalfKycRequired: true },

    { path: "/client/myReports/deposit", element: <DepositReport /> },
    { path: "/client/myReports/withdrawal", element: <WithdrawReport /> },
    { path: "/client/myReports/internalTransfer", element: <InternalTransferReport /> },
    { path: "/client/myReports/dealReport", element: <DealReport /> },

    { path: "/client/myWallet/walletHistory", element: <WalletHistory /> },
    { path: "/client/myWallet/MT5ToWallet", element: <MT5ToWallet /> },
    { path: "/client/myWallet/walletToMT5", element: <WalletToMT5 /> },

    { path: "/client/news", element: <News /> },

    { path: "/client/helpDesk/myTickets", element: <MyTickets /> },
    { path: "/client/helpDesk/showTicket", element: <ShowTicket /> },
    { path: "/client/helpDesk/newTicket", element: <NewTicket /> },

    { path: "/client/kyc", element: <KycVerification /> },

    // { path: "/client/promotions", element: <Promotions /> },
    // { path: "/client/promotions/fullDepositBonus", element: <FullDepositBonus /> },
    // { path: "/client/promotions/tradeOrTreatLuckyDraw", element: <TradeOrTreatLuckyDraw /> },
    // { path: "/client/promotions/freeVPS", element: <FreeVPS /> },

    { path: "/terminal", element: <TradingTerminal /> },

    // Social Trading
    ...(SOCIAL_TRADING_ENABLED ? [
        { path: "/client/socialTrading/discover", element: <MasterTraderDiscovery /> },
        { path: "/client/socialTrading/masterTrader/:masterTraderId", element: <MasterTraderDetail /> },
        { path: "/client/socialTrading/mySubscriptions", element: <MySubscriptions /> },
        { path: "/client/socialTrading/myWatchlist", element: <MyWatchlist /> },
        { path: "/client/socialTrading/myProfile", element: <MyMasterTraderProfile /> },
    ] : []),
];