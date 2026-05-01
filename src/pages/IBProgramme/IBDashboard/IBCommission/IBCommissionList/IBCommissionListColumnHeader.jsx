import { createMRTColumnHelper } from 'material-react-table';
import { Button, Typography } from '@mui/material';
import ModalComponent from "../../../../../components/ModalComponent"
import OverrideCommissionModal from "../../../myClients/refferalClientsOfIB/refferalClientsOfIBTable/OverrideCommissionModal"

const columnHelper = createMRTColumnHelper();

export const IBCommissionListColumnHeader = (handleDataToEdit) => [
    // columnHelper.accessor('planName', {
    //     header: 'Plan Name',
    //     size: 100,
    // }),
    columnHelper.accessor('group', {
        header: 'Group Name',
        size: 150,
        Cell: ({ row }) => (
            <Typography>{row?.original?.group?.name}</Typography>
        )
    }),
    columnHelper.accessor('level1Commission', {
        header: 'Level1 Commission',
        size: 100,
        Cell: ({ row }) => {

            const planId = row?.original?.planId
            // <Typography>{row?.original?.level1Commission}</Typography>
            return <ModalComponent
                btnName={row?.original?.level1Commission}
                type={'text'}
                Content={OverrideCommissionModal}
                contentData={{ planId, level: "1" }}
            />
        }
    }),
    columnHelper.accessor('level2Commission', {
        header: 'Level2 Commission',
        size: 100,
    }),
    columnHelper.accessor('level3Commission', {
        header: 'Level3 Commission',
        size: 100,
    }),
    columnHelper.accessor('level4Commission', {
        header: 'Level4 Commission',
        size: 100,
    }),
    columnHelper.accessor('level5Commission', {
        header: 'Level5 Commission',
        size: 100,
    }),
    columnHelper.accessor('level6Commission', {
        header: 'Level6 Commission',
        size: 100,
    }),
    columnHelper.accessor('level7Commission', {
        header: 'Level7 Commission',
        size: 100,
    }),
    columnHelper.accessor('action', {
        header: 'Action',
        size: 150,
        Cell: ({ row }) => {

            const dataToEdit = row.original

            return <Button
                onClick={() => handleDataToEdit(dataToEdit)}
                variant="contained"
                sx={{
                    textTransform: "none",
                    color: "white",
                    fontSize: "0.7rem",
                    px: "8px",
                    py: "4px",
                }}
            >
                Edit
            </Button>
        },
    })
];