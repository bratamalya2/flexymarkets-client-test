import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';

const columnHelper = createMRTColumnHelper();

export const BotListHeaderColumn = [
    columnHelper.accessor('botName', {
        header: 'Bot Name'
    }),
    columnHelper.accessor('description', {
        header: 'Description'
    }),
    columnHelper.accessor('expectedReturn', {
        header: 'Expected Return'
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        Cell: ({ row }) => (
            <Typography sx={{ color: row.original.status == "ACTIVE" ? "green" : "red" }}>{row.original.status}</Typography>
        ),
    }),
    columnHelper.accessor('minimumRequiredBalance', {
        header: 'Minimum Required Balance',
    }),
    // columnHelper.accessor('createdAt', {
    //     header: 'created At',
    //     Cell: ({ row }) => (
    //         <Typography>
    //             {new Date(row.original.createdAt).toLocaleString()}
    //         </Typography>
    //     ),
    // })
];