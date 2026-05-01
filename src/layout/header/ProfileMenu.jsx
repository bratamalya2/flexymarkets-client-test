import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Skeleton, Stack } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../globalState/auth/authSlice';
import { removeDepositQRData } from '../../globalState/paymentState/paymentSlice';
import { setTokenExpTime } from '../../globalState/auth/authSlice';
import { setBanner } from '../../globalState/otherContentState/otherContentStateSlice';
import { logoutThunk } from '../../globalState/auth/authThunk';
import { setNotification } from '../../globalState/notificationState/notificationStateSlice';
import { useBroadcast } from '../../hooks/useBroadcast';


function ProfileMenu({ Icon, tooltip }) {

    const channel = useBroadcast("logout");

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { selectedTheme } = useSelector((state) => state.themeMode);
    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userEmail = data?.data?.userData?.email
    const userName = data?.data?.userData?.name

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        dispatch(logoutThunk())
        dispatch(setNotification({ open: true, message: "You have been logged out.", severity: "info" }));
        // notifyMt5AccountChange(channel);
    }

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
                <MenuItem sx={{
                    alignItems: "center",
                    gap: "12px",
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }}>
                    <AccountCircleOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    <Stack>
                        <Typography>{isLoading ? <Skeleton width={"150px"} /> : userName}</Typography>
                        <Typography sx={{ fontSize: "13px" }}>{isLoading ? <Skeleton width={"150px"} /> : userEmail}</Typography>
                    </Stack>
                </MenuItem>
                <Stack sx={{ my: "8px", borderTop: "1px solid #e2e4e4", borderBottom: "1px solid #e2e4e4" }}>
                    <MenuItem>
                        <Typography onClick={handleClose} sx={{ textDecoration: "none", color: selectedTheme === "dark" ? "white" : "black", width: "100%" }} component={Link} to={"/client/settings/profile"}>Setting</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Typography onClick={handleClose} sx={{ textDecoration: "none", color: selectedTheme === "dark" ? "white" : "black", width: "100%" }} component={Link} to={"/client/settings/tradingConditions"}>Trading condition</Typography>
                    </MenuItem>
                </Stack>
                <MenuItem sx={{ gap: "12px" }} onClick={handleSignOut}>
                    <LogoutOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    <Typography>Sign out</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

export default ProfileMenu;