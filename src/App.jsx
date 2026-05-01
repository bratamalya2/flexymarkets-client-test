// import { Navigate } from 'react-router-dom';
// import { Suspense, lazy, useEffect } from 'react';
// import DashboardLayout from './layout/dashboardLayout/DashboardLayout.jsx';
// import { useDispatch, useSelector } from 'react-redux';
// import { initializeAuth } from './globalState/auth/authSlice.js';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { routing } from "./routeMapping/RouteMapping.jsx";
// import Notify from './components/Notify';
// import GoToTop from './components/GoToTop';
// import Loader from './components/Loader.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// import ProtectedAuthRoute from './components/ProtectedAuthRoute.jsx';
// import { useMediaQuery } from '@mui/material';
// import ModalComponent from './components/ModalComponent.jsx';
// import { useGetBannerQuery } from './globalState/otherContentState/otherContentStateApis.js';
// const NotFound = lazy(() => import('./pages/NotFound.jsx'));
// import { useTheme } from '@mui/material';
// import { setBanner } from './globalState/otherContentState/otherContentStateSlice.js';
// import BannerContent from './pages/otherContents/BannerContent.jsx';
// import TokenExpiryHandler from './components/TokenExpiryHandler.jsx';
// import AuthLayout from './layout/authLayout/AuthLayout.jsx';
// import RequireKyc from './components/RequireKyc.jsx';
// import RequireVerification from './components/RequireVerification.jsx';
// import TradingTerminalLayout from './layout/tradingTerminalLayout/TradingTerminalLayout.jsx';

// function App() {

//   // const theme = useTheme()
//   // const downSm = useMediaQuery(theme.breakpoints.down("sm"))

//   // const { banner } = useSelector(state => state.otherContent)
//   // const { token } = useSelector(state => state.auth)

//   const { open, message, severity } = useSelector((state) => state.notification);
//   const handleCloseNotify = () => setOpen(false);
//   const dispatch = useDispatch()

//   const publicRoutes = routing.filter(route => !route.path.startsWith('/client') && !route.path.startsWith('/terminal'));
//   const clientRoutes = routing
//     .filter(route => route.path.startsWith('/client'))
//     .map(route => ({
//       ...route,
//       path: route.path.replace('/client/', '')
//     }));
//   const clientTerminalRoutes = routing.filter(route => route.path.startsWith('/terminal'));

//   useEffect(() => {
//     dispatch(initializeAuth());
//   }, [dispatch]);

//   // const { data, isLoading } = useGetBannerQuery(undefined, {
//   //   skip: !token,
//   //   refetchOnMountOrArgChange: true,
//   // })

//   // const bannerData = !isLoading && data?.data

//   // useEffect(() => {
//   //   if (token && (!isLoading && data?.status)) {
//   //     dispatch(setBanner(true));
//   //   }
//   // }, [isLoading, data]);


//   // const withKycWrapper = (element, isKycRequired, isBankVerificationRequired) =>
//   //   isKycRequired ? <RequireKyc isBankVerificationRequired={isBankVerificationRequired}>{element}</RequireKyc> : element;

//   const withVerificationWrapper = (element, isKycRequired, isBankVerificationRequired, isHalfKycRequired) => {
//     return (
//       <RequireVerification
//         isKycRequired={isKycRequired}
//         isHalfKycRequired={isHalfKycRequired}
//         isBankVerificationRequired={isBankVerificationRequired}
//       >
//         {element}
//       </RequireVerification>
//     );
//   };


//   return (
//     <BrowserRouter>

//       <TokenExpiryHandler />

//       {/* {(banner && bannerData) && (
//         <ModalComponent
//           open={true}
//           onClose={() => dispatch(setBanner(false))}
//           Content={BannerContent}
//           contentData={{
//             ...data?.data,
//             onModalClose: () => dispatch(setBanner(false)),
//           }}
//           padding={"none"}
//           onOpen={() => { }}
//           modalWidth={downSm ? "90%" : 500}
//         />
//       )} */}

//       <Notify
//         open={open}
//         onClose={handleCloseNotify}
//         message={message}
//         severity={severity}
//       />
//       <GoToTop />
//       <Routes>

//         <Route element={<ProtectedAuthRoute />}>
//           <Route element={<AuthLayout />}>
//             {publicRoutes.map(({ path, element }, idx) => (
//               <Route
//                 key={idx}
//                 path={path}
//                 element={element}
//               />
//             ))}
//           </Route>
//         </Route>

//         <Route element={<ProtectedRoute />}>
//           <Route path='/terminal' element={<TradingTerminalLayout />}>
//             {clientTerminalRoutes.map(({ path, element }, idx) => (
//               <Route
//                 key={idx}
//                 path={path}
//                 element={element}
//               />
//             ))}
//           </Route>
//         </Route>

