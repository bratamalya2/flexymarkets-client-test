import { Box, Stack, Typography, useMediaQuery, Button, Skeleton } from "@mui/material"
import { Link } from "react-router-dom";
import { useGetUserDataQuery } from "../../../../../globalState/userState/userStateApis"
import { useSelector } from "react-redux";

function VerificationStepOne() {

    const matches = useMediaQuery('(min-width:780px)')

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userInfo = {
        Email: userData?.data?.userData?.email || "NA",
        Mobile: userData?.data?.userData?.mobile || "NA",
        Name: userData?.data?.userData?.name || "NA",
        "Date of birth": new Date(userData?.data?.userData?.dob).toLocaleDateString() || "NA",
        Gender: userData?.data?.userData?.gender || "NA",
        Address: userData?.data?.userData?.address || "NA"
    }

    const data = [
        {
            title: "Required to confirm",
            list: [userInfo]
            // [
            // userEmail,
            // userMobile || "Phone number",
            // userName || "Add profile information"
            // ]
        },
        {
            title: "Features and limits",
            list: ["Withdrawals"]
        }
    ]

    return (
        <Stack sx={{ gap: "1.5rem" }}>
            {
                data.map((item, i) => (
                    <Box key={i}>
                        <Typography fontSize={"12px"} color="textSecondary">{item.title}</Typography>
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                flexDirection: matches ? "row" : "column",
                                gap: "30px"
                            }}
                        >
                            {
                                item.list.map(listItem => (typeof listItem === "object" && listItem !== null) ?
                                    Object.entries(listItem).map(([keys, values]) => (
                                        <Stack mt={"10px"}>
                                            <Typography fontSize={"12px"}>{keys}</Typography>
                                            <Typography>{values}</Typography>
                                        </Stack>
                                    ))
                                    :
                                    <Typography component={"li"} fontSize={"16px"} ml={"16px"}>
                                        {isLoading ? <Skeleton width={"50px"} height={"20px"} /> : listItem}
                                    </Typography>)
                            }
                        </Box>
                    </Box>
                ))
            }
            <Button
                variant="contained"
                disabled={userInfo.Name}
                sx={{
                    textTransform: "none",
                    boxShadow: "none",
                    color: "white",
                    "&:hover": { boxShadow: "none" },
                    alignSelf: "flex-start"
                }}
                component={Link}
                to={"/client/kyc"}
            >
                {userInfo.Name ? "Completed" : "Complete now"}
            </Button>
        </Stack>
    )
}

export default VerificationStepOne;