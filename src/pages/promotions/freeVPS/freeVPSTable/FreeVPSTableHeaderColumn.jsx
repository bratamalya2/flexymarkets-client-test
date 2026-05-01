import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';

const columnHelper = createMRTColumnHelper();

export const FreeVPSTableHeaderColumn = [
    columnHelper.accessor('Login', {
        header: 'Submission Date'
    }),
    columnHelper.accessor('group', {
        header: 'Invoice Start Date',
        Cell: ({ row }) => {
            const value = row.original.group.name
            return <Typography>{value}</Typography>
        },
    }),
    columnHelper.accessor('Leverage', {
        header: 'Status',
    }),
    columnHelper.accessor('Balance', {
        header: 'Remarks',
    }),
    // columnHelper.accessor('Balance', {
    //     header: 'Credit Bonus Amount',
    // }),
    // columnHelper.accessor('Balance', {
    //     header: 'Action',
    // }),
    // columnHelper.accessor('createdAt', {
    //     header: 'Date',
    //     Cell: ({ row }) => (
    //         <Typography>
    //             {new Date(row.original.createdAt).toLocaleString()}
    //         </Typography>
    //     ),
    // })
];