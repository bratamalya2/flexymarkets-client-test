import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const columnHelper = createMRTColumnHelper();

export const MT5AccountListColumnHeader = [
    columnHelper.accessor('Login', {
        header: 'MT5 Log in',
        Cell: ({ row }) => {
            const value = row.original.Login
            return <Typography
                component={Link}
                to={`/client/MT5AccountsDetails/MT5AccountAction/${value}`}
                state={row.original}
                sx={{ textDecoration: "underline" }}
            >{value}</Typography>
        },
    }),
    columnHelper.accessor('accountType', {
        header: 'Account type',
    }),
    columnHelper.display({
        id: "group",
        header: 'Group',
        Cell: ({ row }) => {
            const value = row.original.group.name
            return <Typography>{value}</Typography>
        },
    }),
    columnHelper.accessor('Leverage', {
        header: 'Leverage',
    }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        Cell: ({ row }) => (
            <Typography>
                {new Date(row.original.createdAt).toLocaleString()}
            </Typography>
        ),
    })
];