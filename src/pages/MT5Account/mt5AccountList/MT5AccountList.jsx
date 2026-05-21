import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Paper,
    Chip,
    alpha,
    useTheme,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MT5AccountListColumnHeader } from "./MT5AccountListColumnHeader"
import { useMt5AccountListQuery } from '../../../globalState/mt5State/mt5StateApis';
import { handleExportToExcel } from '../../../utils/exportToExcel';

function MT5AccountList() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [accountType, setAccountType] = useState("REAL");

    const { data: listData, isLoading, isError, error } = useMt5AccountListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        type: accountType === "ALL" ? "" : accountType
    });

    const showError = error?.data?.message;
    const list = listData?.data?.mt5AccountList || [];
    const columns = useMemo(() => MT5AccountListColumnHeader, []);

    const accountStats = useMemo(() => {
        const realAccounts = list.filter(item => item.accountType === 'REAL').length;
        const demoAccounts = list.filter(item => item.accountType === 'DEMO').length;
        const totalAccounts = list.length;
        return { realAccounts, demoAccounts, totalAccounts };
    }, [list]);

    const handleDownloadExcel = () => {
        handleExportToExcel(list, "MT5AccountList.xlsx", dispatch);
    };

    const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);
    const data = useMemo(() => list, [list]);

    const handleAccountTypeChange = (event) => {
        setAccountType(event.target.value);
    };

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
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper,
            }
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: '600px',
                '&::-webkit-scrollbar': { width: '8px', height: '8px' },
                '&::-webkit-scrollbar-track': {
                    background: alpha(theme.palette.divider, 0.1),
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: theme.palette.primary.main,
                    borderRadius: '4px',
                }
            }
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                fontWeight: 600,
                fontSize: '0.875rem',
                color: theme.palette.text.primary,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }
            }
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: '0.875rem',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.05),
                }
            }
        },
        muiPaginationProps: {
            rowsPerPageOptions: [10, 20, 50],
            showFirstButton: true,
            showLastButton: true,
            sx: {
                '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    }
                }
            }
        },
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: showError || 'Error loading MT5 accounts.',
                sx: { borderRadius: '8px', margin: '8px' }
            }
            : undefined,
        renderTopToolbarCustomActions: () => (
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    backgroundColor: isDarkMode
                        ? alpha(theme.palette.background.default, 0.5)
                        : theme.palette.grey[50],
                }}
            >
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'text.primary', fontSize: '1rem' }}>
                    {accountType === "ALL" ? "All Trading Accounts" :
                        accountType === "REAL" ? "Real Trading Accounts" : "Demo Trading Accounts"}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Button
                    variant="contained"
                    onClick={handleDownloadExcel}
                    startIcon={<FileDownloadIcon sx={{ color: "white" }} />}
                    sx={{
                        textTransform: 'none',
                        color: "white",
                        fontWeight: 500,
                        borderRadius: '8px',
                        px: 2,
                        py: 0.8,
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                    }}
                >
                    Export Excel
                </Button>
            </Stack>
        ),
        renderBottomToolbarCustomActions: ({ table }) => (
            <Typography variant="caption" sx={{ color: 'text.secondary', px: 2 }}>
                Showing {table.getRowModel().rows.length} of {rowCount} accounts
            </Typography>
        ),
    });

    return (
        <Container>
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <AccountBalanceIcon sx={{ color: 'primary.main', fontSize: '1.75rem' }} />
                    <Typography variant='h5' fontWeight={700} fontSize={"1.8rem"}>
                        Trading Accounts
                    </Typography>
                </Stack>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={3}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'text.primary', mb: 2, fontSize: '1rem' }}>
                            Account Type
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                value={accountType}
                                onChange={handleAccountTypeChange}
                                sx={{ gap: { xs: 1, sm: 3 } }}
                            >
                                <FormControlLabel
                                    value="ALL"
                                    control={
                                        <Radio
                                            size="small"
                                            sx={{
                                                color: isDarkMode ? theme.palette.grey[400] : theme.palette.grey[600],
                                                '&.Mui-checked': { color: theme.palette.primary.main }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{
                                            fontWeight: accountType === "ALL" ? 600 : 400,
                                            color: accountType === "ALL" ? 'text.primary' : 'text.secondary'
                                        }}>
                                            All Accounts
                                        </Typography>
                                    }
                                    sx={{ mr: 0 }}
                                />
                                <FormControlLabel
                                    value="REAL"
                                    control={
                                        <Radio
                                            size="small"
                                            sx={{
                                                color: isDarkMode ? theme.palette.grey[400] : theme.palette.grey[600],
                                                '&.Mui-checked': { color: theme.palette.primary.main }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{
                                            fontWeight: accountType === "REAL" ? 600 : 400,
                                            color: accountType === "REAL" ? 'text.primary' : 'text.secondary'
                                        }}>
                                            Real Accounts
                                        </Typography>
                                    }
                                    sx={{ mr: 0 }}
                                />
                                <FormControlLabel
                                    value="DEMO"
                                    control={
                                        <Radio
                                            size="small"
                                            sx={{
                                                color: isDarkMode ? theme.palette.grey[400] : theme.palette.grey[600],
                                                '&.Mui-checked': { color: theme.palette.primary.main }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{
                                            fontWeight: accountType === "DEMO" ? 600 : 400,
                                            color: accountType === "DEMO" ? 'text.primary' : 'text.secondary'
                                        }}>
                                            Demo Accounts
                                        </Typography>
                                    }
                                    sx={{ mr: 0 }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                            {accountType === "ALL" && (
                                <>
                                    <Chip
                                        label={`${accountStats.realAccounts} Real`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            height: '28px',
                                            borderColor: alpha(theme.palette.success.main, 0.3),
                                            color: theme.palette.success.main,
                                        }}
                                    />
                                    <Chip
                                        label={`${accountStats.demoAccounts} Demo`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            height: '28px',
                                            borderColor: alpha(theme.palette.info.main, 0.3),
                                            color: theme.palette.info.main,
                                        }}
                                    />
                                </>
                            )}
                            {accountType === "REAL" && (
                                <Chip
                                    label={`${accountStats.realAccounts} Real Accounts`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        height: '28px',
                                        borderColor: alpha(theme.palette.success.main, 0.3),
                                        color: theme.palette.success.main,
                                        backgroundColor: alpha(theme.palette.success.main, 0.05),
                                    }}
                                />
                            )}
                            {accountType === "DEMO" && (
                                <Chip
                                    label={`${accountStats.demoAccounts} Demo Accounts`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        height: '28px',
                                        borderColor: alpha(theme.palette.info.main, 0.3),
                                        color: theme.palette.info.main,
                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                    }}
                                />
                            )}
                        </Box>
                        <Chip
                            label={`${accountStats.totalAccounts} accounts found`}
                            size="medium"
                            variant="filled"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                height: '36px',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': { backgroundColor: theme.palette.primary.dark }
                            }}
                        />
                    </Stack>
                </Stack>
            </Paper>

            <Box sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <MaterialReactTable table={table} />
            </Box>
        </Container>
    );
};

export default MT5AccountList;
