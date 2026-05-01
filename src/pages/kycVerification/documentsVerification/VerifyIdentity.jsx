import { Box, ListItem, Stack, Typography, List } from '@mui/material';
import SearchableDropdown from '../../../components/SearchableDropdown';
import { allCountryName } from "../../../allCountryName";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UploadSelectedDocumentPhoto from './UploadSelectedDocumentPhoto';
import { useState } from 'react';
import DocumentsUpload from '../../compliance/documentsUpload/DocumentsUpload';
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis"
import { useSelector } from 'react-redux';

const passportImage1 = "/identity/passportImage/passportImage1.svg";
const passportImage2 = "/identity/passportImage/passportImage2.svg";
const drivingLicenceImage1 = "/identity/passportImage/passportImage1.svg";
const drivingLicenceImage2 = "/identity/passportImage/passportImage2.svg";
const adharCardImage1 = "/identity/adharCardImage/adharCardImage1.svg";
const adharCardImage2 = "/identity/adharCardImage/adharCardImage2.svg";
const voterIdCardImage1 = "/identity/passportImage/passportImage1.svg";
const voterIdCardImage2 = "/identity/passportImage/passportImage2.svg";
const panCardImag1 = "/identity/passportImage/passportImage1.svg";
const panCardImage2 = "/identity/passportImage/passportImage2.svg";


const identityData = [
    {
        name: "Passport (main page)",
        images: [passportImage1, passportImage2]
    },
    {
        name: "Aadhaar card (front and back)",
        images: [adharCardImage1, adharCardImage2]
    },
]

function VerifyIdentity() {

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userCountry = isLoading ? "" : userData?.data?.userData?.country

    const [activeIdentityType, setActiveIdentityType] = useState("")

    const data = identityData.filter(item => item.name === activeIdentityType).map(filteredItem => filteredItem.images)

    return (
        <Stack>
            <Typography fontWeight={700} fontSize={"1.8rem"}>Verify identity</Typography>
            <Box mt={"2rem"}>
                <Typography fontWeight={700} fontSize={"1.2rem"} mb={"1rem"}>1. Select the country / region that issued your identity document</Typography>
                <SearchableDropdown
                    shouldBeDisabled={true}
                    options={allCountryName}
                    value={userCountry}
                />
            </Box>
            <Box mt={"2rem"}>
                {/* <Typography fontWeight={700} fontSize={"1.2rem"} mb={"1rem"}>2. Select your identity document</Typography> */}
                <Typography fontWeight={700} fontSize={"1.2rem"} mb={"1rem"}>2. Submit your identity and adress document</Typography>
                {/* <FormControl>
                    {
                        identityData.map((item, i) => (
                            <RadioGroup
                                key={i}
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={activeIdentityType}
                                onChange={(e) => setActiveIdentityType(e.target.value)}
                            >
                                <FormControlLabel value={item.name} control={<Radio />} label={item.name} />
                            </RadioGroup>
                        ))
                    }
                </FormControl> */}
                <List sx={{ listStyleType: "disc", pl: 2, py: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <ListItem sx={{ display: "list-item", p: 0 }}>Proof of identity</ListItem>
                    <ListItem sx={{ display: "list-item", p: 0 }}>Proof of address</ListItem>
                </List>
            </Box>
            {/* {
                data[0] &&
                <>
                    <Box mt={"2rem"}>
                        <Typography fontWeight={700} fontSize={"1.2rem"} mb={"1rem"}>3. Take photo of ID document</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "10px",
                                border: "1px solid ${theme.palette.primary.main}",
                                p: "1rem",
                                borderRadius: ".5rem",
                                bgcolor: "#bef2ea75"
                            }}
                        >
                            <InfoOutlinedIcon sx={{ color: "primary.main" }} />
                            <Typography fontSize={"16px"}>Make sure the document shows your photo, full name, date of birth and date of issue.</Typography>
                        </Box>
                    </Box>
                    <UploadSelectedDocumentPhoto data={data[0]} />
                </>
            } */}
            <DocumentsUpload />
        </Stack>
    )
}

export default VerifyIdentity;