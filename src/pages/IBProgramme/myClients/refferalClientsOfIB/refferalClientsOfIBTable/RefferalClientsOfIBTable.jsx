import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Box,
    Button,
    Container,
    Typography,
    Stack
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { RefferalClientsOfIBTableColumnHeader } from './RefferalClientsOfIBTableColumnHeader';
import { useGetReferralListQuery } from '../../../../../globalState/userState/userStateApis';
import { handleExportToExcel } from '../../../../../utils/exportToExcel';
import { useState, useMemo } from 'react';

function RefferalClientsOfIBTable() {
    const [globalFilter, setGlobalFilter] = useState("");
    const { data: listData, isLoading, isError } = useGetReferralListQuery();

    const referralListData = listData?.data?.userList || [];

    const filteredData = useMemo(() => {
        return referralListData.filter(item =>
            item?.name?.toLowerCase()?.includes(globalFilter?.toLowerCase())
        );
    }, [referralListData, globalFilter]);

    const handleDownloadExcel = () => {
        handleExportToExcel(referralListData, "ReferralClient.xlsx");
    };

    const table = useMaterialReactTable({
        columns: RefferalClientsOfIBTableColumnHeader,
        data: globalFilter ? filteredData : referralListData,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        state: {
            globalFilter,
            isLoading,
            showAlertBanner: isError,
        },
        columnFilterDisplayMode: "popover",
        onGlobalFilterChange: setGlobalFilter,
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: 2, padding: 1, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    onClick={handleDownloadExcel}
                    startIcon={<FileDownloadIcon sx={{ color: "white" }} />}
                    sx={{
                        textTransform: 'none',
                        color: 'white',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                    }}
                >
                    Excel
                </Button>
            </Box>
        ),
    });

    return (
        <Stack>
            <Stack sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Stack>
    );
}

export default RefferalClientsOfIBTable;