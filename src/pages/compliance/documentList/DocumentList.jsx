// import {
//     MaterialReactTable,
//     useMaterialReactTable
// } from 'material-react-table';
// import { Box, Button, Typography, Stack, Container } from '@mui/material';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import { useDispatch } from 'react-redux';
// import { documentListHeaderColumn } from './documentListHeaderColumn';
// import { useState, useMemo } from 'react';
// import { useGetDocumentDataQuery } from '../../../globalState/complianceState/complianceStateApis';
// import { handleExportToExcel } from '../../../utils/exportToExcel';

// function DocumentList() {

//     const dispatch = useDispatch()

//     const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
//     const [globalFilter, setGlobalFilter] = useState("");

//     const { data: listData, isLoading, isError, error } = useGetDocumentDataQuery({
//         page: pagination.pageIndex + 1,
//         sizePerPage: pagination.pageSize,
//         search: globalFilter,
//     });

//     const showError = error?.data?.message

//     const list = [listData?.data];

//     const columns = useMemo(() => documentListHeaderColumn, []);

//     const handleDownloadExcel = () => {
//         handleExportToExcel(list, "DocumentList.xlsx", dispatch);
//     };

//     const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);
//     const data = useMemo(() => list, [list]);

//     const table = useMaterialReactTable({
//         columns: columns,
//         data: isError ? [] : data,
//         enableColumnFilters: false,
//         enableSorting: false,
//         enableColumnActions: false,
//         manualPagination: true,
//         manualFiltering: true,
//         rowCount: rowCount,
//         state: {
//             pagination,
//             globalFilter,
//             isLoading,
//             showAlertBanner: isError,
//         },
//         onPaginationChange: setPagination,
//         onGlobalFilterChange: setGlobalFilter,
//         columnFilterDisplayMode: "popover",
//         paginationDisplayMode: 'pages',
//         positionToolbarAlertBanner: 'bottom',
//         muiToolbarAlertBannerProps: isError
//             ? {
//                 color: 'error',
//                 children: showError || 'Error loading Documents List.',
//             }
//             : undefined,
//         renderTopToolbarCustomActions: () => (
//             <Box
//                 sx={{
//                     display: 'flex',
//                     gap: '16px',
//                     padding: '8px',
//                     flexWrap: 'wrap',
//                 }}
//             >
//                 <Button
//                     variant="contained"
//                     onClick={handleDownloadExcel}
//                     startIcon={<FileDownloadIcon sx={{ color: "white" }} />}
//                     sx={{
//                         textTransform: 'none',
//                         color: "white",
//                         boxShadow: "none",
//                         "&:hover": { boxShadow: "none" }
//                     }}
//                 >
//                     Excel
//                 </Button>
//             </Box>
//         ),
//     });

//     return (
//         <Container>
//             <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>Documents List</Typography>
//             <Stack sx={{ marginTop: '2rem', borderRadius: '10px', overflow: 'hidden' }}>
//                 <MaterialReactTable table={table} />
//             </Stack>
//         </Container>
//     );
// };

// export default DocumentList;













import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Box, Button, Typography, Stack, Container, useMediaQuery, useTheme } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDispatch } from 'react-redux';
import { documentListHeaderColumn } from './documentListHeaderColumn';
import { useState, useMemo } from 'react';
import { useGetDocumentDataQuery } from '../../../globalState/complianceState/complianceStateApis';
import { handleExportToExcel } from '../../../utils/exportToExcel';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ModalComponent from "../../../components/ModalComponent"
import ExtraDocumentUploadModal from './ExtraDocumentUploadModal';


function DocumentList() {

    const theme = useTheme()

    const downSm = useMediaQuery(theme.breakpoints.down("sm"))

    const dispatch = useDispatch()

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState("");

    const { data: listData, isLoading, isError, error } = useGetDocumentDataQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        search: globalFilter,
    });

    const showError = error?.data?.message

    const list = [listData?.data];

    const columns = useMemo(() => documentListHeaderColumn, []);

    const handleDownloadExcel = () => {
        handleExportToExcel(list, "DocumentList.xlsx", dispatch);
    };

    const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);
    const data = useMemo(() => list, [list]);

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
            globalFilter,
            isLoading,
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
                children: showError || 'Error loading Documents List.',
            }
            : undefined,
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleDownloadExcel}
                    startIcon={<FileDownloadIcon sx={{ color: "white" }} />}
                    sx={{
                        textTransform: 'none',
                        color: "white",
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" }
                    }}
                >
                    Excel
                </Button>
            </Box>
        ),
    });

    return (
        <Container>
            <Stack sx={{ mb: "2rem", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"}>Documents List</Typography>
                <ModalComponent
                    Content={ExtraDocumentUploadModal}
                    btnName={"Upload"}
                    startIcon={<FileUploadIcon />}
                    modalWidth={downSm ? "95%" : 500}
                />
            </Stack>
            <Stack sx={{ marginTop: '2rem', borderRadius: '1.2rem', overflow: 'hidden' }}>
                <MaterialReactTable table={table} />
            </Stack>
        </Container>
    );
};

export default DocumentList;