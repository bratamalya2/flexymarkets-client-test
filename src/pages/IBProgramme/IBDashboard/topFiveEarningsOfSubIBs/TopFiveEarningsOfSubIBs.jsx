import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Box, Button, Container, Typography, Stack, InputLabel } from '@mui/material';
import Selector from "../../../../components/Selector"
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TopFiveEarningsOfSubIBsColumnHeader } from './TopFiveEarningsOfSubIBsColumnHeader';


const STATUS_OPTIONS = ["PENDING", "COMPLETED", "PROCESSING", "REJECTED"];
const TRANSACTION_TYPES = ["CLIENT-DEPOSIT", "CLIENT-WITHDRAW", "WALLET-DEPOSIT", "WALLET-WITHDRAW", "IB-WITHDRAW", "INTERNAL-TRANSFER", "CREDIT-DEPOSIT", "BONUS-DEPOSIT", "CREDIT-WITHDRAW", "BONUS-WITHDRAW"];
const PAYMENT_METHODS = ["BANK", "CASH", "CRYPTO"];

const handleExportToExcel = (rows) => {
    const rowData = rows.map((row) => row.original || row);
    if (!rowData.length) {
        alert("No data to export.");
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'transactionList.xlsx');
};

function TopFiveEarningsOfSubIBs() {

    const { selectedTheme } = useSelector((state) => state.themeMode);

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        transactionType: "",
        paymentMethod: "",
        fromDate: null,
        toDate: null,
    });

    const formattedFromDate = filters.fromDate ? dayjs(filters.fromDate).format('YYYY-MM-DD') : undefined;
    const formattedToDate = filters.toDate ? dayjs(filters.toDate).format('YYYY-MM-DD') : undefined;

    // const { data: listData, isLoading, isError, error } = useTransactionListQuery({
    //     page: pagination.pageIndex + 1,
    //     sizePerPage: pagination.pageSize,
    //     search: globalFilter,
    //     ...filters,
    //     fromDate: formattedFromDate,
    //     toDate: formattedToDate,
    // });

    // const showError = error?.data?.message

    // const list = listData?.data?.usersList || [];
    // const data = useMemo(() => list, [list]);

    const table = useMaterialReactTable({
        columns: TopFiveEarningsOfSubIBsColumnHeader,
        data: [],
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        // rowCount: listData?.data?.totalRecords || 0,
        // state: {
        //     pagination,
        //     globalFilter,
        //     isLoading,
        //     showAlertBanner: isError,
        // },
        // onPaginationChange: setPagination,
        // onGlobalFilterChange: setGlobalFilter,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        // muiToolbarAlertBannerProps: isError
        //     ? {
        //         color: 'error',
        //         children: showError || 'Error loading transactions.',
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
        //             onClick={() => handleExportToExcel(list)}
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
        <Stack sx={{ mt: "2.5rem" }}>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"}>Top Five Earnings Of Sub IBs</Typography>
            <Stack sx={{ marginTop: '2rem', borderRadius: '10px', overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Stack>
    )
};

export default TopFiveEarningsOfSubIBs;