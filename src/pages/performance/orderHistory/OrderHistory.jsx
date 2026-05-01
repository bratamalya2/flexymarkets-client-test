import { Skeleton, Stack, Box } from '@mui/material';
import OrderHistoryTable from './orderHistoryTable/OrderHistoryTable';
import Toggle from '../../../components/Toggle';
import Selector from '../../../components/Selector';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
import { useSelector } from 'react-redux';
import { initiatePositionSocketConnection } from '../../../socketENV/positionSocketENV';
import { useClosedOrderListQuery } from '../../../globalState/trade/tradeApis';
import HeroOpenAccountPage from '../../myAccount/liveAccount/heroOpenAccountPage/HeroOpenAccountPage';
import Loader from '../../../components/Loader';

const toggleItems = [{ name: "Open positions" }, { name: "Closed positions" }];

function OrderHistory() {
  const [active, setActive] = useState(toggleItems[0]?.name);
  const [accountType, setAccountType] = useState("Real");
  const [MT5Account, setMT5Account] = useState("");
  const [positionData, setPositionData] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const socketRef = useRef(null);
  const { token } = useSelector((state) => state.auth);

  const { data, isLoading } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const mt5AccountList = data?.data?.mt5AccountList || [];

  const { realMT5Accounts, demoMT5Accounts } = useMemo(() => {
    const real = [];
    const demo = [];
    mt5AccountList.forEach((item) => {
      const type = item?.accountType?.toLowerCase();
      if (type === "real") real.push(item.Login);
      if (type === "demo") demo.push(item.Login);
    });
    return { realMT5Accounts: real, demoMT5Accounts: demo };
  }, [mt5AccountList]);

  const allAccountTypes = useMemo(() => {
    if (realMT5Accounts.length && demoMT5Accounts.length) return ["Real", "Demo"];
    if (realMT5Accounts.length) return ["Real"];
    if (demoMT5Accounts.length) return ["Demo"];
    return [];
  }, [realMT5Accounts, demoMT5Accounts]);

  useEffect(() => {
    const defaultAccount =
      accountType === "Real" ? realMT5Accounts[0] : demoMT5Accounts[0];

    if (defaultAccount && MT5Account !== defaultAccount) {
      setMT5Account(defaultAccount);
    }
  }, [accountType, realMT5Accounts, demoMT5Accounts]);

  useEffect(() => {
    if (!MT5Account || !token || active !== "Open positions") return;

    setIsTableLoading(true);

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = initiatePositionSocketConnection({
      login: MT5Account,
      token,
      handlePositionData: (data) => {
        setPositionData(data);
        setIsTableLoading(false);
      },
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setPositionData(null);
    };
  }, [MT5Account, token, active]);

  const { data: closedOrderData, isFetching: isClosedOrderFetching } =
    useClosedOrderListQuery(
      { login: MT5Account },
      { skip: !token || !MT5Account || active !== "Closed positions" }
    );

  const closedOrders = closedOrderData?.data;

  const mtAccountSelectorItems =
    accountType === "Real" ? realMT5Accounts : demoMT5Accounts;

  const handleChangeAccountType = (e) => {
    setAccountType(e.target.value);
    setPositionData(null);
  };

  const handleChangeAccount = (e) => {
    setMT5Account(e.target.value);
    setPositionData(null);
    setIsTableLoading(true);
  };

  if (isLoading) return <Loader />;
  if (!mt5AccountList.length) return <HeroOpenAccountPage />;

  useEffect(() => {
    if (active === "Closed positions" && closedOrderData?.data) {
      setIsTableLoading(false);
    }
  }, [active, closedOrderData]);


  const isTableDataLoading =
    isTableLoading ||
    (active === "Closed positions" && isClosedOrderFetching);

  return (
    <Stack mt="2rem">

      <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Selector
            onChange={handleChangeAccount}
            showDefaultOption={false}
            items={mtAccountSelectorItems}
            value={MT5Account}
            width={{ xs: "100%", sm: "400px" }}
          />
        )}

        <Selector
          onChange={handleChangeAccountType}
          showDefaultOption={false}
          items={allAccountTypes}
          value={accountType}
          width="100px"
        />
      </Box>

      <Toggle
        items={toggleItems}
        active={active}
        stackSx={{ mt: "2rem" }}
        toggleButtonSx={{ fontSize: "14px" }}
        toggleButtonGroupSx={{ height: "40px" }}
        onChange={setActive}
      />

      <OrderHistoryTable
        data={active === "Open positions" ? positionData : closedOrders}
        activeTab={active}
        isLoading={isTableDataLoading}
      />
    </Stack>
  );
}

export default OrderHistory;
