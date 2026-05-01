import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Container, Typography } from '@mui/material';
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis"
import { useGetDocumentDataQuery } from '../../globalState/complianceState/complianceStateApis';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

function KycVerificationStepsList() {

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isEmailVerified = !isLoading && userData?.data?.userData?.isEmailVerified
    const isMobileVerified = !isLoading && userData?.data?.userData?.isMobileVerified
    const userName = !isLoading && userData?.data?.userData?.name

    const { data: docData, isError } = useGetDocumentDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const areDocsUploaded = docData?.data?.status == "PENDING"

    const data = [
        {
            name: "Verify email",
            verified: isEmailVerified || false,
            icon: CheckCircleIcon
        },
        {
            name: "Verify phone",
            verified: isMobileVerified || false,
            icon: CheckCircleIcon
        },
        {
            name: "Personal information",
            verified: userName || false,
            icon: CheckCircleIcon
        },
        // {
        //     name: "Economic profile",
        //     verified: false,
        //     icon: CheckCircleIcon
        // },
        {
            name: "Verify documents",
            verified: areDocsUploaded || false,
            icon: WatchLaterIcon
        }
    ]

    return (
        <List
            sx={{ width: '100%', bgcolor: 'background.paper', m: 0 }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={handleClick}>
                <ListItemText primary="Steps" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton>
                        <ListItemText
                            primary={
                                data.map((item, i) => (
                                    <Box key={i} sx={{ py: "20px", display: "flex", justifyContent: "space-between" }}>
                                        <Typography>{item.name}</Typography>
                                        {item.verified && <item.icon sx={{ color: item.name === "Verify documents" ? "#e3e33d" : "#46cd7c", fontSize: "1.7rem" }} />}
                                    </Box>
                                ))
                            }
                        />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}

export default KycVerificationStepsList;