//         <Route element={<ProtectedRoute />}>
//           <Route path="/client" element={<DashboardLayout />}>
//             <Route index element={<Navigate to="myAccount" replace />} />
//             {clientRoutes.map(({ path, element, isKycRequired, isBankVerificationRequired, isHalfKycRequired }, idx) => (
//               <Route key={idx} path={path} element={withVerificationWrapper(element, isKycRequired, isBankVerificationRequired, isHalfKycRequired)} />
//             ))}
//           </Route>
//         </Route>
//         <Route
//           path="*"
//           element={
//             <Suspense fallback={<Loader />}>
//               <NotFound />
//             </Suspense>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;












































import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, useMediaQuery } from '@mui/material';
import { initializeAuth } from './globalState/auth/authSlice.js';
import { routing } from './routeMapping/RouteMapping.jsx';
import DashboardLayout from './layout/dashboardLayout/DashboardLayout.jsx';
import TradingTerminalLayout from './layout/tradingTerminalLayout/TradingTerminalLayout.jsx';
import AuthLayout from './layout/authLayout/AuthLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProtectedAuthRoute from './components/ProtectedAuthRoute.jsx';
import RequireVerification from './components/RequireVerification.jsx';
import TokenExpiryHandler from './components/TokenExpiryHandler.jsx';
import Loader from './components/Loader.jsx';
import Notify from './components/Notify.jsx';
import GoToTop from './components/GoToTop.jsx';
import { setBanner } from './globalState/otherContentState/otherContentStateSlice.js';
import NotFound from './pages/NotFound.jsx';
import ModalComponent from './components/ModalComponent.jsx';
import BannerContent from './pages/otherContents/BannerContent.jsx';
import { useGetBannerQuery } from './globalState/otherContentState/otherContentStateApis.js';

function App() {

  const theme = useTheme()
  const downSm = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useDispatch();

  // ✅ Initialize Auth on first mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);


  const { banner } = useSelector(state => state.otherContent)
  const { token } = useSelector(state => state.auth)

  // Notification
  const { open, message, severity } = useSelector((state) => state.notification);
  const handleCloseNotify = () => setOpen(false);

  // Extract routes by prefix
  const publicRoutes = routing.filter(
    (route) => !route.path.startsWith('/client') && !route.path.startsWith('/terminal')
  );

  const clientRoutes = routing
    .filter((route) => route.path.startsWith('/client'))
    .map((route) => ({
      ...route,
      path: route.path.replace('/client/', ''),
    }));

  const clientTerminalRoutes = routing.filter((route) =>
    route.path.startsWith('/terminal')
  );




  const { data, isLoading } = useGetBannerQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  })

  const bannerData = !isLoading && data?.data

  useEffect(() => {
    if (token && (!isLoading && data?.status)) {
      dispatch(setBanner(true));
    }
  }, [isLoading, data]);




  // KYC + Verification wrapper
  const withVerificationWrapper = (
    element,
    isKycRequired,
    isBankVerificationRequired,
    isHalfKycRequired
  ) => (
    <RequireVerification
      isKycRequired={isKycRequired}
      isHalfKycRequired={isHalfKycRequired}
      isBankVerificationRequired={isBankVerificationRequired}
    >
      {element}
    </RequireVerification>
  );

  return (
    <BrowserRouter>
      <TokenExpiryHandler />

      {/* {(banner && bannerData) && (
        <ModalComponent
          open={true}
          onClose={() => dispatch(setBanner(false))}
          Content={BannerContent}
          contentData={{
            ...data?.data,
            onModalClose: () => dispatch(setBanner(false)),
          }}
          padding={"none"}
          onOpen={() => { }}
          modalWidth={downSm ? "90%" : 500}
        />
      )} */}

      <GoToTop />

      <Notify
        open={open}
        onClose={handleCloseNotify}
        message={message}
        severity={severity}
      />

      {/* Global Suspense Fallback */}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public/Auth Routes */}
          <Route element={<ProtectedAuthRoute />}>
            <Route element={<AuthLayout />}>
              {publicRoutes.map(({ path, element }, idx) => (
                <Route key={idx} path={path} element={element} />
              ))}
            </Route>
          </Route>

          {/* Trading Terminal Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/terminal" element={<TradingTerminalLayout />}>
              {clientTerminalRoutes.map(({ path, element }, idx) => (
                <Route key={idx} path={path} element={element} />
              ))}
            </Route>
          </Route>

          {/* Client Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/client" element={<DashboardLayout />}>
              <Route index element={<Navigate to="myAccount" replace />} />
              {clientRoutes.map(
                (
                  {
                    path,
                    element,
                    isKycRequired,
                    isBankVerificationRequired,
                    isHalfKycRequired,
                  },
                  idx
                ) => (
                  <Route
                    key={idx}
                    path={path}
                    element={withVerificationWrapper(
                      element,
                      isKycRequired,
                      isBankVerificationRequired,
                      isHalfKycRequired
                    )}
                  />
                )
              )}
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;