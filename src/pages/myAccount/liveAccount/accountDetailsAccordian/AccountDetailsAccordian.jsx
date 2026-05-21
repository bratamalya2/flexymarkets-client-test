import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Stack, Divider, Box, IconButton, Tooltip, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuComponent from '../../../../components/MenuComponent';
import ModalComponent from '../../../../components/ModalComponent';
import ChangeMT5PasswordModalDetails from "../../ChangeMT5PasswordModalDetails"
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { initiateMT5AccountDetailsSocketConnection } from '../../../../socketENV/MT5AccountDetailsSocketENV';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMt5AccountListQuery } from '../../../../globalState/mt5State/mt5StateApis';


const SERVER_NAME = import.meta.env.VITE_SERVER_NAME;

function AccountDetailsAccordian({ account, actionButtons }) {

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { token } = useSelector((state) => state.auth);

    const [activeAccountDetails, setActiveAccountDetails] = useState(null);
    const socketRef = useRef();

    const { data, isLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mainBalance = Number(!isLoading && data?.data?.assetData?.mainBalance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    useEffect(() => {
        if (!account?.Login || !token) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
            setActiveAccountDetails(null);
        }

        const accountData = (data) => {
            if (data) {
                setActiveAccountDetails(data?.marginDetails ? data?.marginDetails : data);
            }
        };

        socketRef.current = initiateMT5AccountDetailsSocketConnection({
            login: account.Login,
            token,
            accountData
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [account?.Login, token]);

    const accountTypeDetails = useMemo(() => ({
        type: account?.accountType || "-",
        MTVersion: "MT5",
        accountId: account?.Login || "-",
    }), [account]);

    const { data: mt5ListData, isLoading: mt5ListLoading } = useMt5AccountListQuery({
        page: 1,
        sizePerPage: 10,
        search: account?.Login
    })

    const groupDetails = !mt5ListLoading && mt5ListData?.data?.mt5AccountList[0]?.group

    const accountDetailsData = useMemo(() => ({
        "Actual leverage": activeAccountDetails ? activeAccountDetails?.MarginLeverage || "- - - - -" : "- - - - -",
        "Free margin": activeAccountDetails ? activeAccountDetails?.MarginFree || "0.00 USD" : "0.00 USD",
        "Unrealized P&L": activeAccountDetails ? activeAccountDetails?.Profit || "0.00 USD" : "0.00 USD",
        "Equity": activeAccountDetails ? activeAccountDetails?.Equity || "0.00 USD" : "0.00 USD",
        "Credit": activeAccountDetails ? activeAccountDetails?.Credit || "0.00 USD" : "0.00 USD"
    }), [activeAccountDetails]);

    const accountDetailsID = useMemo(() => [
        { type: "Server", id: SERVER_NAME, icon: ContentCopyIcon },
        { type: "MT5 login", id: account?.Login || "-", icon: ContentCopyIcon }
    ], [account]);

    const currentBalance = activeAccountDetails?.Balance || account?.Balance || 0;
    const currentBalanceFormatted = Number(currentBalance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const cardBg = isDarkMode ? '#0b0e11' : '#ffffff';
    const chipRealBg = '#4ADE80';
    const chipRealColor = '#000';
    const chipMtsBg = isDarkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6';
    const chipMtsColor = isDarkMode ? '#fff' : '#000';
    const primaryTextColor = isDarkMode ? '#fff' : '#111827';
    const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
    const iconColor = isDarkMode ? '#6B7280' : '#9CA3AF';
    const dividerColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    const wrapperSx = isDarkMode ? {
        background: `linear-gradient(${cardBg}, ${cardBg}) padding-box, linear-gradient(135deg, #00C076 0%, rgba(0, 192, 118, 0) 60%) border-box`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 8px 32px rgba(0, 192, 118, 0.08), 0px 4px 8px rgba(0,0,0,0.4)',
        border: '1px solid transparent',
    } : {
        background: cardBg,
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
    };

    const modalWidth = useMediaQuery('(max-width:600px)');
    const [copied, setCopied] = useState(false);
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const { hideBalance } = useSelector(state => state.profile);

    return (
        <Stack mt="2rem">
            <Accordion
                defaultExpanded={false}
                sx={{
                    ...wrapperSx,
                    p: "1.5rem",
                    borderRadius: '24px !important',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': { display: 'none' },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: iconColor }} />}
                    sx={{
                        p: "0",
                        '& .MuiAccordionSummary-content': { margin: 0 },
                        '& .MuiAccordionSummary-expandIconWrapper': { alignSelf: 'flex-start', marginTop: '4px' }
                    }}
                >
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{ width: '100%', cursor: 'default', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                        <Stack direction="row" alignItems="center" gap="1rem">
                            {!account ? <Skeleton width={"60px"} height={"25px"} sx={{ bgcolor: dividerColor }} /> :
                                <Box sx={{
                                    bgcolor: chipRealBg, color: chipRealColor, borderRadius: '4px', px: '8px', py: '2px',
                                    fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.5
                                }}>
                                    {accountTypeDetails.type}
                                </Box>
                            }
                            {!account ? <Skeleton width={"60px"} height={"25px"} sx={{ bgcolor: dividerColor }} /> :
                                <Box sx={{
                                    bgcolor: chipMtsBg, color: chipMtsColor, borderRadius: '4px', px: '8px', py: '2px',
                                    fontSize: '11px', fontWeight: 700, lineHeight: 1.5
                                }}>
                                    {accountTypeDetails.MTVersion}
                                </Box>
                            }
                            {!account ? <Skeleton width={"80px"} height={"25px"} sx={{ bgcolor: dividerColor }} /> :
                                <Stack direction="row" alignItems="center" gap="0.3rem">
                                    <AccountCircleIcon sx={{ color: iconColor, fontSize: '18px' }} />
                                    <Typography sx={{ color: isDarkMode ? '#D1D5DB' : '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'monospace' }}>
                                        {accountTypeDetails.accountId}
                                    </Typography>
                                </Stack>
                            }
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between" width="100%" gap="2rem">
                            <Box>
                                <Typography sx={{ fontSize: '40px', fontWeight: 500, color: primaryTextColor, lineHeight: 1, letterSpacing: '-0.5px' }}>
                                    {hideBalance ? '••••••' : currentBalanceFormatted}
                                    <Typography component="span" sx={{ fontSize: '18px', color: secondaryTextColor, fontWeight: 400, ml: 1.5, textTransform: 'uppercase' }}>
                                        USD
                                    </Typography>
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                                {actionButtons.map((button, i) => (
                                    <Box key={i}>
                                        {button.name ? (
                                            button.link ? (
                                                <Button
                                                    startIcon={<button.icon />}
                                                    sx={{
                                                        textTransform: "capitalize",
                                                        bgcolor: isDarkMode ? '#fff' : '#F3F4F6', color: "#000",
                                                        boxShadow: "none !important", borderRadius: '6px', p: "6px 20px",
                                                        fontSize: '14px', fontWeight: 600, height: '36px',
                                                        '&:hover': { bgcolor: isDarkMode ? '#f3f4f6' : '#E5E7EB' }
                                                    }}
                                                >
                                                    {button.name}
                                                </Button>
                                            ) : (
                                                button.modal &&
                                                <ModalComponent
                                                    startIcon={<button.icon />}
                                                    btnName={button.name}
                                                    Content={button.modal}
                                                    contentData={{ login: accountTypeDetails.accountId, mainBalance, refetch }}
                                                    btnSx={{
                                                        textTransform: "capitalize",
                                                        bgcolor: button?.name === "Trade" ? 'transparent' : (isDarkMode ? '#fff' : '#F3F4F6'),
                                                        background: button?.name === "Trade" ? 'linear-gradient(180deg, rgba(20,83,45,0.6) 0%, rgba(20,83,45,0.2) 100%)' : undefined,
                                                        border: button?.name === "Trade" ? '1px solid #22c55e' : 'none',
                                                        color: button?.name === "Trade" ? (isDarkMode ? '#fff' : '#166534') : '#000',
                                                        boxShadow: button?.name === "Trade" ? '0px 0px 10px rgba(34, 197, 94, 0.3)' : "none !important",
                                                        borderRadius: '6px', p: "6px 20px", fontSize: '14px', fontWeight: 600, height: '36px',
                                                        "&:hover": { bgcolor: button?.name === "Trade" ? 'rgba(20,83,45,0.8)' : (isDarkMode ? '#f3f4f6' : '#E5E7EB') }
                                                    }}
                                                    modalWidth={modalWidth ? "95%" : 500}
                                                />
                                            )
                                        ) : (
                                            <MenuComponent
                                                modal={ModalComponent}
                                                modalComponentData={{
                                                    mt5Login: accountTypeDetails.accountId,
                                                    accountInfo: {
                                                        accountDetailsData,
                                                        accountTypeDetails,
                                                        accountDetailsID,
                                                        groupDetails
                                                    }
                                                }}
                                                btnContent={<button.icon />}
                                                modalMenuData={button.menuItems}
                                                btnSx={{
                                                    bgcolor: isDarkMode ? '#fff' : '#F3F4F6',
                                                    "&:hover": { bgcolor: isDarkMode ? '#f3f4f6' : '#E5E7EB' },
                                                    color: "black", boxShadow: "none !important", minWidth: "2.5rem",
                                                    borderRadius: '6px', p: "8px", height: '36px'
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Stack>
                    </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: "0", mt: "1.5rem" }}>
                    <Stack gap="0px">
                        <Divider sx={{ borderColor: dividerColor, borderStyle: 'dashed' }} />
                        {accountDetailsData && Object.entries(accountDetailsData).map(([key, value], i) => (
                            <Box key={key}>
                                <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", py: "1rem" }}>
                                    <Typography sx={{ color: secondaryTextColor, fontSize: '14px' }}>{key}</Typography>
                                    <Typography sx={{ color: primaryTextColor, fontSize: '14px', fontWeight: 500 }}>{value}</Typography>
                                </Stack>
                                <Divider sx={{ borderColor: dividerColor, borderStyle: 'dashed' }} />
                            </Box>
                        ))}
                    </Stack>
                    <Box sx={{ mt: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Stack direction="row" gap="1.5rem" flexWrap="wrap">
                            {accountDetailsID.map((ele, i) => (
                                <Stack key={i} direction="row" alignItems="center" gap="0.5rem">
                                    <Typography sx={{ color: secondaryTextColor, fontSize: "12px" }}>{ele.type}:</Typography>
                                    <Typography sx={{ fontSize: "12px", color: primaryTextColor, fontWeight: 500 }}>{ele.id}</Typography>
                                    <Tooltip title={copied ? "Copied!" : "Copy"}>
                                        <IconButton size="small" onClick={() => handleCopy(ele?.id)} sx={{ color: secondaryTextColor, p: 0.5, '&:hover': { color: isDarkMode ? '#fff' : '#000' } }}>
                                            <ele.icon sx={{ fontSize: "14px" }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            ))}
                        </Stack>
                        <ModalComponent
                            startIcon={<EditIcon sx={{ fontSize: '16px' }} />}
                            btnName={"Change trading password"}
                            Content={ChangeMT5PasswordModalDetails}
                            contentData={{ mt5Login: accountTypeDetails.accountId }}
                            btnSx={{
                                textTransform: "capitalize", bgcolor: "transparent", color: secondaryTextColor,
                                fontSize: "12px", boxShadow: "none !important", p: "4px 8px", borderRadius: '4px',
                                border: `1px solid ${dividerColor}`,
                                "&:hover": { bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: primaryTextColor, borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }
                            }}
                            modalWidth={modalWidth ? "95%" : 500}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}

export default AccountDetailsAccordian;