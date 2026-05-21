import { createMRTColumnHelper } from 'material-react-table';
import { Typography, Tooltip } from '@mui/material';

const columnHelper = createMRTColumnHelper();

// Helper function to format date without moment
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const IBTransactionListColumnHeader = () => [
    columnHelper.accessor('user.userName', {
        header: 'Username',
        size: 120,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.user?.userName || '-'} arrow>
                <Typography variant="body2" noWrap>
                    {row?.original?.user?.userName || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('user.name', {
        header: 'User Name',
        size: 150,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.user?.name || '-'} arrow>
                <Typography variant="body2" noWrap>
                    {row?.original?.user?.name || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('transactionType', {
        header: 'Transaction Type',
        size: 150,
        Cell: ({ row }) => {
            const type = row?.original?.transactionType;
            let color = '#6b7280';
            let bgColor = '#f3f4f6';
            
            if (type === 'WALLET-DEPOSIT') {
                color = '#10b981';
                bgColor = '#d1fae5';
            } else if (type === 'WALLET-WITHDRAW') {
                color = '#ef4444';
                bgColor = '#fee2e2';
            }
            
            return (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: color,
                        bgcolor: bgColor,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase'
                    }}
                >
                    {type === 'WALLET-DEPOSIT' ? 'Deposit' : type === 'WALLET-WITHDRAW' ? 'Withdraw' : type}
                </Typography>
            );
        }
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        size: 120,
        Cell: ({ row }) => {
            const amount = row?.original?.amount || 0;
            const isDeposit = row?.original?.transactionType === 'WALLET-DEPOSIT';
            return (
                <Typography 
                    variant="body2" 
                    fontWeight={700}
                    sx={{ 
                        color: isDeposit ? '#10b981' : '#ef4444'
                    }}
                >
                    {isDeposit ? '+' : '-'} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
            );
        }
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        size: 120,
        Cell: ({ row }) => {
            const status = row?.original?.status;
            let color = '';
            let bgColor = '';
            
            if (status === 'COMPLETED') {
                color = '#10b981';
                bgColor = '#d1fae5';
            } else if (status === 'PENDING') {
                color = '#f59e0b';
                bgColor = '#fed7aa';
            } else if (status === 'FAILED') {
                color = '#ef4444';
                bgColor = '#fee2e2';
            } else {
                color = '#6b7280';
                bgColor = '#f3f4f6';
            }
            
            return (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: color,
                        bgcolor: bgColor,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                    }}
                >
                    {status || '-'}
                </Typography>
            );
        }
    }),
    columnHelper.accessor('paymentMethods', {
        header: 'Payment Method',
        size: 130,
        Cell: ({ row }) => (
            <Typography variant="body2" color="text.secondary">
                {row?.original?.paymentMethods || '-'}
            </Typography>
        )
    }),
    columnHelper.accessor('referrenceNo', {
        header: 'Reference No',
        size: 150,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.referrenceNo || '-'} arrow>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }} noWrap>
                    {row?.original?.referrenceNo || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('remark', {
        header: 'Remark',
        size: 150,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.remark || '-'} arrow>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }} noWrap>
                    {row?.original?.remark || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('createdAt', {
        header: 'Date & Time',
        size: 160,
        Cell: ({ row }) => (
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }} noWrap>
                {formatDate(row?.original?.createdAt)}
            </Typography>
        )
    })
];