import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import SwitchComponent from '../../components/SwitchComponent';
import { Stack, Button, Skeleton, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setHideBalance } from '../../globalState/profileState/profileStateSlices';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function TerminalAccountDetailsMenuForMobile() {

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
        <div>
            <Accordion sx={{ boxShadow: "none", m: 0, p: 0, bgcolor: "#3f3f3f" }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
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
                        <Typography fontSize={"12px"} mr={"10px"}>Standard</Typography>
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
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ m: 0, p: "15px" }}>
                    <Stack>
                        Hide balance
                        <SwitchComponent onChange={handleBalanceHide} checked={hideBalance} />
                    </Stack>
                    <Stack sx={{ width: "100%" }}>
                        {
                            Object.entries(accountDetailsData).map(([key, value], i) => (
                                <Stack key={i} sx={{ flexDirection: "row", justifyContent: "space-between", mt: "10px" }}>
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
                    </Stack>
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
                    <Stack
                        sx={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", mt: "15px" }}
                        onClick={() => navigate("/client/myAccount")}
                    >
                        <Typography fontSize={"15px"} color="textSecondary">Manage Accounts</Typography>
                        <KeyboardArrowRightIcon />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default TerminalAccountDetailsMenuForMobile;