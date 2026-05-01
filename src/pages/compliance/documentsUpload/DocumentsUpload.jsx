// import { Container, Typography, Button, Stack } from '@mui/material'
// import DocumentUploader from "../../../components/DocumentUploader"
// import Grid from "@mui/material/Grid2"
// import { documentsUploadSchema } from './documentsUploadSchema'
// import { useDispatch } from 'react-redux'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useUploadDocumentMutation } from '../../../globalState/complianceState/complianceStateApis'
// import { setNotification } from '../../../globalState/notificationState/notificationStateSlice'
// import { useNavigate } from 'react-router-dom'


// function DocumentsUpload() {

//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     const defaultValues = {
//         poi: null,
//         poa: null,
//     };

//     const { handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
//         resolver: zodResolver(documentsUploadSchema),
//         defaultValues,
//     });

//     const [uploadDocument, { isLoading: uploadDocumentLoading }] = useUploadDocumentMutation();

//     const onSubmit = async (data) => {
//         try {
//             const response = await uploadDocument(data).unwrap();
//             if (response?.status) {
//                 navigate("/client")
//                 dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
//                 reset(defaultValues);
//             }
//         } catch (error) {
//             if (!error?.data?.status) {
//                 dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
//             }
//         }
//     };

//     return (
//         <Stack
//             sx={{ mt: "2rem" }}
//             component={"form"}
//             onSubmit={handleSubmit(onSubmit)}
//         >
//             {/* <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Upload Documents</Typography> */}
//             {/* <Grid container size={12} spacing={4}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                     <DocumentUploader py={12} />
//                     {errors.poi && <Typography color="error" fontSize={"14px"}>{errors.poi.message}</Typography>}
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                     <DocumentUploader py={12} />
//                     {errors.poa && <Typography color="error" fontSize={"14px"}>{errors.poa.message}</Typography>}
//                 </Grid>
//             </Grid> */}
//             <Grid container spacing={4}>
//                 <Grid item size={{ xs: 12, sm: 6 }}>
//                     <DocumentUploader
//                         py={12}
//                         name="poi"
//                         label="Proof of Identity (POI)"
//                         value={watch("poi")}
//                         onChange={(file) => setValue("poi", file, { shouldValidate: true })}
//                     />
//                     {errors.poi && <Typography color="error" fontSize={"14px"}>{errors.poi.message}</Typography>}
//                 </Grid>
//                 <Grid item size={{ xs: 12, sm: 6 }}>
//                     <DocumentUploader
//                         py={12}
//                         name="poa"
//                         label="Proof of Address (POA)"
//                         value={watch("poa")}
//                         onChange={(file) => setValue("poa", file, { shouldValidate: true })}
//                     />
//                     {errors.poa && <Typography color="error" fontSize={"14px"}>{errors.poa.message}</Typography>}
//                 </Grid>
//             </Grid>
//             <Stack alignItems={"center"}>
//                 <Button
//                     variant='contained'
//                     type='submit'
//                     disabled={uploadDocumentLoading}
//                     sx={{
//                         textTransform: "capitalize",
//                         width: "auto",
//                         boxShadow: "none",
//                         color: "white",
//                         mt: '2rem',
//                         "&:hover": {
//                             boxShadow: "none"
//                         }
//                     }}
//                 >Upload files</Button>
//             </Stack>
//         </Stack>
//     )
// }

// export default DocumentsUpload;
























import { Container, Typography, Button, Stack } from '@mui/material'
import DocumentUploader from "../../../components/DocumentUploader"
import Grid from "@mui/material/Grid2"
import { documentsUploadSchema } from './documentsUploadSchema'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUploadDocumentMutation } from '../../../globalState/complianceState/complianceStateApis'
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice'
import { useNavigate } from 'react-router-dom'


function DocumentsUpload() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const defaultValues = {
    //     poi: null,
    //     poa: null,
    //     extraDocs: null
    // };

    const defaultValues = {
        poi: null,
        poa: null,
        extraDocs: []
    };


    const { handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(documentsUploadSchema),
        defaultValues,
    });

    const [uploadDocument, { isLoading: uploadDocumentLoading }] = useUploadDocumentMutation();

    const onSubmit = async (data) => {
        try {
            const response = await uploadDocument(data).unwrap();
            if (response?.status) {
                navigate("/client")
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues);
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    };

    return (
        <Stack
            sx={{ mt: "2rem" }}
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Upload Documents</Typography> */}
            {/* <Grid container size={12} spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUploader py={12} />
                    {errors.poi && <Typography color="error" fontSize={"14px"}>{errors.poi.message}</Typography>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUploader py={12} />
                    {errors.poa && <Typography color="error" fontSize={"14px"}>{errors.poa.message}</Typography>}
                </Grid>
            </Grid> */}
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUploader
                        py={12}
                        name="poi"
                        label="Proof of Identity (POI)"
                        value={watch("poi")}
                        onChange={(file) => setValue("poi", file, { shouldValidate: true })}
                    />
                    {errors.poi && <Typography color="error" fontSize={"14px"}>{errors.poi.message}</Typography>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUploader
                        py={12}
                        name="poa"
                        label="Proof of Address (POA)"
                        value={watch("poa")}
                        onChange={(file) => setValue("poa", file, { shouldValidate: true })}
                    />
                    {errors.poa && <Typography color="error" fontSize={"14px"}>{errors.poa.message}</Typography>}
                </Grid>
                <Grid item size={{ xs: 12 }}>
                    <DocumentUploader
                        py={12}
                        name="extraDocs"
                        multiple={true}
                        label="Other files (Not required)"
                        value={watch("extraDocs")}
                        onChange={(file) => setValue("extraDocs", file, { shouldValidate: true })}
                    />
                    {errors.extraDocs && <Typography color="error" fontSize={"14px"}>{errors.extraDocs.message}</Typography>}
                </Grid>
            </Grid>
            <Stack alignItems={"center"}>
                <Button
                    variant='contained'
                    type='submit'
                    disabled={uploadDocumentLoading}
                    sx={{
                        textTransform: "capitalize",
                        width: "auto",
                        boxShadow: "none",
                        color: "white",
                        mt: '2rem',
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >Upload files</Button>
            </Stack>
        </Stack>
    )
}

export default DocumentsUpload;