const fs = require('fs');

const file = 'c:\\\\Bratamalya\\\\testbharat-frontend\\\\flexymarkets-client-prod\\\\src\\\\pages\\\\transactions\\\\deposit\\\\cryptoDeposit\\\\CryptoDepositQR.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    `import CloseIcon from '@mui/icons-material/Close';`,
    `import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';\nimport { useLazyCheckPaymentStatusQuery } from '../../../../globalState/userState/userStateApis';\nimport CloseIcon from '@mui/icons-material/Close';`
);

content = content.replace(
    `const handlePaymentWindowClose = () => {`,
    `const [checkPaymentStatus, { isFetching }] = useLazyCheckPaymentStatusQuery();

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

    const handlePaymentWindowClose = () => {`
);

content = content.replace(
    `</Button>\n                )}\n                <Typography color="red">Your transaction will automatically complete after payment confirmation</Typography>`,
    `</Button>\n                )}\n                <Button variant="outlined" color="primary" onClick={handleCheckStatus} disabled={isFetching} sx={{ mt: 1, textTransform: "none" }}>\n                    {isFetching ? "Checking..." : "Check Payment Status"}\n                </Button>\n                <Typography color="red">Your transaction will automatically complete after payment confirmation</Typography>`
);

content = content.replace(
    `</Button>\r\n                )}\r\n                <Typography color="red">Your transaction will automatically complete after payment confirmation</Typography>`,
    `</Button>\r\n                )}\r\n                <Button variant="outlined" color="primary" onClick={handleCheckStatus} disabled={isFetching} sx={{ mt: 1, textTransform: "none" }}>\r\n                    {isFetching ? "Checking..." : "Check Payment Status"}\r\n                </Button>\r\n                <Typography color="red">Your transaction will automatically complete after payment confirmation</Typography>`
);

fs.writeFileSync(file, content);
console.log("Done");
