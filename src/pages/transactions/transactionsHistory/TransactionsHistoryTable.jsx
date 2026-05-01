import { Stack, Typography, Button } from "@mui/material"
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

function TransactionsHistoryTable() {

    return (
        <Stack sx={{ justifyContent: "center", alignItems: "center", height: "calc(100vh - 300px)" }}>
            <FolderOutlinedIcon sx={{ fontSize: "3rem", color: "primary.main" }} />
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.5rem"} textAlign={"center"}>There are currently no transactions</Typography>
            <Typography color="#6c8595" textAlign={"center"}>Your deposits and withdrawals will appear here</Typography>
            <Button
                variant='contained'
                sx={{
                    textTransform: "capitalize",
                    width: "5rem",
                    boxShadow: "none",
                    color: "white",
                    mt: '1.5rem',
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Deposit</Button>
        </Stack>
    )
}

export default TransactionsHistoryTable