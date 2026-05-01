import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';

const columnHelper = createMRTColumnHelper();

export const MT5AccountListColumnHeader = [
    columnHelper.accessor('Login', {
        header: 'MT5 Log in'
    }),
    // columnHelper.accessor('FirstName', {
    //     header: 'Name'
    // }),
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