import { useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { TradeTableConfig } from './TradeTableConfig';
import useDynamicQuery from '../../../../hooks/useDynamicQuery';
import TabComponent from "../../../../components/TabComponent";

const tableOptions = Object.keys(TradeTableConfig);

function TradeHistoryTable() {

  const [active, setActive] = useState("Open")
  const [globalFilter, setGlobalFilter] = useState("");

  const { token } = useSelector((state) => state.auth);
  const { activeMT5AccountLogin: login, activeMT5AccountPositionsDetails } = useSelector(state => state.mt5)

  const { data, isLoading, isError, error } = useDynamicQuery(active, activeMT5AccountPositionsDetails, token, login);

  const listData = data?.data

  const showError = error?.data?.message

  const config = TradeTableConfig[active];

  const table = useMaterialReactTable({
    columns: config?.columns,
    data: active == "Open" ? activeMT5AccountPositionsDetails || [] : listData || [],
    enableColumnFilters: false,
    enableSorting: false,
    enableColumnActions: false,
    enableGlobalFilter: false,
    manualFiltering: true,
    state: {
      globalFilter,
      isLoading: isLoading
    },
    enablePagination: false,
    onGlobalFilterChange: setGlobalFilter,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: showError || 'Error loading orders table.',
      }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <TabComponent
        active={active}
        items={tableOptions}
        boxSx={{ width: "100%" }}
        onChange={(_, newAlignment) => setActive(newAlignment)}
      />
    ),
    muiTableBodyCellProps: {
      sx: {
        padding: "10px",
        fontSize: "0.8rem",
      }
    },
    muiTableHeadCellProps: {
      sx: {
        padding: "10px",
        fontSize: "0.8rem",
      },
    },
  })

  return (
    <Stack sx={{ overflow: 'auto' }}>
      <MaterialReactTable table={table} />
    </Stack>
  );
}

export default TradeHistoryTable;