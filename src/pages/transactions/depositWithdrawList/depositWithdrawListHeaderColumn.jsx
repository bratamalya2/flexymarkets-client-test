import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';
import ModalComponent from "../../../components/ModalComponent"
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemarkModal from '../../../components/RemarkModal';

const columnHelper = createMRTColumnHelper();

export const depositWithdrawListHeaderColumn = [
    // columnHelper.accessor('id', {
    //     header: 'ID',
    //     size: 40,
    // }),
    // columnHelper.accessor('userId', {
    //     header: 'User ID',
    //     size: 100,
    // }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        size: 120,
        Cell: ({ row }) => {
            const amountValue = row.original.amount;
            return (
                amountValue ?
                    <Typography>{amountValue}</Typography>
                    :
                    <Typography fontSize={"12px"} component={"em"}>Empty</Typography>
            );
        },
    }),
    // columnHelper.display({
    //     id: 'image',
    //     header: 'Deposit Proof',
    //     Cell: ({ row }) => {
    //         const hasBookBank = row?.original?.image;
    //         return hasBookBank ? (
    //             <a href={hasBookBank} target="_blank" rel="noopener noreferrer">
    //                 <img
    //                     src={hasBookBank}
    //                     alt="Bankbook"
    //                     style={{
    //                         width: '50px',
    //                         height: 'auto',
    //                         borderRadius: '4px',
    //                         boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    //                     }}
    //                 />
    //             </a>
    //         ) : (
    //             <Typography fontSize={"12px"} component={"em"}>
    //                 Empty
    //             </Typography>
    //         );
    //     },
    //     size: 100,
    // }),
    columnHelper.accessor('transactionType', {
        header: 'Transaction Type',
        size: 150,
        Cell: ({ row }) => {
            const transactionTypeValue = row.original.transactionType;
            return (
                transactionTypeValue ?
                    <Typography>{transactionTypeValue}</Typography>
                    :
                    <Typography fontSize={"12px"} component={"em"}>Empty</Typography>
            );
        },
    }),
    columnHelper.accessor('paymentMethods', {
        header: 'Payment Methods',
        size: 150,
        Cell: ({ row }) => {
            const paymentMethodsValue = row.original.paymentMethods;
            return (
                paymentMethodsValue ?
                    <Typography>{paymentMethodsValue}</Typography>
                    :
                    <Typography fontSize={"12px"} component={"em"}>Empty</Typography>
            );
        },
    }),
    columnHelper.accessor('transactionReference', {
        header: 'Transaction Reference',
        size: 200,
        Cell: ({ row }) => {
            const transactionReferenceValue = row.original.transactionReference;
            return (
                transactionReferenceValue ?
                    <Typography>{transactionReferenceValue}</Typography>
                    :
                    <Typography fontSize={"12px"} component={"em"}>Empty</Typography>
            );
        },
    }),
    columnHelper.accessor('remark', {
        header: 'Remark',
        size: 100,
        Cell: ({ row }) => {
            const remarkValue = row.original.remark;
            return (
                remarkValue ?
                    (
                        remarkValue?.split(" ")?.length > 5
                            ?
                            <ModalComponent
                                Content={RemarkModal}
                                contentData={remarkValue}
                                type='icon'
                                btnName={VisibilityIcon}
                            />
                            :
                            <Typography>{remarkValue}</Typography>
                    )
                    :
                    <Typography fontSize={"12px"} component={"em"}>Empty</Typography>
            );
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        size: 100,
        Cell: ({ row }) => {
            const statusValue = row.original.status;
            return (
                statusValue ?
                    <Typography>{statusValue}</Typography>
                    :
                    <Typography fontSize={"12px"} component={"em"}>Empty</Typography>
            );
        },
    }),
    // columnHelper.accessor('approvedBy', {
    //     header: 'Approved By',
    //     size: 100,
    //     Cell: ({ row }) => {
    //         const approvedByValue = row.original.approvedBy;
    //         return (
    //             approvedByValue ?
    //                 <Typography>{approvedByValue}</Typography>
    //                 :
    //                 <Typography fontSize={"12px"} component={"em"}>Empty</Typography>
    //         );
    //     },
    // }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        size: 250,
        Cell: ({ row }) => (
            <Typography>
                {new Date(row.original.createdAt).toLocaleString()}
            </Typography>
        ),
    })
];