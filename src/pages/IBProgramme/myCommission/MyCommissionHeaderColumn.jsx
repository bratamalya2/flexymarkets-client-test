import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';

const columnHelper = createMRTColumnHelper();

export const MyCommissionHeaderColumn = [
    // columnHelper.accessor('id', {
    //     header: 'ID',
    //     size: 40,
    // }),
    // columnHelper.accessor('userId', {
    //     header: 'User ID',
    //     size: 100,
    // }),
    columnHelper.accessor('loginId', {
        header: 'MT5 Login ID',
        size: 100,
    }),
    columnHelper.display({
        id: "PositionID",
        header: 'Position ID',
        Cell: ({ row }) => (
            <Typography>
                {row?.original?.orderDetails?.PositionID}
            </Typography>
        ),
        size: 100,
    }),
    columnHelper.display({
        id: "name",
        header: 'From User',
        Cell: ({ row }) => (
            <Typography>
                {row?.original?.fromUserDetails?.name}
            </Typography>
        ),
        size: 100,
    }),
    // columnHelper.accessor('ibId', {
    //     header: 'Ib ID',
    //     size: 120,
    // }),
    // columnHelper.accessor("orderId", {
    //     header: 'Order ID',
    //     // size: 100,
    // }),
    columnHelper.accessor('symbol', {
        header: 'Symbol',
        size: 100,
    }),
    columnHelper.display({
        id: "action",
        header: 'Action',
        Cell: ({ row }) => (
            <Typography sx={{ color: row?.original?.orderDetails?.Action == 1 ? "green" : "red" }}>
                {row?.original?.orderDetails?.Action == 1 ? "Buy" : "Sell"}
            </Typography>
        ),
        size: 100,
    }),
    columnHelper.display({
        id: "price",
        header: 'Price',
        Cell: ({ row }) => (
            <Typography>
                {row?.original?.orderDetails?.Price}
            </Typography>
        ),
        size: 100,
    }),
    columnHelper.display({
        id: "ProfitRaw",
        header: 'Profit',
        Cell: ({ row }) => (
            <Typography>
                {row?.original?.orderDetails?.ProfitRaw}
            </Typography>
        ),
        size: 100,
    }),
    columnHelper.display({
        id: "volume",
        header: 'Volume',
        Cell: ({ row }) => (
            <Typography>
                {row?.original?.orderDetails?.Volume / 10000}
            </Typography>
        ),
        size: 100,
    }),
    columnHelper.accessor('comissionAmount', {
        header: 'Comission amount',
        size: 100,
        Cell: ({ row }) => {

            const commissionAmt = row?.original?.comissionAmount

            return Number(commissionAmt || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
            })
        }
    }),
    // columnHelper.accessor('type', {
    //     header: 'Type',
    //     // size: 100,
    // }),
    columnHelper.display({
        id: "level",
        header: 'Level',
        Cell: ({ row }) => (
            <Typography>
                {row?.original?.orderDetails?.level}
            </Typography>
        ),
        size: 100,
    }),
    columnHelper.accessor('TimeCreate', {
        header: 'Created AT',
        size: 200,
        Cell: ({ row }) => {
            const timestamp = row.original.orderDetails.Time;
            const date = new Date(timestamp * 1000);

            const formattedDateTime = date.toLocaleString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).replace(',', '');

            return (
                <Typography>
                    {formattedDateTime}
                </Typography>
            );
        },
    }),
];