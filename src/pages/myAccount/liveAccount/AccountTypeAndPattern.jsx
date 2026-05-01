import { Stack } from "@mui/material";
import Selector from "../../../components/Selector";
import Toggle from "../../../components/Toggle";
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import { useSelector, useDispatch } from "react-redux";
import { setMyAccountLayout } from "../../../globalState/userPanelState/myAccountState/myAccountSlice";

const items = [
    { name: "list", icon: <ListIcon fontSize="2rem" /> },
    { name: "grid", icon: <GridViewIcon fontSize="2rem" /> }
]

function AccountTypeAndPattern() {

    const { myAccountLayout } = useSelector((state) => state.myAccount);

    const dispatch = useDispatch()

    function handleAccountToggle(newAlignment) {
        if (newAlignment) {
            dispatch(setMyAccountLayout(newAlignment))
        }
    }

    return (
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem", justifyContent: "space-between", mt: "1rem" }}>
            {/* <Selector items={["Newest", "Oldest", "Free margin", "Nickname"]} width={"200px"} height={"40px"} /> */}
            <Toggle
                items={items}
                toggleButtonGroupSx={{ height: "40px" }}
                onChange={(_, newAlignment) => handleAccountToggle(newAlignment)}
                active={myAccountLayout}
            />
        </Stack>
    )
}

export default AccountTypeAndPattern;