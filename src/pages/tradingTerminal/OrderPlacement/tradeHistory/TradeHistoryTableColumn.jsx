import { createMRTColumnHelper } from 'material-react-table';
import { Typography, Stack, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCloseOrderMutation } from '../../../../globalState/trade/tradeApis';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useDispatch, useSelector } from 'react-redux';

const columnHelper = createMRTColumnHelper();

export const TradeHistoryTableColumn = [
    columnHelper.accessor('Position', {
        header: 'Position',
        // size: 40,
    }),
    columnHelper.accessor('Login', {
        header: 'Log in',
        // size: 40,
    }),
    columnHelper.accessor('Symbol', {
        header: 'Symbol',
        // size: 100,
    }),
    columnHelper.accessor('Action', {
        header: 'Action',
        // size: 100,
        Cell: ({ row }) => {
            const value = row?.original?.Action;
            return <Typography sx={{ color: value == 1 ? "red" : "green" }}>{value == 1 ? "Sell" : "Buy"}</Typography>
        },
    }),
    columnHelper.accessor('PriceOpen', {
        header: 'Open price',
        // size: 100,
    }),
    columnHelper.accessor('PriceCurrent', {
        header: 'Current price',
        // size: 100,
    }),
    columnHelper.accessor('PriceSL', {
        header: 'SL price',
        // size: 100,
    }),
    columnHelper.accessor('PriceTP', {
        header: 'TP price',
        // size: 100,
    }),
    columnHelper.accessor('Volume', {
        header: 'Volume',
        // size: 100,
        Cell: ({ row }) => {
            const value = row?.original?.Volume;
            return <Typography>{value / 10000}</Typography>
        },
    }),
    columnHelper.accessor('Profit', {
        header: 'Profit',
        // size: 100,
    }),
    columnHelper.accessor('TimeCreate', {
        header: 'Created AT',
        // size: 200,
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
    columnHelper.display({
        header: 'Close trade',
        Cell: ({ row }) => {

            const symbol = row?.original?.Symbol
            const dispatch = useDispatch()
            const data = {
                symbol: symbol,
                volume: row?.original?.Volume,
                typeFill: "1",
                type: (row?.original?.Action === 1 || row?.original?.Action === "1") ? "0" : "1",
                login: row?.original?.Login,
                position: row?.original?.Position
            }

            const [closeOrder, { isLoading }] = useCloseOrderMutation()

            const onSubmit = async (data) => {

                try {
                    const response = await closeOrder(data).unwrap();
                    if (response?.status) {
                        dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                    }
                } catch (error) {
                    if (!error?.data?.status) {
                        dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
                    }
                }
            };

            return (
                <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                    <IconButton onClick={() => onSubmit(data)} disabled={isLoading}>
                        <Tooltip title="Close order" placement='right'>
                            <CloseIcon />
                        </Tooltip>
                    </IconButton>
                </Stack>
            )
        },
        size: 100,
    }),
];