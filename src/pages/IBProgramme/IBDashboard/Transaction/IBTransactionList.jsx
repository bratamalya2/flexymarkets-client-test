import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Stack } from '@mui/material';
import { IBTransactionListColumnHeader } from './IBTransactionListColumnHeader';
import { useMemo } from 'react';

function IBTransactionList({ data, isError, showError, loading, pagination, setPagination, globalFilter, setGlobalFilter }) {

    const columns = useMemo(() => IBTransactionListColumnHeader(), []);
    const listData = useMemo(() => data?.trxList || [], [data?.trxList]);
    const rowCount = useMemo(() => data?.totalRecords || 0, [data]);

    const table = useMaterialReactTable({
        columns,
        data: listData,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        enableGlobalFilter: true, // Enable built-in search
        rowCount: rowCount,
        initialState: {
            density: 'compact',
            showGlobalFilter: true, // Show search bar in toolbar
        },
        state: {
            pagination,
            globalFilter: globalFilter || '',
            isLoading: loading,
            showAlertBanner: isError,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: showError || 'Error loading Transaction List.',
            }
            : undefined,
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 600,
                backgroundColor: 'background.paper',
            },
        },
    });

    return (
        <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
            <MaterialReactTable table={table} />
        </Stack>
    )
};

export default IBTransactionList;