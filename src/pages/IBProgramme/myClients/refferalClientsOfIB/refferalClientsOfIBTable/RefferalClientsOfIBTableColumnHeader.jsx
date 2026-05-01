import { createMRTColumnHelper } from 'material-react-table';
import { Button, Stack, Typography } from '@mui/material';
import { setNotification } from '../../../../../globalState/notificationState/notificationStateSlice';
import { useDispatch } from 'react-redux';
import { useMakeSubIBMutation } from '../../../../../globalState/ibState/ibStateApis';
import { useGetReferralListQuery } from '../../../../../globalState/userState/userStateApis';
import ModalComponent from "../../../../../components/ModalComponent"
import OverrideCommissionModal from './OverrideCommissionModal';

const columnHelper = createMRTColumnHelper();

export const RefferalClientsOfIBTableColumnHeader = [
    columnHelper.accessor('name', {
        header: 'Name',
        // size: 40,
        Cell: ({ row }) => {

            const name = row?.original?.name

            return name ? <Typography>{row?.original?.name}</Typography>
                :
                <Typography component={"em"} fontSize={"14px"}>Empty</Typography>
        },
    }),
    columnHelper.accessor('userName', {
        header: 'User name',
        // size: 40,
    }),
    columnHelper.accessor('level', {
        header: 'Level',
        // size: 40,
    }),
    columnHelper.accessor('isSubIb', {
        header: 'Sub Ib',
        // size: 40,
        Cell: ({ row }) => (<Typography color={row?.original?.isSubIb ? "green" : "red"}>{row?.original?.isSubIb ? "Yes" : "No"}</Typography>)
    }),
    columnHelper.accessor('date', {
        header: 'Date',
        // size: 40,
        Cell: ({ row }) => (
            <Typography>
                {new Date(row.original.date).toLocaleString()}
            </Typography>
        ),
    }),
    columnHelper.display({
        id: "action",
        header: 'Action',
        // size: 350,
        Cell: ({ row }) => {

            const { refetch } = useGetReferralListQuery()

            const userId = row?.original?.id
            const isSubIb = row?.original?.isSubIb ? false : true

            const dispatch = useDispatch()

            const [makeSubIB, { isLoading }] = useMakeSubIBMutation();

            const onSubmit = async () => {
                try {
                    const response = await makeSubIB({ userId, isSubIb }).unwrap();
                    if (response?.status) {
                        dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                        refetch()
                    }
                } catch (error) {
                    if (!error?.data?.status) {
                        dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
                    }
                }
            };

            return <Stack sx={{ gap: "5px", flexDirection: "row" }}>
                <Button
                    onClick={onSubmit}
                    variant='contained'
                    disabled={isLoading}
                    sx={{
                        minWidth: "1.5rem",
                        fontSize: "13px",
                        px: "8px",
                        py: "4px"
                    }}
                >{row?.original?.isSubIb ? "Remove Sub IB" : "Make Sub IB"}</Button>
                {/* {row?.original?.isSubIb &&
                    <ModalComponent
                    Content={OverrideCommissionModal}
                        btnName={"Override Commission"}
                        btnSx={{
                            minWidth: "1.5rem",
                            fontSize: "13px",
                            px: "8px",
                            py: "4px"
                        }}
                    />
                } */}
            </Stack>

        },
    }),
];