import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const data = [
    {
        name: "Net profit",
        total: "0",
        icon: InfoOutlinedIcon,
        info: "Total profit after losses are accounted, for the chosen time frame. Updated on: 03/17/2025, 09:14 AM (UTC).",
        amount: true,
        contribution: {
            Profit: "0 USD",
            Loss: "0 USD",
            "Unrealised P/L": "0 USD"
        }
    },
    {
        name: "Closed orders",
        total: "0",
        icon: InfoOutlinedIcon,
        info: "Number of closed orders within the selected time period. Updated on: 03/17/2025, 09:14 AM (UTC).",
        amount: false,
        contribution: {
            Profitable: 0,
            Unprofitable: 0
        }
    },
    {
        name: "Trading volume",
        total: "0",
        icon: InfoOutlinedIcon,
        info: "Total trading volume of assets traded during the selected time period. Updated on: 03/17/2025, 09:14 AM (UTC).",
        amount: true,
        contribution: {
            Lifetime: "0 USD"
        }
    },
    {
        name: "Equity",
        total: "0",
        icon: InfoOutlinedIcon,
        info: "Changes in equity during the chosen time frame. Updated on: 03/17/2025, 09:20 AM (UTC).",
        amount: true,
        contribution: {
            Current: "0 USD"
        }
    }
]