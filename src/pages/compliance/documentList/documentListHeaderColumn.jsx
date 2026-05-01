// import { createMRTColumnHelper } from 'material-react-table';
// import { Typography } from '@mui/material';

// const columnHelper = createMRTColumnHelper();

// export const documentListHeaderColumn = [
//     columnHelper.display({
//         id: 'poi',
//         header: 'POI',
//         Cell: ({ row }) => {
//             const hasPOI = row?.original?.poi;
//             return hasPOI ? (
//                 <a href={hasPOI} target="_blank" rel="noopener noreferrer">
//                     <img
//                         src={hasPOI}
//                         alt="POI"
//                         style={{
//                             width: '50px',
//                             height: 'auto',
//                             borderRadius: '4px',
//                             boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
//                         }}
//                     />
//                 </a>
//             ) : (
//                 <Typography variant="body2" color="textSecondary">
//                     No POI
//                 </Typography>
//             );
//         },
//     }),
//     columnHelper.display({
//         id: 'poa',
//         header: 'POA',
//         Cell: ({ row }) => {
//             const hasPOA = row?.original?.poa;
//             return hasPOA ? (
//                 <a href={hasPOA} target="_blank" rel="noopener noreferrer">
//                     <img
//                         src={hasPOA}
//                         alt="POA"
//                         style={{
//                             width: '50px',
//                             height: 'auto',
//                             borderRadius: '4px',
//                             boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
//                         }}
//                     />
//                 </a>
//             ) : (
//                 <Typography variant="body2" color="textSecondary">
//                     No POA
//                 </Typography>
//             );
//         },
//     }),
//     columnHelper.accessor('status', {
//         header: 'Status',
//         size: 100,
//     }),
//     columnHelper.accessor('createdAt', {
//         header: 'Uploaded At',
//         Cell: ({ row }) => (
//             <Typography>
//                 {new Date(row.original.createdAt).toLocaleString()}
//             </Typography>
//         ),
//     }),
// ];






























import { createMRTColumnHelper } from 'material-react-table';
import { useMediaQuery, Typography } from '@mui/material';
import ModalComponent from "../../../components/ModalComponent"
import ShowExtraDocModal from './ShowExtraDocModal';
import VisibilityIcon from '@mui/icons-material/Visibility';


const columnHelper = createMRTColumnHelper();

export const documentListHeaderColumn = [
    columnHelper.display({
        id: 'poi',
        header: 'POI',
        Cell: ({ row }) => {
            const hasPOI = row?.original?.poi;
            return hasPOI ? (
                <a href={hasPOI} target="_blank" rel="noopener noreferrer">
                    <img
                        src={hasPOI}
                        alt="POI"
                        style={{
                            width: '50px',
                            height: 'auto',
                            borderRadius: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                    />
                </a>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No POI
                </Typography>
            );
        },
    }),
    columnHelper.display({
        id: 'poa',
        header: 'POA',
        Cell: ({ row }) => {
            const hasPOA = row?.original?.poa;
            return hasPOA ? (
                <a href={hasPOA} target="_blank" rel="noopener noreferrer">
                    <img
                        src={hasPOA}
                        alt="POA"
                        style={{
                            width: '50px',
                            height: 'auto',
                            borderRadius: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                    />
                </a>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No POA
                </Typography>
            );
        },
    }),
    columnHelper.display({
        id: 'extraDoc',
        header: 'Extra Document',
        Cell: ({ row }) => {
            const hasExtraDocs = row?.original?.extraDocs;
            const modalWidth = useMediaQuery('(max-width:600px)');
            return hasExtraDocs?.length > 0 ? (
                <ModalComponent
                    Content={ShowExtraDocModal}
                    contentData={hasExtraDocs}
                    type='icon'
                    btnName={VisibilityIcon}
                    modalWidth={modalWidth ? "95%" : 500}
                />
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No Extra Document
                </Typography>
            );
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        size: 100,
    }),
    columnHelper.accessor('createdAt', {
        header: 'Uploaded At',
        Cell: ({ row }) => (
            <Typography>
                {new Date(row.original.createdAt).toLocaleString()}
            </Typography>
        ),
    }),
];