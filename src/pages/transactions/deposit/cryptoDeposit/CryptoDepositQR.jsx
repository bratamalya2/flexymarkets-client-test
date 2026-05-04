import {
    Card,
    CardContent,
    Stack,
    Typography,
    Tooltip,
    IconButton,
    Container,
    Box,
    ListItem,
    List,
    Skeleton,
    Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import CountdownTimer from "../../../../components/CountdownTimer"
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import useCountdownTimer from "../../../../hooks/useCountdownTimer";
import { removeDepositQRData, removeCreatedTime, removeExpireTime, setHasStarted } from "../../../../globalState/paymentState/paymentSlice";
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useLazyCheckPaymentStatusQuery } from '../../../../globalState/userState/userStateApis';
import CloseIcon from '@mui/icons-material/Close';


function CryptoDepositQR() {

    const dispatch = useDispatch()


    const { depositQRData, createdTime, expireTime } = useSelector(state => state.payment);
    const qrValue = depositQRData?.payment_address || depositQRData?.invoice_payment_url;

    const timeLeft = useCountdownTimer(createdTime, expireTime, () => {
        dispatch(removeDepositQRData());
        dispatch(removeCreatedTime());
        dispatch(removeExpireTime());
    });

    const isTimedOut = timeLeft <= 0;

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const [checkPaymentStatus, { isFetching }] = useLazyCheckPaymentStatusQuery();

    const handleCheckStatus = async () => {
        if (!depositQRData?.order_no) {
            dispatch(setNotification({ open: true, message: 'Order ID not found.', severity: 'error' }));
            return;
        }
        
        try {
            const res = await checkPaymentStatus(depositQRData.order_no).unwrap();
            dispatch(setNotification({
                open: true,
                message: res.message || 'Status checked.',
                severity: res.status ? 'success' : 'info'
            }));
        } catch (err) {
            dispatch(setNotification({
                open: true,
                message: err?.data?.message || 'Failed to check status.',
                severity: 'error'
            }));
        }
    };

    const handlePaymentWindowClose = () => {
        dispatch(setHasStarted(false))
        dispatch(removeDepositQRData(null));
        dispatch(removeCreatedTime(null));
        dispatch(removeExpireTime(null));
    }

    return (
        <Stack sx={{ borderLeft: { xs: "none", md: "1px solid gray" } }}>
            {/* <Container maxWidth="sm"> */}
            <Tooltip placement="bottom-end" title="Close">
                <IconButton onClick={handlePaymentWindowClose} sx={{ alignSelf: "end", cursor: "pointer" }}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    wordBreak: "break-word",
                }}
            >
                <Typography variant='h6'>
                    {depositQRData?.payment_address ? "Scan QR Code to Complete Deposit" : "Open Checkout to Complete Deposit"}
                </Typography>
                {qrValue ? (
                    <QRCodeCanvas
                        value={qrValue}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                        includeMargin
                    />
                ) : (
                    <Typography color="text.secondary">
                        QR Code not available
                    </Typography>
                )}
                {depositQRData?.invoice_payment_url && (
                    <Button
                        href={depositQRData.invoice_payment_url}
                        target="_blank"
                        rel="noreferrer"
                        variant="contained"
                        sx={{ textTransform: "none", color: "white" }}
                    >
                        Open payment page
                    </Button>
                )}
                
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={handleCheckStatus} 
                    disabled={isFetching}
                    sx={{ mt: 1, textTransform: "none" }}
                >
                    {isFetching ? "Checking..." : "Check Payment Status"}
                </Button>

                <Typography color="red">Your transaction will automatically complete after payment confirmation</Typography>
                {/* <CountdownTimer /> */}
                <Typography fontSize={"1.2rem"} fontWeight={600} color={isTimedOut ? 'error' : 'text.primary'}>
                    {isTimedOut ? <Skeleton width={"100px"} /> : `Time Left: ${formatTime(timeLeft)}`}
                </Typography>
                <Stack sx={{ alignItems: "center", gap: "10px" }}>
                    <Box sx={{ display: "flex", gap: "5px" }}>
                        <Typography fontWeight={"bold"}>Amount to deposit: {depositQRData?.receive_amount}</Typography>
                        <Typography fontWeight={"bold"}>{depositQRData?.token_symbol}</Typography>
                    </Box>
                    <Typography>{depositQRData?.token_name}</Typography>
                </Stack>
                {depositQRData?.payment_address && (
                    <Stack>
                        <Typography fontWeight={"bold"}>Deposit Address:</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography>{depositQRData?.payment_address}</Typography>
                            <Tooltip title={copied ? "Copied!" : "Copy"}>
                                <IconButton onClick={() => handleCopy(depositQRData?.payment_address)}>
                                    <ContentCopyOutlinedIcon sx={{ fontSize: "20px" }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Stack>
                )}
                <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
                    <Typography fontWeight={"bold"} fontSize={"1.5rem"}>Important Note:</Typography>
                    <ListItem sx={{ display: "list-item", p: 0 }}>The system will automatically confirm your payments.</ListItem>
                    <ListItem sx={{ display: "list-item", p: 0 }}>After sending payment please wait for at least 3 to 4 minutes for confirmations, your deposit will be processed automatically.</ListItem>
                    <ListItem sx={{ display: "list-item", p: 0 }}>The above address will be valid for 3 hours to send payment.</ListItem>
                    <ListItem sx={{ display: "list-item", p: 0 }}>If you send payment after 1 hour on the above address it will be ignored.</ListItem>
                    <ListItem sx={{ display: "list-item", p: 0 }}>Transfer exact amount showing above, other amounts will be ignored.</ListItem>
                </List>
            </CardContent>
            {/* </Container> */}
        </Stack>
    );
}

export default CryptoDepositQR;
