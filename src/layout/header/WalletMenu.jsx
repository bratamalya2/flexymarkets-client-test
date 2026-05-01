import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import SwitchComponent from '../../components/SwitchComponent';
import { Stack, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis"
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { useMt5AccountListQuery } from '../../globalState/mt5State/mt5StateApis';
import { setHideBalance } from '../../globalState/profileState/profileStateSlices';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function WalletMenu({ Icon, tooltip }) {

    const dispatch = useDispatch()

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    // const { activeMT5AccountLogin } = useSelector(state => state.mt5)

    // const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified
    // const mt5Accounts = !isLoading && data?.data?.mt5AccountList
    const mainBalance = !isLoading && data?.data?.assetData?.mainBalance

    // const { data: mt5Account, isLoading: mt5AccountLoading } = useMt5AccountListQuery({
    //     page: 1,
    //     sizePerPage: 10,
    //     search: activeMT5AccountLogin || mt5Accounts?.[0]?.Login
    // })

    // const activeLogIn = mt5Account?.data?.mt5AccountList?.[0]

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const handleBalanceHide = (e) => {
        dispatch(setHideBalance(e.target.checked))
    }

    const { hideBalance } = useSelector(state => state.profile)


    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title={tooltip}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Icon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            width: "300px",
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* {
                    mt5Accounts?.length > 0
                        ? */}
                {/* <> */}
                {[
                    <MenuItem
                        key="hide-balance"
                        sx={{
                            justifyContent: "space-between",
                            '&:hover': {
                                backgroundColor: 'transparent'
                            }
                        }}>
                        Hide balance
                        <SwitchComponent onChange={handleBalanceHide} checked={hideBalance} />
                    </MenuItem>,
                    <Divider key="divider-1" />,
                    <MenuItem
                        key="main-balance"
                        sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            '&:hover': {
                                backgroundColor: 'transparent'
                            }
                        }}>
                        <Typography fontWeight={"bold"} fontSize={"1.1rem"} sx={{ textDecoration: "wavy" }}>
                            {
                                hideBalance ?
                                    <>
                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    </>
                                    :
                                    Number(mainBalance || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    })
                            } <Typography component={"span"}>USD</Typography>
                        </Typography>
                        {/* <Stack>
                            <Typography fontSize={"13px"} color="textSecondary">Trading account</Typography>
                            {/* <Typography fontSize={"13px"} color="textSecondary">{activeLogIn?.Login}</Typography> */}
                        {/* </Stack> */}
                        <Stack sx={{ flexDirection: "row", gap: "10px", mt: ".8rem" }}>
                            <Button
                                component={Link}
                                to={"/client/transactions/internalTransfer"}
                                variant='contained'
                                size='small'
                                sx={{
                                    textTransform: "capitalize",
                                    boxShadow: "none",
                                    color: "white",
                                    alignSelf: "self-start",
                                    "&:hover": {
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Transfer
                            </Button>
                            <Button
                                component={Link}
                                to={"/client/transactions/withdrawal"}
                                variant='contained'
                                size='small'
                                sx={{
                                    textTransform: "capitalize",
                                    boxShadow: "none",
                                    color: "white",
                                    alignSelf: "self-start",
                                    "&:hover": {
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Withdraw
                            </Button>
                        </Stack>
                    </MenuItem>,
                    <MenuItem
                        key="trading-account-info"
                        sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            '&:hover': {
                                backgroundColor: 'transparent'
                            }
                        }}>
                        {/* <Typography fontWeight={"bold"} fontSize={"1.1rem"}>{activeLogIn?.Balance} <Typography component={"span"}>USD</Typography></Typography> */}
                        {/* <Stack> */}
                        {/* <Typography fontSize={"13px"} color="textSecondary">Trading account</Typography> */}
                        {/* <Box sx={{ display: "flex", gap: "15px" }}>
                                <Typography fontSize={"13px"} color="textSecondary">{activeLogIn?.Login}</Typography>
                                <Tooltip title={copied ? "Copied!" : "Copy"}>
                                    <IconButton sx={{ p: 0 }} onClick={() => handleCopy(activeLogIn?.Login)}>
                                        <ContentCopyIcon sx={{ fontSize: "14px" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box> */}
                        {/* </Stack> */}
                    </MenuItem>
                ]}
                {/* // </> */}
                {/* : */}
                {/* <Tooltip title={!isKycVerified && "Complete profile verification"}>
                    <Button
                        component={isKycVerified && Link}
                        to={"/client/newAccount"}
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            textTransform: "capitalize",
                            bgcolor: "transparent",
                            color: "black",
                            boxShadow: "none !important",
                            px: "1.5rem"
                        }}
                    >
                        Open New Account
                    </Button>
                </Tooltip> */}
                {/* } */}
            </Menu >
        </>
    );
}

export default WalletMenu;