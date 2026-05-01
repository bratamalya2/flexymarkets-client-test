import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Container, Stack, Typography, Button } from '@mui/material';


const data = [
    {
        serialNo: '001',
        mt5Id: 'MT5001',
        accountType: 'Standard',
        name: 'John Doe',
        date: '2024-02-27',
        action: 'View',
    },
    {
        serialNo: '002',
        mt5Id: 'MT5002',
        accountType: 'Premium',
        name: 'Jane Smith',
        date: '2024-02-26',
        action: 'View',
    }
];

function AccountList() {
    // Memoize columns for performance
    const columns = useMemo(
        () => [
            { accessorKey: 'serialNo', header: 'Serial No.', size: 100 },
            { accessorKey: 'mt5Id', header: 'MT5 ID', size: 150 },
            { accessorKey: 'accountType', header: 'Account Type', size: 150 },
            { accessorKey: 'name', header: 'Name', size: 200 },
            { accessorKey: 'date', header: 'Date', size: 150 },
            {
                accessorKey: 'action',
                header: 'Action',
                size: 150,
                Cell: ({ row }) => (
                    <Button
                        variant='contained'
                        sx={{
                            textTransform: "capitalize",
                            width: "5rem",
                            boxShadow: "none",
                            color: "white",
                            "&:hover": {
                                boxShadow: "none"
                            }
                        }}
                    >
                        {row.original.action}
                    </Button>
                ),
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data,
    });

    return (
        <Container sx={{ mt: '2rem' }}>
            <Typography variant='h5' fontWeight={'700'} fontSize={'1.5rem'} mb={'1.2rem'}>
                Account List
            </Typography>
            <Stack sx={{ borderRadius: '1.2rem', overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Container>
    );
}

export default AccountList;
