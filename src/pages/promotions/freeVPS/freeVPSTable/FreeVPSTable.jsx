import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
// import { handleExportToExcel } from '../../utils/exportToExcel';\
import { FreeVPSTableHeaderColumn } from './FreeVPSTableHeaderColumn.jsx';

function FreeVPSTable() {

    // const dispatch = useDispatch()

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // const { data: listData, isLoading, isError, error } = useMt5AccountListQuery({
    //     page: pagination.pageIndex + 1,
    //     sizePerPage: pagination.pageSize
    // });

    // const showError = error?.data?.message

    // const list = listData?.data?.mt5AccountList || [];

    const columns = useMemo(() => FreeVPSTableHeaderColumn, []);

    // const handleDownloadExcel = () => {
    //     handleExportToExcel(list, "MT5AccountList.xlsx", dispatch);
    // };

    // const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);
    // const data = useMemo(() => list, [list]);

    const table = useMaterialReactTable({
        columns: columns,
        data: [],
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        // rowCount: rowCount,
        state: {
            pagination,
            // isLoading,
            // showAlertBanner: isError,
        },
        onPaginationChange: setPagination,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        // muiToolbarAlertBannerProps: isError
        //     ? {
        //         color: 'error',
        //         children: showError || 'Error loading MT5 account.',
        //     }
        //     : undefined,
        // renderTopToolbarCustomActions: () => (
        //     <Box
        //         sx={{
        //             display: 'flex',
        //             gap: '16px',
        //             padding: '8px',
        //             flexWrap: 'wrap',
        //         }}
        //     >
        //         <Button
        //             variant="contained"
        //             onClick={handleDownloadExcel}
        //             startIcon={<FileDownloadIcon sx={{ color: "white" }} />}
        //             sx={{
        //                 textTransform: 'none',
        //                 color: "white",
        //                 boxShadow: "none",
        //                 "&:hover": { boxShadow: "none" },
        //             }}
        //         >
        //             Excel
        //         </Button>
        //     </Box>
        // ),
    });

    return (
        <Stack sx={{ marginTop: '2rem', borderRadius: '10px', overflow: 'hidden' }}>
            <MaterialReactTable table={table} />
        </Stack>
    )
};

export default FreeVPSTable;