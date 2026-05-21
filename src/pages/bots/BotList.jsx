import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Container, Typography, Stack, InputLabel } from '@mui/material';
import { useState, useMemo } from 'react';
import { BotListHeaderColumn } from './BotListHeaderColumn';
import { useAllBotListQuery } from '../../globalState/trade/tradeApis';
import Selector from '../../components/Selector';

function BotList() {

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [status, setStatus] = useState("");

    const { data: listData, isLoading, isError, error } = useAllBotListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        status
    });

    const showError = error?.data?.message

    const list = listData?.data?.botList || [];

    const columns = useMemo(() => BotListHeaderColumn, []);

    const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);
    const data = useMemo(() => list, [list]);

    const table = useMaterialReactTable({
        columns: columns,
        data: isError ? [] : data,
        enableGlobalFilter: false,
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
                children: showError || 'Error loading Bot List.',
            }
            : undefined
    });

    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>Bot list</Typography>
            <Stack>
                <InputLabel sx={{ mb: 0.5, fontSize: 12 }}>Status</InputLabel>
                <Selector
                    items={["ACTIVE", "INACTIVE"]}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    width={{ xs: '100%', sm: 200 }}
                />
            </Stack>
            <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Container>
    )
};

export default BotList;