import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import TerminalAccountDetailsMenu from "../header/TerminalAccountDetailsMenu";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent";
import TerminalDepositModal from "../../pages/tradingTerminal/TerminalDepositModal";
import TerminalAccountDetailsMenuForMobile from "../header/TerminalAccountDetailsMenuForMobile";
import TerminalBuySell from "../header/TerminalBuySell";
import { useMediaQuery } from "@mui/material";
import AccountDetails from "../accountDetails/AccountDetails";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


function TerminalMobileDrawer() {

    const theme = useTheme()

    const { activeMT5AccountType } = useSelector(state => state.mt5)

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSignOut = () => {
        dispatch(logoutThunk())
        dispatch(setNotification({ open: true, message: "You have been logged out.", severity: "info" }));
        // notifyMt5AccountChange(channel);
    }

    const list = (
        <Box
            sx={{
                width: { xs: "100vw", sm: 300 },
                pt: { xs: "56px", sm: "64px" },
            }}
            role="presentation"
        >
            {
                isMobile
                &&
                <>
                    <List>
                        <ListItem>
                            <TerminalBuySell />
                        </ListItem>
                    </List>

                    <Divider />
                </>
            }

            <List>
                {/* <ListItem> */}
                {/* <TerminalAccountDetailsMenu /> */}
                <AccountDetails />
                <TerminalAccountDetailsMenuForMobile />
                {/* </ListItem> */}
            </List>

            <Divider />

            <List>
                <ListItem disablePadding>
                    {activeMT5AccountType == "Real"
                        ?
                        <ListItemButton component={Link} to={"/client/transactions/deposit"}>
                            <ListItemIcon><ArrowCircleDownIcon /></ListItemIcon>
                            <ListItemText primary={"Deposit"} />
                        </ListItemButton>
                        :
                        <ModalComponent
                            btnName={"Deposit"}
                            Content={TerminalDepositModal}
                            btnSx={{
                                bgcolor: theme.palette.custom.activeNavigation,
                                color: "white",
                                px: "4rem",
                                py: ".5rem"
                            }}
                        />
                    }
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={"/client/transactions/deposit"} onClick={handleSignOut}>
                        <ListItemIcon><LogoutOutlinedIcon sx={{ fontSize: "1.2rem" }} /></ListItemIcon>
                        <ListItemText primary={"Sign out"} />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />

            {/* <List>
                {[
                    { text: "All Mail", icon: <InboxIcon />, path: "/all-mail" },
                    { text: "Trash", icon: <MailIcon />, path: "/trash" },
                    { text: "Spam", icon: <InboxIcon />, path: "/spam" },
                ].map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.path}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List> */}
        </Box>
    );

    return (
        <Fragment>
            <IconButton onClick={toggleDrawer(!open)} sx={{ color: "inherit" }}>
                <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                {list}
            </Drawer>
        </Fragment>
    );

}

export default TerminalMobileDrawer;