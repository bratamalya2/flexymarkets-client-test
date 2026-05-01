import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';

const columnHelper = createMRTColumnHelper();

export const FullDepositBonusTableHeaderColumn = [
    columnHelper.accessor('Login', {
        header: 'Deposit Date'
    }),
    columnHelper.accessor('group', {
        header: 'Trading Account',
        Cell: ({ row }) => {
            const value = row.original.group.name
            return <Typography>{value}</Typography>
        },
    }),
    columnHelper.accessor('Leverage', {
        header: 'Deposit Amount',
    }),
    columnHelper.accessor('Balance', {
        header: 'Bonus (%)',
    }),
    columnHelper.accessor('Balance', {
        header: 'Credit Bonus Amount',
    }),
    columnHelper.accessor('Balance', {
        header: 'Action',
    }),
    // columnHelper.accessor('createdAt', {
    //     header: 'Date',
    //     Cell: ({ row }) => (
    //         <Typography>
    //             {new Date(row.original.createdAt).toLocaleString()}
    //         </Typography>
    //     ),
    // })
];