// import { useState } from 'react';
// import { Box, Button, Typography, Modal, Stack, useMediaQuery } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import VerificationStepOneForm from './verificationStepOneForm/VerificationStepOneForm';
// import VerificationStepOneListing from './VerificationStepOneListing';
// import VerificationStepOne from './VerificationStepOne';

// function VerificationStepOneModalContent() {
//     const [showForm, setShowForm] = useState(false);

//     const handleOpen = () => {
//         setOpen(true);
//         setShowForm(false);
//     };

//     return (
//         <Stack>
//             <Box>
//                 <Typography id="modal-modal-title" fontWeight={"bold"} fontSize={"1.8rem"}>
//                     Verification steps
//                 </Typography>
//                 <Typography id="modal-modal-description" sx={{ mt: 1 }} color="textSecondary">
//                     This process takes less than 5 minutes
//                 </Typography>
//                 {/* <Stack mt={"2rem"}>
//                     {showForm ? (
//                         <VerificationStepOneForm setShowForm={setShowForm} />
//                     ) : (
//                         <VerificationStepOneListing setShowForm={setShowForm} />
//                     )}
//                 </Stack> */}
//                 {/* <VerificationStepOneForm /> */}
//                 <VerificationStepOne />
//                 <Stack sx={{ flexDirection: "row", gap: "5px", justifyContent: "center", alignItems: "center" }}>
//                     <LockOutlinedIcon fontSize="14px" />
//                     <Typography fontSize={"14px"}>All data is encrypted for security</Typography>
//                 </Stack>
//             </Box>
//         </Stack>
//     );
// }

// export default VerificationStepOneModalContent;