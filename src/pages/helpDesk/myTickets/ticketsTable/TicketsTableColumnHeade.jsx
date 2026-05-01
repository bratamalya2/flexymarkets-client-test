import { createMRTColumnHelper } from 'material-react-table';
import { Dialog, Stack, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DialogBox from '../../../../components/DialogBox';

const columnHelper = createMRTColumnHelper();

export const TicketsTableColumnHeade = [
    columnHelper.accessor('subject', {
        header: 'Subject'
    }),
    // columnHelper.accessor('Description', {
    //     header: 'Description',
    //     Cell: ({ row }) => {
    //         const description = row.original.message?.[0]?.text;
    //         return (
    //             <Typography fontSize="14px">
    //                 {description || <em>No description</em>}
    //             </Typography>
    //         );
    //     },
    // }),
    columnHelper.accessor('status', {
        header: 'Status'
    }),
    columnHelper.accessor('priority', {
        header: 'Priority',
    }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        Cell: ({ row }) => (
            <Typography>
                {new Date(row.original.createdAt).toLocaleString()}
            </Typography>
        ),
    }),
    columnHelper.display({
        header: 'Action',
        Cell: ({ row }) => {
            const ticketId = row?.original?.id
            const ticketStatus = row?.original?.status !== "CLOSED"
            return (
                <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                    <Button
                        variant='contained'
                        component={Link}
                        to="/client/helpDesk/showTicket"
                        state={{ ticketId }}
                        size='small'
                        sx={{
                            textTransform: "capitalize",
                            boxShadow: "none",
                            color: "white",
                            "&:hover": {
                                boxShadow: "none"
                            }
                        }}
                    >View</Button>
                    {ticketStatus && <DialogBox
                        ticketId={ticketId}
                        btnName={"Close"}
                        btnSx={{
                            textTransform: "capitalize",
                            boxShadow: "none",
                            color: "white",
                            "&:hover": {
                                boxShadow: "none"
                            }
                        }}
                    />}
                </Stack>
            )
        },
        size: 100,
    }),
];