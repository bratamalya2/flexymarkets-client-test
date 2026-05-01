import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Typography, Stack } from '@mui/material';
import { useState } from 'react';
import { QuotesTableHeaderColumn } from './QuotesTableHeaderColumn';


function QuotesTable({ data }) {

    const [globalFilter, setGlobalFilter] = useState("");

    const filteredData = globalFilter ? data?.filter(item => (item.Symbol).toUpperCase() === globalFilter.toUpperCase()) : data

    const table = useMaterialReactTable({
        columns: QuotesTableHeaderColumn || [],
        data: Array.isArray(filteredData) ? filteredData : [],
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        // manualPagination: true,
        // manualFiltering: true,
        rowCount: data && data.length || 0,
        state: {
            // pagination,
            globalFilter,
            isLoading: !data,
            // showAlertBanner: isError,
        },
        initialState: {
            showGlobalFilter: true,
        },
        // enablePagination: false,
        // onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
    });

    return (
        <Stack mt={"2rem"}>
            <Typography variant='h6' fontWeight={"700"} fontSize={"1.8rem"}>Quotes Table</Typography>
            <Stack sx={{ marginTop: '1.2rem', borderRadius: '10px', overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Stack>
    )
};

export default QuotesTable;