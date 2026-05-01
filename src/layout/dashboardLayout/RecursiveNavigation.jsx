import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Tooltip,
    Stack,
    useMediaQuery
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../globalState/auth/authThunk";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";


function RecursiveNavigation({ items, sidebarOpen, toggleSidebarOpen, darkMode }) {

    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState({});
    const isLgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    const hasActiveChild = useCallback(function checkItem(item) {
        if (location.pathname === item.segment) return true;
        if (item.children) {
            return item.children.some(child => checkItem(child));
        }
        return false;
    }, [location.pathname]);

    useEffect(() => {
        const newOpenSubmenu = {};
        items.forEach(item => {
            if (item.children && hasActiveChild(item)) {
                newOpenSubmenu[item.title] = true;
            }
        });
        setOpenSubmenu(newOpenSubmenu);
    }, [location.pathname, items, hasActiveChild]);

    const handleToggleSubmenu = (key, hasChildren) => {
        if (hasChildren && !sidebarOpen) {
            toggleSidebarOpen(true);
        } else if (!hasChildren && isLgDown) {
            toggleSidebarOpen(false);
        }

        setOpenSubmenu((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const dispatch = useDispatch()

    const handleSignOut = () => {
        dispatch(logoutThunk())
        dispatch(setNotification({ open: true, message: "You have been logged out.", severity: "info" }));
    }

    return (
        <List>
            {items.map((item) => {
                const isActive = location.pathname === item.segment;
                const hasChildren = !!item.children;
                const isLink = !!item.segment

                return (
                    <Stack key={item.title} sx={{ px: ".4rem" }}>
                        <Tooltip title={!sidebarOpen ? item.title : ""} placement="right">
                            <ListItem
                                // button
                                component={item.external ? "a" : isLink ? Link : "div"}
                                href={item.external ? item.segment : undefined}
                                target={item.external ? "_blank" : undefined}
                                rel={item.external ? "noopener noreferrer" : undefined}
                                to={isLink && !item.external ? item.segment : undefined}
                                onClick={item.title === "Logout" ?
                                    () => handleSignOut()
                                    :
                                    () => handleToggleSubmenu(item.title, hasChildren)
                                }
                                sx={{
                                    height: "3rem",
                                    cursor: "pointer",
                                    color: darkMode ? "white" : "#00000099",
                                    backgroundColor: isActive ? theme => theme.palette.custom.activeNavigation : "transparent",
                                    "&:hover": { backgroundColor: theme => theme.palette.custom.activeNavigation },
                                    borderRadius: '8px',
                                    display: !sidebarOpen && "flex",
                                    alignItems: !sidebarOpen && "center",
                                    justifyContent: !sidebarOpen && "center",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: "primary.main",
                                        minWidth: !sidebarOpen ? "auto" : "45px"
                                    }}
                                >
                                    <item.icon />
                                </ListItemIcon>
                                {sidebarOpen && <ListItemText primary={item.title} />}
                                {hasChildren && sidebarOpen &&
                                    (openSubmenu[item.title] ? <ExpandLess /> : <ExpandMore />)}
                            </ListItem>
                        </Tooltip>
                        {hasChildren && sidebarOpen && (
                            <Collapse in={openSubmenu[item.title]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <RecursiveNavigation
                                        items={item.children}
                                        sidebarOpen={sidebarOpen}
                                        toggleSidebarOpen={toggleSidebarOpen}
                                        darkMode={darkMode}
                                    />
                                </List>
                            </Collapse>
                        )}
                    </Stack>
                );
            })}
        </List>
    );
}

export default RecursiveNavigation;