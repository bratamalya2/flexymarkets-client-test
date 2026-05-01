import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';

const columnHelper = createMRTColumnHelper();

export const MT5RequestHeaderColumn = [
    columnHelper.accessor('Login', {
        header: 'MT5 Log in'
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        Cell: ({ row }) => {
            const value = row.original.status
            return <Typography sx={{ color: value == "APPROVED" ? "green" : "red" }}>{value}</Typography>
        },
    }),
    columnHelper.accessor('group', {
        header: 'Account type',
        Cell: ({ row }) => {
            const value = row.original.group.name
            return <Typography>{value}</Typography>
        },
    }),
    columnHelper.accessor('Leverage', {
        header: 'Leverage',
    }),
    // columnHelper.accessor('Balance', {
    //     header: 'Balance',
    // }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        Cell: ({ row }) => (
            <Typography>
                {new Date(row.original.createdAt).toLocaleString()}
            </Typography>
        ),
    })
];