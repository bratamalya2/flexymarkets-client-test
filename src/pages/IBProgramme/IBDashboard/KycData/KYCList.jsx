import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Stack, Box, Typography } from '@mui/material';
import { KYCListColumnHeader } from './KYCListColumnHeader';
import { useMemo, useEffect } from 'react';

function KYCList({ data, isError, showError, loading, pagination, setPagination, globalFilter, setGlobalFilter }) {

    // Debug logs to check data
    useEffect(() => {
        console.log('KYCList - Received data:', data);
        console.log('KYCList - Completed KYC List:', data?.completedKycList);
        console.log('KYCList - Pending KYC List:', data?.pendingKycList);
    }, [data]);

    const columns = useMemo(() => KYCListColumnHeader(), []);
    
    // Get all KYC data
    const allCompletedKyc = useMemo(() => data?.completedKycList || [], [data?.completedKycList]);
    const allPendingKyc = useMemo(() => data?.pendingKycList || [], [data?.pendingKycList]);
    
    // Combine both lists
    const allKycData = useMemo(() => {
        const combined = [...allCompletedKyc, ...allPendingKyc];
        console.log('Combined KYC Data Count:', combined.length);
        return combined;
    }, [allCompletedKyc, allPendingKyc]);
    
    // Apply frontend filtering based on search term
    const filteredData = useMemo(() => {
        if (!globalFilter || globalFilter.trim() === '') {
            return allKycData;
        }
        
        const searchTerm = globalFilter.toLowerCase().trim();
        
        return allKycData.filter(item => {
            // Search in username
            const userName = item?.userName?.toLowerCase() || '';
            if (userName.includes(searchTerm)) return true;
            
            // Search in name
            const name = item?.name?.toLowerCase() || '';
            if (name.includes(searchTerm)) return true;
            
            // Search in country
            const country = item?.country?.toLowerCase() || '';
            if (country.includes(searchTerm)) return true;
            
            // Search in parent username
            const parentUserName = item?.parent?.userName?.toLowerCase() || '';
            if (parentUserName.includes(searchTerm)) return true;
            
            // Search in parent name
            const parentName = item?.parent?.name?.toLowerCase() || '';
            if (parentName.includes(searchTerm)) return true;
            
            // Search in parent email
            const parentEmail = item?.parent?.email?.toLowerCase() || '';
            if (parentEmail.includes(searchTerm)) return true;
            
            return false;
        });
    }, [allKycData, globalFilter]);
    
    const rowCount = useMemo(() => filteredData.length, [filteredData]);

    const table = useMaterialReactTable({
        columns,
        data: filteredData,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: false,
        manualFiltering: false,
        enableGlobalFilter: true,
        rowCount: rowCount,
        initialState: {
            density: 'compact',
            showGlobalFilter: true,
        },
        state: {
            pagination,
            globalFilter: globalFilter || '',
            isLoading: loading,
            showAlertBanner: isError,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: showError || 'Error loading KYC List.',
            }
            : undefined,
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 600,
                backgroundColor: 'background.paper',
            },
        },
        renderEmptyRowsFallback: () => (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                    No KYC records found
                </Typography>
            </Box>
        ),
    });

    // Show loading state
    if (loading && !allKycData.length) {
        return (
            <Stack sx={{ marginTop: '2rem' }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>Loading KYC data...</Typography>
                </Box>
            </Stack>
        );
    }

    return (
        <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
            <MaterialReactTable table={table} />
        </Stack>
    )
};

export default KYCList;