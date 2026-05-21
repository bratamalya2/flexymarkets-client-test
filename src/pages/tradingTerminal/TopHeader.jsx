import { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TerminalAccountDetailsMenu from '../../layout/header/TerminalAccountDetailsMenu';
import ModalComponent from "../../components/ModalComponent";
import MetaDeposit from "../../pages/myAccount/liveAccount/accountDetailsAccordian/MetaDeposit";
import { useGetUserDataQuery } from '../../globalState/userState/userStateApis';
import TerminalDepositModal from "../tradingTerminal/TerminalDepositModal";
import TerminalMobileDrawer from '../../layout/tradingTerminalLayout/TerminalMobileDrawer';

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function TopHeader() {

    const theme = useTheme()

    const modalWidth = useMediaQuery('(max-width:600px)');
    const hideMenuAndDeposit = useMediaQuery(theme.breakpoints.up('sm'));

    const { token } = useSelector((state) => state.auth);

    // const [currentTime, setCurrentTime] = useState('');
    // const [timeAnimation, setTimeAnimation] = useState('none');

    const { activeMT5AccountType, activeMT5AccountDetails } = useSelector(state => state.mt5);

    const { data, isLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mainBalance = !isLoading && data?.data?.assetData?.mainBalance

    // useEffect(() => {
    //     const updateTime = () => {
    //         const now = new Date();
    //         const timeStr = now.toLocaleDateString('en-US', {
    //             month: 'short',
    //             day: '2-digit',
    //             weekday: 'short'
    //         }) + ' | ' + now.toLocaleTimeString('en-US', {
    //             hour: '2-digit',
    //             minute: '2-digit',
    //             second: '2-digit',
    //             hour12: false
    //         }) + ' GMT+2';

    //         setCurrentTime(timeStr);

    //         if (now.getSeconds() === 0) {
    //             setTimeAnimation('timeUpdate 0.5s ease');
    //             setTimeout(() => setTimeAnimation('none'), 500);
    //         }
    //     };

    //     updateTime();
    //     const interval = setInterval(updateTime, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    // useEffect(() => {
    //     if (activeMT5AccountDetails) {
    //         const balance = activeMT5AccountDetails.Balance || 0;
    //         const equity = activeMT5AccountDetails.Equity || 0;

    //         if (balance !== previousBalance.current) {
    //             const change = balance - previousBalance.current;
    //             if (change !== 0) {
    //                 setPriceAnimations(prev => ({
    //                     ...prev,
    //                     balance: change > 0 ? 'up' : 'down'
    //                 }));
    //                 setTimeout(() => {
    //                     setPriceAnimations(prev => ({ ...prev, balance: undefined }));
    //                 }, 500);
    //             }
    //             previousBalance.current = balance;
    //         }

    //         if (equity !== previousEquity.current) {
    //             const change = equity - previousEquity.current;
    //             if (change !== 0) {
    //                 setPriceAnimations(prev => ({
    //                     ...prev,
    //                     equity: change > 0 ? 'up' : 'down'
    //                 }));
    //                 setTimeout(() => {
    //                     setPriceAnimations(prev => ({ ...prev, equity: undefined }));
    //                 }, 500);
    //             }
    //             previousEquity.current = equity;
    //         }
    //     }
    // }, [activeMT5AccountDetails]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'USD'
        });
    };

    const showLeftPanel = useMediaQuery('(min-width:1024px)');

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #0a0e17 0%, #1a1f2e 100%)",
                height: "55px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                borderBottom: "1px solid rgba(76, 175, 80, 0.2)",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                zIndex: 1000,
                animation: "headerSlideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}>
            {/* Animated background elements */}
            <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                    linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(76, 175, 80, 0.03) 50%, 
                        transparent 100%
                    )
                `,
                animation: "headerScan 10s infinite linear",
                pointerEvents: "none"
            }} />

            <Stack sx={{ flexDirection: "row", gap: "5rem" }}>

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    animation: "fadeInLeft 0.5s ease"
                }}>
                    {/* Platform Title */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <Box sx={{
                            background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
                            animation: "logoFloat 3s infinite ease-in-out"
                        }}>
                            <TrendingUpIcon sx={{
                                fontSize: "20px",
                                color: "white"
                            }} />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={{
                                fontSize: "16px",
                                fontWeight: "900",
                                background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "0.5px",
                                lineHeight: 1.2
                            }}>
                                {SHORT_BRAND_NAME}
                            </Typography>
                            <Typography sx={{
                                fontSize: "11px",
                                color: "#9ca3af",
                                fontWeight: 600,
                                letterSpacing: "0.5px",
                                textTransform: "uppercase"
                            }}>
                                Professional Trading
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {
                    showLeftPanel
                    &&
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        animation: "fadeInUp 0.5s ease 0.1s both"
                    }}>
                        {/* Balance */}
                        <Tooltip title="Account Balance" arrow>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <Typography sx={{
                                    fontSize: "10px",
                                    color: "#9ca3af",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    mb: "2px"
                                }}>
                                    Balance
                                </Typography>
                                <Typography sx={{
                                    fontSize: "14px",
                                    fontWeight: "700"
                                }}>
                                    {formatCurrency(activeMT5AccountDetails?.Balance || 0)}
                                </Typography>
                            </Box>
                        </Tooltip>

                        {/* Equity */}
                        <Tooltip title="Account Equity" arrow>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <Typography sx={{
                                    fontSize: "10px",
                                    color: "#9ca3af",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    mb: "2px"
                                }}>
                                    Equity
                                </Typography>
                                <Typography sx={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>
                                    {formatCurrency(activeMT5AccountDetails?.Equity || 0)}
                                </Typography>
                            </Box>
                        </Tooltip>

                        {/* Margin Info */}
                        <Tooltip title="Margin Information" arrow>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px"
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}>
                                    <Typography sx={{
                                        fontSize: "10px",
                                        color: "#FF9800",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px"
                                    }}>
                                        Margin
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        color: "#FF9800"
                                    }}>
                                        {formatCurrency(activeMT5AccountDetails?.Margin || 0)}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    width: "1px",
                                    height: "30px",
                                    background: "rgba(255, 152, 0, 0.3)"
                                }} />

                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}>
                                    <Typography sx={{
                                        fontSize: "10px",
                                        color: "#2196F3",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px"
                                    }}>
                                        Free Margin
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        color: "#2196F3"
                                    }}>
                                        {formatCurrency(activeMT5AccountDetails?.MarginFree || 0)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Tooltip>
                    </Box>
                }

            </Stack>

            {/* <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                animation: "fadeInRight 0.5s ease"
            }}>
                <Tooltip title="Server Time (GMT+2)" arrow>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 15px",
                        background: "rgba(14, 18, 28, 0.7)",
                        borderRadius: "20px",
                        border: "1px solid rgba(76, 175, 80, 0.2)",
                        backdropFilter: "blur(5px)",
                        animation: timeAnimation
                    }}>
                        <AccessTimeIcon sx={{
                            fontSize: "16px",
                            color: "#4CAF50",
                            animation: "iconFloat 3s infinite ease-in-out"
                        }} />
                        <Typography sx={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "white",
                            letterSpacing: "0.5px",
                            fontFamily: "'Roboto Mono', monospace"
                        }}>
                            {currentTime}
                        </Typography>
                    </Box>
                </Tooltip>
            </Box> */}

            {
                hideMenuAndDeposit
                    ?
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        animation: "fadeInRight 0.5s ease"
                    }}>
                        <TerminalAccountDetailsMenu />
                        {
                            activeMT5AccountType == "Real"
                                ?
                                <ModalComponent
                                    btnName={"Deposit"}
                                    Content={MetaDeposit}
                                    contentData={{
                                        login: activeMT5AccountDetails?.Login,
                                        refetch,
                                        mainBalance: Number(mainBalance || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                        })
                                    }}
                                    modalWidth={modalWidth ? "95%" : 500}
                                    btnSx={{
                                        bgcolor: theme.palette.custom.activeNavigation,
                                        color: "white",
                                        px: "4rem",
                                        py: ".5rem"
                                    }}
                                />
                                :
                                <ModalComponent
                                    btnName={"Deposit"}
                                    Content={TerminalDepositModal}
                                    btnSx={{
                                        bgcolor: theme.palette.custom.activeNavigation,
                                        color: "white",
                                        px: "4rem",
                                        py: ".5rem",
                                        boxShadow: "none,"
                                    }}
                                    modalWidth={modalWidth ? "95%" : 500}
                                />
                        }
                    </Box>
                    :
                    <TerminalMobileDrawer />
            }

            <style>
                {`
                    @keyframes headerSlideDown {
                        from { 
                            transform: translateY(-100%); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateY(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes fadeInLeft {
                        from { 
                            transform: translateX(-30px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateX(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes fadeInRight {
                        from { 
                            transform: translateX(30px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateX(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes fadeInUp {
                        from { 
                            transform: translateY(20px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateY(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes headerScan {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    
                    @keyframes logoFloat {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        25% { transform: translateY(-3px) rotate(-2deg); }
                        75% { transform: translateY(-3px) rotate(2deg); }
                    }
                    
                    @keyframes timeUpdate {
                        0% { 
                            transform: scale(1); 
                            background: rgba(14, 18, 28, 0.7); 
                        }
                        50% { 
                            transform: scale(1.05); 
                            background: rgba(76, 175, 80, 0.2); 
                        }
                        100% { 
                            transform: scale(1); 
                            background: rgba(14, 18, 28, 0.7); 
                        }
                    }
                    
                    @keyframes priceUp {
                        0% { 
                            transform: scale(1); 
                            text-shadow: 0 0 0 rgba(76, 175, 80, 0); 
                        }
                        50% { 
                            transform: scale(1.1); 
                            text-shadow: 0 0 10px rgba(76, 175, 80, 0.5); 
                        }
                        100% { 
                            transform: scale(1); 
                            text-shadow: 0 0 0 rgba(76, 175, 80, 0); 
                        }
                    }
                    
                    @keyframes priceDown {
                        0% { 
                            transform: scale(1); 
                            text-shadow: 0 0 0 rgba(244, 67, 54, 0); 
                        }
                        50% { 
                            transform: scale(1.1); 
                            text-shadow: 0 0 10px rgba(244, 67, 54, 0.5); 
                        }
                        100% { 
                            transform: scale(1); 
                            text-shadow: 0 0 0 rgba(244, 67, 54, 0); 
                        }
                    }
                    
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    
                    @keyframes badgePulse {
                        0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                        70% { box-shadow: 0 0 0 5px rgba(76, 175, 80, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                    }
                    
                    @keyframes badgeBounce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                    }
                    
                    @keyframes iconFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                `}
            </style>
        </Box>
    );
}

export default TopHeader;