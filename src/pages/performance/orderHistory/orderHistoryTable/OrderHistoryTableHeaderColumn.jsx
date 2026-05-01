import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';

const columnHelper = createMRTColumnHelper();

export const OrderHistoryTableHeaderColumn = (activeTab) => {

    const columns = activeTab == "Open positions"
        ?
        [
            columnHelper.accessor('Position', {
                header: 'Position',
                size: 40,
            }),
            columnHelper.accessor('Login', {
                header: 'Log in',
                size: 40,
            }),
            columnHelper.accessor('Symbol', {
                header: 'Symbol',
                size: 100,
            }),
            columnHelper.accessor('Action', {
                header: 'Action',
                size: 100,
                Cell: ({ row }) => {
                    const value = row?.original?.Action;
                    return <Typography sx={{ color: value == 1 ? "red" : "green" }}>{value == 1 ? "Sell" : "Buy"}</Typography>
                },
            }),
            columnHelper.accessor('PriceOpen', {
                header: 'Open price',
                size: 100,
            }),
            columnHelper.accessor('PriceCurrent', {
                header: 'Current price',
                size: 100,
            }),
            columnHelper.accessor('PriceSL', {
                header: 'SL price',
                size: 100,
            }),
            columnHelper.accessor('PriceTP', {
                header: 'TP price',
                size: 100,
            }),
            columnHelper.accessor('Volume', {
                header: 'Volume',
                size: 100,
                Cell: ({ row }) => {
                    const value = row?.original?.Volume;
                    return <Typography>{value / 10000}</Typography>
                },
            }),
            columnHelper.accessor('Profit', {
                header: 'Profit',
                size: 100,
            }),
            columnHelper.accessor('TimeCreate', {
                header: 'Created AT',
                size: 200,
                Cell: ({ row }) => {
                    const timestamp = row.original.TimeCreate;
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
        ]
        :
        [
            columnHelper.accessor('Order', {
                header: 'Order',
                size: 40,
            }),
            columnHelper.accessor('Login', {
                header: 'Log in',
                size: 40,
            }),
            columnHelper.accessor('Symbol', {
                header: 'Symbol',
                size: 100,
            }),
            columnHelper.accessor('Price', {
                header: 'Price',
                size: 100,
            }),
            columnHelper.accessor('Volume', {
                header: 'Volume',
                size: 100,
                Cell: ({ row }) => {

                    const volume = row?.original?.Volume
                    return <Typography>{volume / 10000}</Typography>

                }
            }),
            columnHelper.accessor('Profit', {
                header: 'Profit',
                size: 100,
            }),
            columnHelper.accessor('Action', {
                header: 'Action',
                size: 100,
                Cell: ({ row }) => {
                    const value = row?.original?.Action;
                    return <Typography sx={{ color: value == 1 ? "green" : "red" }}>{value == 1 ? "Buy" : "Sell"}</Typography>
                },
            }),
            // columnHelper.accessor('PriceOrder', {
            //     header: 'Open price',
            //     size: 100,
            // }),
            // columnHelper.accessor('PriceCurrent', {
            //     header: 'Current price',
            //     size: 100,
            // }),
            columnHelper.accessor('PriceSL', {
                header: 'SL price',
                size: 100,
            }),
            columnHelper.accessor('PriceTP', {
                header: 'TP price',
                size: 100,
            }),
            columnHelper.accessor('Time', {
                header: 'Closed AT',
                size: 200,
                Cell: ({ row }) => {
                    const timestamp = row.original.Time;
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
        ]
    return columns
}