import { createMRTColumnHelper } from 'material-react-table';
import { Typography, Tooltip, Chip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';

const columnHelper = createMRTColumnHelper();

export const KYCListColumnHeader = () => [
    columnHelper.accessor('userName', {
        header: 'Username',
        size: 130,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.userName || '-'} arrow>
                <Typography variant="body2" noWrap fontWeight={500}>
                    {row?.original?.userName || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('name', {
        header: 'Full Name',
        size: 180,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.name || '-'} arrow>
                <Typography variant="body2" noWrap>
                    {row?.original?.name || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('country', {
        header: 'Country',
        size: 120,
        Cell: ({ row }) => (
            <Typography variant="body2">
                {row?.original?.country || '-'}
            </Typography>
        )
    }),
    columnHelper.accessor('isKycVerified', {
        header: 'KYC Status',
        size: 120,
        Cell: ({ row }) => {
            const isVerified = row?.original?.isKycVerified;
            return (
                <Chip
                    icon={isVerified ? <VerifiedIcon /> : <PendingIcon />}
                    label={isVerified ? 'Verified' : 'Pending'}
                    size="small"
                    sx={{
                        backgroundColor: isVerified ? '#d1fae5' : '#fed7aa',
                        color: isVerified ? '#10b981' : '#f59e0b',
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                            color: isVerified ? '#10b981' : '#f59e0b',
                        }
                    }}
                />
            );
        }
    }),
    columnHelper.accessor('isIb', {
        header: 'IB Status',
        size: 100,
        Cell: ({ row }) => {
            const isIb = row?.original?.isIb;
            const isSubIb = row?.original?.isSubIb;
            let label = 'User';
            let color = '#6b7280';
            let bgColor = '#f3f4f6';
            
            if (isIb) {
                label = 'IB';
                color = '#3b82f6';
                bgColor = '#dbeafe';
            } else if (isSubIb) {
                label = 'Sub IB';
                color = '#8b5cf6';
                bgColor = '#ede9fe';
            }
            
            return (
                <Chip
                    label={label}
                    size="small"
                    sx={{
                        backgroundColor: bgColor,
                        color: color,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                    }}
                />
            );
        }
    }),
    columnHelper.accessor('parent.userName', {
        header: 'Parent Username',
        size: 130,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.parent?.userName || '-'} arrow>
                <Typography variant="body2" noWrap>
                    {row?.original?.parent?.userName || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('parent.name', {
        header: 'Parent Name',
        size: 180,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.parent?.name || '-'} arrow>
                <Typography variant="body2" noWrap>
                    {row?.original?.parent?.name || '-'}
                </Typography>
            </Tooltip>
        )
    }),
    columnHelper.accessor('parent.email', {
        header: 'Parent Email',
        size: 200,
        Cell: ({ row }) => (
            <Tooltip title={row?.original?.parent?.email || '-'} arrow>
                <Typography variant="body2" noWrap sx={{ fontSize: '0.75rem' }}>
                    {row?.original?.parent?.email || '-'}
                </Typography>
            </Tooltip>
        )
    }),
];