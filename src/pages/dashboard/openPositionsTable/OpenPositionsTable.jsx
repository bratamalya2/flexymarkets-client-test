import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Stack, Typography } from '@mui/material';

function OpenPositionsTable() {

  const columns = useMemo(() => [
    { accessorKey: 'loginId', header: 'Login ID', size: 120 },
    { accessorKey: 'symbol', header: 'Symbol', size: 100 },
    { accessorKey: 'ticket', header: 'Ticket', size: 120 },
    { accessorKey: 'date', header: 'Date', size: 150 },
    { accessorKey: 'type', header: 'Type', size: 100 },
    { accessorKey: 'openPrice', header: 'Open Price', size: 120 },
    { accessorKey: 'volume', header: 'Volume', size: 100 },
    { accessorKey: 'sl', header: 'S/L', size: 100 },
    { accessorKey: 'tp', header: 'T/P', size: 100 },
    { accessorKey: 'currentPrice', header: 'Current Price', size: 120 },
    { accessorKey: 'profit', header: 'Profit', size: 120 },
  ], []);

  const data = useMemo(() => [
    {
      loginId: '1001',
      symbol: 'EUR/USD',
      ticket: '123456',
      date: '2024-02-27',
      type: 'Buy',
      openPrice: 1.1025,
      volume: 1.5,
      sl: 1.1000,
      tp: 1.1100,
      currentPrice: 1.1050,
      profit: 37.50,
    },
    // More data...
  ], []);

  const table = useMaterialReactTable({
    columns,
    data
  });

  return (
    <Box mt={"2rem"}>
      <Typography variant='h5' fontWeight={"700"} fontSize={"1.5rem"} mb={"1.2rem"}>
        Open Positions
      </Typography>
      <Stack sx={{ borderRadius: '1.2rem', overflow: 'hidden' }}>
        <MaterialReactTable table={table} />
      </Stack>
    </Box>
  );
}

export default OpenPositionsTable;