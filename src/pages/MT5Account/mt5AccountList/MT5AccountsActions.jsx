import MetaDeposit from '../../myAccount/liveAccount/accountDetailsAccordian/MetaDeposit';
import MetaWithdraw from '../../myAccount/liveAccount/accountDetailsAccordian/MetaWithdraw';
import Grid from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
import ChangeMaxLeverageModalContent from '../../myAccount/liveAccount/account/ChangeMaxLeverageModalContent';
import ChangeMT5PasswordModalDetails from '../../myAccount/ChangeMT5PasswordModalDetails';
import { useLocation } from 'react-router-dom';
import { Stack, Typography, Skeleton, useMediaQuery } from '@mui/material';
import ModalComponent from '../../../components/ModalComponent';


function MT5AccountsActions({ login, detailsData }) {

  const { state } = useLocation()
  const modalWidth = useMediaQuery('(max-width:600px)');

  const leverage = state?.group?.leverage

  const { token } = useSelector((state) => state.auth);
  const { refetch } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  })

  return (
    <Grid container spacing={4} mt={"2rem"}>
      <Grid size={{ xs: 12 }}>
        {detailsData &&
          Object.entries(detailsData).map(([key, value], i) => (
            <Stack
              key={key}
              sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                p: "0.5rem 1rem",
                borderBottom: i !== 4 && "1px dashed gray",
              }}
            >
              {!detailsData ? <Skeleton width={"100px"} height={"25px"} /> : <Typography>{key}</Typography>}
              {!detailsData ? <Skeleton width={"100px"} height={"25px"} /> : <Typography>{value}</Typography>}
            </Stack>
          ))
        }
      </Grid>
      {/* <Grid size={{ xs: 12, md: 6 }}><MetaDeposit data={{ login, refetch }} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}><MetaWithdraw data={{ login, refetch }} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}><ChangeMaxLeverageModalContent data={{ login, leverage }} /></Grid>
      <Grid size={{ xs: 12, md: 6 }}><ChangeMT5PasswordModalDetails data={{ login }} /></Grid> */}
      <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: "15px" }}>
        <ModalComponent
          btnName={"Deposit"}
          Content={MetaDeposit}
          contentData={{ login, refetch }}
          modalWidth={modalWidth ? "95%" : 500}
        />
        <ModalComponent
          btnName={"Withdraw"}
          Content={MetaWithdraw}
          contentData={{ login, refetch }}
          modalWidth={modalWidth ? "95%" : 500}
        />
        <ModalComponent
          btnName={"Leverage"}
          Content={ChangeMaxLeverageModalContent}
          contentData={{ login, leverage }}
          modalWidth={modalWidth ? "95%" : 500}
        />
        <ModalComponent
          btnName={"Main Password"}
          Content={ChangeMT5PasswordModalDetails}
          contentData={{ login }}
          modalWidth={modalWidth ? "95%" : 500}
        />
      </Grid>
    </Grid>
  )
}

export default MT5AccountsActions;