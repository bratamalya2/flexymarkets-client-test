import {
    CardContent,
    Stack,
    Typography,
    Box,
    ListItem,
    List
} from "@mui/material";

const BRAND_EMAIL = import.meta.env.VITE_BRAND_EMAIL;

function BankDepositDetails() {

    return (
        <Stack sx={{ borderLeft: { xs: "none", md: "1px solid gray" } }}>
            <CardContent>
                <Typography fontWeight={"bold"} fontSize={"1.2rem"}>
                    Deposit Details
                </Typography>
                <List sx={{ listStyleType: "disc", pl: 2, py: 2 }}>
                    <ListItem sx={{ display: "list-item", px: 0, py: 0.5 }}>Deposit Fund into the provided account and upload the deposit proof. MUST mention the Transaction ID.</ListItem>
                    <ListItem sx={{ display: "list-item", px: 0, py: 0.5 }}>In case if you need support please mail to, {BRAND_EMAIL}</ListItem>
                    <ListItem sx={{ display: "list-item", px: 0, py: 0.5 }}>Note:- Clients from India, please deposit to the bank account below:</ListItem>
                    <ListItem sx={{ display: "list-item", px: 0, py: 0.5 }}>Note: 1 USD = 3.67 AED</ListItem>
                    <ListItem sx={{ display: "list-item", px: 0, py: 0.5 }}>Note: Do not use Cash Deposit in this bank account, Violation did not get Verify.</ListItem>
                    <ListItem sx={{ display: "list-item", px: 0, py: 0.5 }}>Note: Deposit Confirmation time is 30 Minutes in Working Hours.</ListItem>
                </List>
                {/* <Stack sx={{ flexDirection: "row", gap: "2rem" }}>
                    <Box>
                        <Typography fontSize={"14px"}>Account Name :</Typography>
                        <Typography fontSize={"14px"}>Account No. :</Typography>
                        <Typography fontSize={"14px"}>Bank Name :</Typography>
                        <Typography fontSize={"14px"}>IFSC Code :</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>BHAVANI ENTERPRISE</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>1336102000049841</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>IDBI bank - SARTHANA SURAT</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>IBKL0001336</Typography>
                    </Box>
                </Stack> */}
                <Typography fontWeight={"bold"} fontSize={"1.2rem"} my={2}>
                    AED Bank Details :
                </Typography>
                <Stack sx={{ flexDirection: "row", gap: "2rem" }}>
                    <Box>
                        <Typography fontSize={"14px"}>Account Name :</Typography>
                        <Typography fontSize={"14px"}>Account No. :</Typography>
                        <Typography fontSize={"14px"}>IBAN number :</Typography>
                        <Typography fontSize={"14px"}>Bank swift code :</Typography>
                        <Typography fontSize={"14px"}>Bank address :</Typography>
                        <Typography fontSize={"14px"}>Bank name :</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>FLEXY COMMERCIAL BROKER LLC</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>019101640913</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>AE780330000019101640913</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>BOMLAEAD</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>Mashreq Bank PSC, P.O.Box 1250, Dubai, UAE</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>Mashreq Bank</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Stack>
    );
}

export default BankDepositDetails;