import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import SwitchComponent from '../../components/SwitchComponent';
import { Stack, Button, Skeleton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setHideBalance } from '../../globalState/profileState/profileStateSlices';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


function TerminalAccountDetailsMenu() {

    const { activeMT5AccountType } = useSelector(state => state.mt5)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleBalanceHide = (e) => {
        dispatch(setHideBalance(e.target.checked))
    }

    const { hideBalance } = useSelector(state => state.profile)

    const { activeMT5AccountDetails } = useSelector(state => state.mt5)

    const accountDetailsData = {
        "Log in": activeMT5AccountDetails?.Login || "",
        Balance: activeMT5AccountDetails?.Balance || "",
        Equity: activeMT5AccountDetails?.Equity || "",
        Margin: activeMT5AccountDetails?.Margin || "",
        "Free margin": activeMT5AccountDetails?.MarginFree || "",
        "Margin level": activeMT5AccountDetails?.MarginLevel || "",
        "Account leverage": activeMT5AccountDetails?.MarginLeverage || ""
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Stack
                    onClick={handleClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={{
                        cursor: "pointer",
                        border: "1px solid transparent",
                        height: { xs: "42px", sm: "50px" },
                        justifyContent: "center",
                        px: ".8rem",
                        borderRadius: "5px",
                        ":hover": {
                            border: theme => `1px solid ${theme.palette.custom.brandLight}`,
                            bgcolor: theme => theme.palette.custom.activeNavigation
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            fontSize={"12px"}
                            borderRadius={".2rem"}
                            bgcolor={"#232f2e"}
                            px={".5rem"}
                            py={".1rem"}
                            color={"#22a355ff"}
                        >
                            {activeMT5AccountType}
                        </Typography>
                        <Typography fontSize={"12px"}>Standard</Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        {
                            !activeMT5AccountDetails ?
                                <Skeleton width={"100%"} />
                                :
                                <Typography>{hideBalance ? <>
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                </> : activeMT5AccountDetails?.Balance || 0} USD</Typography>
                        }
                        <ArrowDropDownOutlinedIcon />
                    </Box>
                </Stack>
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
                        }}
                    >
                        {
                            Object.entries(accountDetailsData).map(([key, value], i) => (
                                <Stack key={i} sx={{ width: "100%", flexDirection: "row", justifyContent: "space-between", mt: "10px" }}>
                                    <Typography sx={{ fontSize: "14px" }}>{key}:</Typography>
                                    {
                                        !activeMT5AccountDetails ?
                                            <Skeleton width={"50%"} />
                                            :
                                            <Typography>{hideBalance ? <>
                                                <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                            </> : value || 0}</Typography>
                                    }
                                </Stack>
                            ))
                        }
                        {
                            activeMT5AccountType == "Real"
                                ?
                                <Stack sx={{ flexDirection: "row", mt: ".8rem", width: "100%", gap: "10px" }}>
                                    <Button
                                        fullWidth
                                        component={Link}
                                        to={"/client/transactions/withdrawal"}
                                        variant='contained'
                                        size='small'
                                        sx={{
                                            textTransform: "capitalize",
                                            boxShadow: "none",
                                            color: "white",
                                            "&:hover": {
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        Withdraw
                                    </Button>
                                    <Button
                                        fullWidth
                                        component={Link}
                                        to={"/client/transactions/deposit"}
                                        variant='contained'
                                        size='small'
                                        sx={{
                                            textTransform: "capitalize",
                                            boxShadow: "none",
                                            color: "white",
                                            "&:hover": {
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        Deposit
                                    </Button>
                                </Stack>
                                :
                                <Button
                                    fullWidth
                                    component={Link}
                                    to={"/client/myAccount"}
                                    variant='contained'
                                    size='small'
                                    sx={{
                                        mt: ".8rem",
                                        textTransform: "capitalize",
                                        boxShadow: "none",
                                        color: "white",
                                        "&:hover": {
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Deposit
                                </Button>
                        }
                    </MenuItem>,
                    <Divider key="divider-1" />,
                    <MenuItem
                        key="trading-account-info"
                        sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            '&:hover': {
                                backgroundColor: 'transparent'
                            }
                        }}>
                        <Stack
                            sx={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            onClick={() => navigate("/client/myAccount")}
                        >
                            <Typography fontSize={"15px"} color="textSecondary">Manage Accounts</Typography>
                            <KeyboardArrowRightIcon />
                        </Stack>
                    </MenuItem>
                ]}
            </Menu >
        </>
    );
}

export default TerminalAccountDetailsMenu;