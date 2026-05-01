import SetIBCommission from "./setIBCommission/SetIBCommission";
import { useIbCommissionListQuery } from "../../../../globalState/ibState/ibStateApis";
import { Container, Typography } from "@mui/material";
import IBCommissionList from "./IBCommissionList/IBCommissionList";
import Loader from "../../../../components/Loader";
import { useState } from "react";

function IBCommission() {

    const [dataToEdit, setDataToEdit] = useState(null)


    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState("");

    const { data, isLoading: commissionDataLoading, isError, error } = useIbCommissionListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        search: globalFilter
    })

    const commissionData = data?.data

    const showError = error?.data?.message

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>Set IB Commission</Typography>
            {
                commissionDataLoading
                    ?
                    <Loader />
                    :
                    <IBCommissionList
                        data={commissionData}
                        loading={commissionDataLoading}
                        isError={isError}
                        showError={showError}
                        handleDataToEdit={setDataToEdit}
                        pagination={pagination}
                        setPagination={setPagination}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
            }
            {
                dataToEdit
                &&
                <SetIBCommission data={dataToEdit} setDataToEdit={setDataToEdit} />
            }
        </Container>
    )
}

export default IBCommission;