import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Stack } from '@mui/material';
import { IBCommissionListColumnHeader } from './IBCommissionListColumnHeader';
import { useMemo } from 'react';

function IBCommissionList({ data, isError, showError, loading, handleDataToEdit, pagination, setPagination, globalFilter, setGlobalFilter }) {

    const columns = useMemo(() => IBCommissionListColumnHeader(handleDataToEdit), []);
    const listData = useMemo(() => data?.ibPlanList, [data?.ibPlanList]);
    const rowCount = useMemo(() => data?.totalRecords || 0, [data]);

    const table = useMaterialReactTable({
        columns,
        data: listData,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        rowCount: rowCount,
        state: {
            pagination,
            globalFilter,
            loading,
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
                children: showError || 'Error loading Commission List.',
            }
            : undefined,
    });


    return (
        <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
            <MaterialReactTable table={table} />
        </Stack>
    )
};

export default IBCommissionList;