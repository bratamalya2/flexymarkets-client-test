import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Container, Stack, TextField, Typography, Button, useMediaQuery } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SearchableDropdown from '../../../components/SearchableDropdown';

const data = [
  {
    loginId: '1001',
    date: '2024-02-01',
    ticket: '123456',
    symbol: 'EUR/USD',
    openPrice: 1.1025,
    profit: 37.50,
    expertPositionId: 'EP001',
    comment: 'Opened manually',
    action: 'Close',
  },
  {
    loginId: '1002',
    date: '2024-02-15',
    ticket: '123457',
    symbol: 'GBP/USD',
    openPrice: 1.3050,
    profit: 140.00,
    expertPositionId: 'EP002',
    comment: 'Strategy trade',
    action: 'Close',
  },
  {
    loginId: '1003',
    date: '2024-02-10',
    ticket: '123458',
    symbol: 'USD/JPY',
    openPrice: 150.25,
    profit: 55.00,
    expertPositionId: 'EP003',
    comment: 'Auto trade',
    action: 'Close',
  },
];

function DealReport() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);


  const matches = useMediaQuery('(min-width:820px)');
  const calanderResponsive = useMediaQuery('(min-width:450px)');


  const filteredData = useMemo(() => {
    if (!fromDate || !toDate) return data;
    return data.filter((row) =>
      dayjs(row.date).isAfter(dayjs(fromDate).subtract(1, 'day')) &&
      dayjs(row.date).isBefore(dayjs(toDate).add(1, 'day'))
    );
  }, [fromDate, toDate]);

  const columns = useMemo(
    () => [
      { accessorKey: 'loginId', header: 'Login', size: 120 },
      { accessorKey: 'date', header: 'Date', size: 150 },
      { accessorKey: 'ticket', header: 'Order', size: 120 },
      { accessorKey: 'symbol', header: 'Symbol', size: 100 },
      { accessorKey: 'openPrice', header: 'Price', size: 120 },
      { accessorKey: 'profit', header: 'Profit', size: 120 },
      { accessorKey: 'expertPositionId', header: 'ExpertPosition ID', size: 150 },
      { accessorKey: 'comment', header: 'Comment', size: 200 },
      {
        accessorKey: 'action',
        header: 'Action',
        size: 100,
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="error"
            size="small"
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
    data: filteredData,
  });

  return (
    <Container>
      <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>Deal Report</Typography>
      <Box mb={"2rem"} sx={{ display: "flex", flexDirection: matches ? "row" : "column", justifyContent: "space-between", gap: matches ? "0" : "1rem" }}>
        <SearchableDropdown options={[]} placeholder="Select Account" width={calanderResponsive ? "250px" : "100%"} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", gap: calanderResponsive ? "2rem" : "1rem", flexDirection: calanderResponsive ? "row" : "column" }}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
          </Box>
        </LocalizationProvider>
      </Box>
      <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
        <MaterialReactTable table={table} />
      </Stack>
    </Container>
  );
};

export default DealReport;