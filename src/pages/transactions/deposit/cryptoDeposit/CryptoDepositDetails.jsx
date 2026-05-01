import { Box, Divider, Stack, Typography } from "@mui/material";


// const depositDetails = [
//     {
//         name: "Payment method",
//         icon: "",
//         value: "BinancePay"
//     },
//     {
//         name: "Amount",
//         value: "100.00 USD"
//     },
//     {
//         name: "Commission",
//         value: "No commission"
//     },
//     {
//         name: "To account",
//         image: "/MT5Icon.svg",
//         value: "108783907"
//     }
// ]

function CryptoDepositDetails({ amount, network, mt5Account }) {

    const depositDetails = [
        {
            name: "Payment method",
            icon: "",
            value: network
        },
        {
            name: "Amount",
            value: `${amount} USD`
        },
        {
            name: "Commission",
            value: "No commission"
        },
        {
            name: "To account",
            image: "/MT5Icon.svg",
            value: mt5Account
        }
    ]

    return (
        <Stack sx={{ gap: "1rem" }}>
            {
                depositDetails.map((item, i) => (
                    <>
                        <Box key={i} sx={{ display: "flex", justifyContent: 'space-between' }}>
                            <Typography>{item.name}</Typography>
                            <Typography fontWeight={"bold"}>{item.value}</Typography>
                        </Box>
                        <Divider />
                    </>
                ))
            }
        </Stack>
    )
}

export default CryptoDepositDetails;