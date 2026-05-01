import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button, Container, Typography, Stack, useMediaQuery } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { data } from "./walletHistoryData";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';


const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 40,
  }),
  columnHelper.accessor('method', {
    header: 'Method',
    size: 150,
  }),
  columnHelper.accessor('toDeposit', {
    header: 'To Deposit',
    size: 150,
  }),
  columnHelper.accessor('amountUSD', {
    header: 'Amount IN USD',
    size: 120,
  }),
  columnHelper.accessor('note', {
    header: 'Note',
    size: 200,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    size: 150,
  })
];




function WalletHistory() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const calanderResponsive = useMediaQuery('(min-width:450px)');


  const filteredData = useMemo(() => {
    if (!fromDate || !toDate) return data;
    return data.filter((row) =>
      dayjs(row.date, 'YYYY-MM-DD').isAfter(dayjs(fromDate).subtract(1, 'day')) &&
      dayjs(row.date, 'YYYY-MM-DD').isBefore(dayjs(toDate).add(1, 'day'))
    );
  }, [fromDate, toDate, data]);


  const handleExportToExcel = useCallback((rows) => {
    const rowData = rows.map((row) => row.original);
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'wallet_history.xlsx');
  }, []);


  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
        <Button
          onClick={() => handleExportToExcel(filteredData)}
          startIcon={<FileDownloadIcon />}
          sx={{ color: "primary.main" }}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportToExcel(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          sx={{ color: "primary.main" }}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportToExcel(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          sx={{ color: "primary.main" }}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onClick={() => handleExportToExcel(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          sx={{ color: "primary.main" }}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return (
    <Container>
      <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>
        Wallet History
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: calanderResponsive ? "2rem" : "1rem", flexDirection: calanderResponsive ? "row" : "column" }}>
          <Box>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
          </Box>
          <Box>
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
          </Box>
        </Box>
      </LocalizationProvider>
      <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
        {filteredData.length === 0 ? (
          <Typography textAlign="center" sx={{ py: 4 }}>
            No data available for the selected date range.
          </Typography>
        ) : (
          <MaterialReactTable table={table} />
        )}
      </Stack>
    </Container>
  );
};

export default WalletHistory;