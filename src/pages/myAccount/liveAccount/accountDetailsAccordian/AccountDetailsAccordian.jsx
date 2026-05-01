import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Stack, Divider, Box, IconButton, Tooltip, Skeleton, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import MenuComponent from '../../../../components/MenuComponent';
import ModalComponent from '../../../../components/ModalComponent';
import ChangeMT5PasswordModalDetails from "../../ChangeMT5PasswordModalDetails"
import { useState } from 'react';
import { useSelector } from 'react-redux';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


function AccountDetailsAccordian({ activeAccountBalance, activeAccountBalanceLoading, activeAccountDetails, accountTypeDetails, accountDetailsData, accountDetailsID, actionButtons }) {

    const modalWidth = useMediaQuery('(max-width:600px)');

    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const { hideBalance } = useSelector(state => state.profile)

    return (
        <Stack mt="2rem">
            <Accordion
                defaultExpanded
                sx={{
                    boxShadow: "none",
                    p: "1rem",
                    border: "1px solid #afb5b9",
                    borderRadius: '.8rem !important'
                }}
            >
                <Stack gap=".7rem">
                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",
                                fontSize: "12px",
                                gap: ".5rem",
                            }}
                        >
                            {!activeAccountDetails ? <Skeleton width={"80px"} height={"25px"} /> : <Typography
                                fontSize={"12px"}
                                borderRadius={".2rem"}
                                bgcolor={accountTypeDetails.type === "Real" ? "#fffceb" : "#e8f6ee"}
                                px={".5rem"}
                                py={".1rem"}
                                color={accountTypeDetails.type === "Real" ? "black" : "#29834d"}
                            >
                                {accountTypeDetails.type}
                            </Typography>}
                            {!activeAccountDetails ? <Skeleton width={"80px"} height={"25px"} /> : <Typography
                                color="black"
                                fontSize={"12px"}
                                borderRadius={".2rem"}
                                bgcolor={"#f3f5f7"}
                                px={".5rem"}
                                py={".1rem"}
                            >
                                {accountTypeDetails.MTVersion}
                            </Typography>}
                            {!activeAccountDetails ? <Skeleton width={"80px"} height={"25px"} /> : <Typography
                                color="black"
                                fontSize={"12px"}
                                borderRadius={".2rem"}
                                bgcolor={"#f3f5f7"}
                                px={".5rem"}
                                py={".1rem"}
                            >
                                {accountTypeDetails.groupType}
                            </Typography>}
                            {!activeAccountDetails ? <Skeleton width={"80px"} height={"25px"} /> : <Typography fontSize={"14px"} fontWeight={"700"}>
                                {accountTypeDetails.accountId}
                            </Typography>}
                        </Stack>
                        <AccordionSummary sx={{ width: "auto", p: "0" }}>
                            <ExpandMoreIcon />
                        </AccordionSummary>
                    </Stack>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap="1.2rem"
                    >
                        {!activeAccountDetails ? <Skeleton width={"200px"} height={"40px"} /> : (<Typography variant="h4" fontWeight={"700"}>
                            {hideBalance
                                ?
                                <>
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                    <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                </>
                                :
                                activeAccountBalance || 0}<Typography component={"span"}> USD</Typography>
                        </Typography>)}
                        {
                            <Box sx={{ width: { xs: "100%", sm: "auto" }, display: "flex", flexWrap: "wrap", gap: ".5rem", justifyContent: "space-between" }}>
                                {actionButtons.map((button, i) => (
                                    <Box key={i}>
                                        {button.name ? (
                                            button.link ? (
                                                <Button
                                                    component={Link}
                                                    to={button.link}
                                                    startIcon={<button.icon />}
                                                    sx={{
                                                        textTransform: "capitalize",
                                                        bgcolor: "#f3f5f7",
                                                        color: "black",
                                                        boxShadow: "none !important",
                                                        p: "6px 20px"
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
                                                    contentData={{ login: accountTypeDetails.accountId }}
                                                    btnSx={{
                                                        textTransform: "capitalize",
                                                        bgcolor: button?.name == "Trade" ? "primary.main" : "#f3f5f7",
                                                        color: button?.name == "Trade" ? "white" : "black",
                                                        boxShadow: "none !important",
                                                        p: "6px 20px",
                                                        "&:hover": {
                                                            bgcolor: button?.name == "Trade" ? "primary.main" : "#f3f5f7",
                                                        }
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
                                                        accountDetailsID
                                                    }
                                                }}
                                                btnContent={<button.icon />}
                                                modalMenuData={button.menuItems}
                                                btnSx={{
                                                    bgcolor: "#f3f5f7",
                                                    "&:hover": { bgcolor: "#f3f5f7", },
                                                    color: "black",
                                                    boxShadow: "none !important",
                                                    minWidth: "2.5rem",
                                                    p: "6px"
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        }
                    </Stack>
                </Stack>
                <AccordionDetails
                    sx={{
                        p: "0",
                        mt: "1.5rem",
                        borderRadius: "8px",
                    }}
                >
                    {accountDetailsData &&
                        Object.entries(accountDetailsData).map(([key, value], i) => (
                            <Stack
                                key={key}
                                sx={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    p: "0.5rem 1rem",
                                    borderBottom: i !== 4 && "1px dashed gray",
                                }}
                            >
                                {!activeAccountDetails ? <Skeleton width={"100px"} height={"25px"} /> : <Typography>{key}</Typography>}
                                {!activeAccountDetails ? <Skeleton width={"100px"} height={"25px"} /> : <Typography>{value}</Typography>}
                            </Stack>
                        ))
                    }
                </AccordionDetails>
                <AccordionDetails
                    sx={{
                        p: "0",
                        mt: "1.5rem",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: "1rem",
                        }}
                    >
                        {accountDetailsID &&
                            accountDetailsID.map((ele, i) => (
                                <Stack
                                    key={i}
                                    sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem" }}
                                >
                                    <Typography
                                        color="#afb5b9"
                                        fontSize={"14px"}
                                    >
                                        {ele.type}:
                                    </Typography>
                                    {!activeAccountDetails ? <Skeleton width={"100px"} height={"20px"} /> : <Typography fontSize={"14px"} >
                                        {ele.id}
                                    </Typography>}
                                    <Tooltip title={copied ? "Copied!" : "Copy"}>
                                        <IconButton sx={{ p: 0 }} onClick={() => handleCopy(ele?.id)}>
                                            <ele.icon sx={{ fontSize: "14px" }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            ))}
                    </Stack>
                    <Divider orientation="vertical" variant="middle" />
                    <ModalComponent
                        startIcon={<EditIcon />}
                        btnName={"Change trading password"}
                        Content={ChangeMT5PasswordModalDetails}
                        contentData={{ mt5Login: accountTypeDetails.accountId }}
                        btnSx={{
                            textTransform: "capitalize",
                            bgcolor: "#f3f5f7",
                            color: "black",
                            boxShadow: "none !important",
                            mt: ".5rem",
                            "&:hover": {
                                bgcolor: "#f3f5f7",
                                color: "black",
                            }
                        }}
                        modalWidth={modalWidth ? "95%" : 500}
                    />
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}

export default AccountDetailsAccordian;