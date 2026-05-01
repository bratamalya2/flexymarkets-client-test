import { Container, Typography, Skeleton } from '@mui/material';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import RefferalClientsOfIBTable from './refferalClientsOfIBTable/RefferalClientsOfIBTable';
import { setClientLevel } from '../../../../globalState/userPanelState/myClientsState/myClientsSlice';
import Selector from "../../../../components/Selector";
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis";
import { useSelector } from 'react-redux';

const items = [
    "Client Level 1",
    "Client Level 2",
    "Client Level 3",
    "Client Level 4",
    "Client Level 5",
    "Client Level 6",
    "Client Level 7"
]

function RefferalClientsOfIB() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userName = data?.data?.userData?.name

    const [activeLevel, setActiveLevel] = useState(items[0]);
    const dispatch = useDispatch();

    const selectClientLevel = useCallback((newAlignment) => {
        setActiveLevel(newAlignment);
        dispatch(setClientLevel(newAlignment));
    }, [dispatch]);

    return (
        <Container>
            {/* <Typography variant='h5' fontWeight={"700"} fontSize={"1.5rem"} mb={"2rem"}>
                Refferal Clients of IB :- {isLoading ? <Skeleton /> : userName}
            </Typography> */}
            {/* <Selector
                items={items}
                width={"250px"}
                onChange={(event) => selectClientLevel(event.target.value)}
                value={activeLevel}
                showDefaultOption={false}
            /> */}
            <RefferalClientsOfIBTable />
        </Container>
    );
}

export default RefferalClientsOfIB;