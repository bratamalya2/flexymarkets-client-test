import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Box, Button, Container, Typography, Stack, InputLabel } from '@mui/material';
import Selector from '../../../components/Selector';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
// import { TeamWithdrawReportHeaderColumn } from './TeamWithdrawReportHeaderColumn';
import { useIBTeamDepositWithdrawReportQuery } from '../../../globalState/ibState/ibStateApis';
import { IBOverviewsHeaderColumn } from './IBOverviewsHeaderColumn';
import ModalComponent from "../../../components/ModalComponent"
import IBProfileModal from './IBProfileModal';
import { Link } from 'react-router-dom';


// const STATUS_OPTIONS = ["PENDING", "COMPLETED", "PROCESSING", "REJECTED"];
// const TRANSACTION_TYPES = ["CLIENT-DEPOSIT", "CLIENT-WITHDRAW", "WALLET-DEPOSIT", "WALLET-WITHDRAW", "IB-WITHDRAW", "INTERNAL-TRANSFER", "CREDIT-DEPOSIT", "BONUS-DEPOSIT", "CREDIT-WITHDRAW", "BONUS-WITHDRAW"];
// const PAYMENT_METHODS = ["BANK", "CASH", "CRYPTO"];

function IBOverviews() {

    // const dispatch = useDispatch()

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState({
        // status: "",
        transactionType: "WITHDRAW",
        // paymentMethod: "",
        fromDate: null,
        toDate: null,
    });

    const formattedFromDate = filters.fromDate ? dayjs(filters.fromDate).format('YYYY-MM-DD') : undefined;
    const formattedToDate = filters.toDate ? dayjs(filters.toDate).format('YYYY-MM-DD') : undefined;

    //   const { data: listData, isLoading, isError, error } = useIBTeamDepositWithdrawReportQuery({
    //     page: pagination.pageIndex + 1,
    //     sizePerPage: pagination.pageSize,
    //     search: globalFilter,
    //     ...filters,
    //     fromDate: formattedFromDate,
    //     toDate: formattedToDate,
    //   });

    //   const showError = error?.data?.message

    //   const list = listData?.data?.trxList || [];

    const columns = useMemo(() => IBOverviewsHeaderColumn, []);
    //   const data = useMemo(() => list, [list]);
    //   const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);

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
            //   pagination,
            //   globalFilter,
            //   isLoading,
            //   showAlertBanner: isError,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        // muiToolbarAlertBannerProps: isError
        //   ? {
        //     color: 'error',
        //     children: showError || 'Error loading transactions.',
        //   }
        //   : undefined,
    });

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>IB Overviews</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 2,
                flexWrap: 'wrap',
                mb: 4,
            }}>
                <ModalComponent Content={IBProfileModal} btnName={"My IB Profile"} />
                <Button variant='contained' component={Link} to="/client/IBProgramme/IBSummary">Summary</Button>
                <Button variant='contained' component={Link} to="/client/IBProgramme/IBStatistics">Statistics</Button>
                {/* <Button variant='contained'>IB Hierarchy Tree</Button> */}
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 2,
                flexWrap: 'wrap',
                mb: 4,
            }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    {/* <Stack>
                        <InputLabel sx={{ mb: 0.5, fontSize: 12 }}>Status</InputLabel>
                        <Selector
                            items={STATUS_OPTIONS}
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            width={{ xs: '100%', sm: 200 }}
                        />
                    </Stack> */}
                    {/* <Stack>
                        <InputLabel sx={{ mb: 0.5, fontSize: 12 }}>Payment Method</InputLabel>
                        <Selector
                            items={PAYMENT_METHODS}
                            value={filters.paymentMethod}
                            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                            width={{ xs: '100%', sm: 200 }}
                        />
                    </Stack> */}
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Stack>
                            <InputLabel sx={{ mb: 0.5, fontSize: 12 }}>From</InputLabel>
                            <DatePicker
                                value={filters.fromDate}
                                onChange={(newValue) => handleFilterChange('fromDate', newValue)}
                                slotProps={{
                                    textField: { size: 'small' },
                                    field: { clearable: true },
                                }}
                            />
                        </Stack>
                        <Stack>
                            <InputLabel sx={{ mb: 0.5, fontSize: 12 }}>To</InputLabel>
                            <DatePicker
                                value={filters.toDate}
                                onChange={(newValue) => handleFilterChange('toDate', newValue)}
                                slotProps={{
                                    textField: { size: 'small' },
                                    field: { clearable: true },
                                }}
                            />
                        </Stack>
                    </Box>
                </LocalizationProvider>
            </Box>
            <Stack sx={{ marginTop: '2rem', borderRadius: '10px', overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Container>
    )
};

export default IBOverviews;