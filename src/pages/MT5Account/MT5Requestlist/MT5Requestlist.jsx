import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MT5RequestHeaderColumn } from './MT5RequestHeaderColumn';
import { handleExportToExcel } from '../../../utils/exportToExcel';
import { useMt5RequestListQuery } from '../../../globalState/mt5State/mt5StateApis';

function MT5Requestlist() {

    const dispatch = useDispatch()

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { data: listData, isLoading, isError, error } = useMt5RequestListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize
    });

    const showError = error?.data?.message

    const list = listData?.data?.requestedMt5AccountList || [];

    const columns = useMemo(() => MT5RequestHeaderColumn, []);

    const handleDownloadExcel = () => {
        handleExportToExcel(list, "MT5RequestList.xlsx", dispatch);
    };

    const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);
    const data = useMemo(() => list, [list]);

    const table = useMaterialReactTable({
        columns: columns,
        data: isError ? [] : data,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        rowCount: rowCount,
        state: {
            pagination,
            isLoading,
            showAlertBanner: isError,
        },
        onPaginationChange: setPagination,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: showError || 'Error loading MT5 account.',
            }
            : undefined,
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleDownloadExcel}
                    startIcon={<FileDownloadIcon sx={{ color: "white" }} />}
                    sx={{
                        textTransform: 'none',
                        color: "white",
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    Excel
                </Button>
            </Box>
        ),
    });

    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>MT5 request list</Typography>
            <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Container>
    )
};

export default MT5Requestlist;