import { Typography, Button, Stack } from '@mui/material'
import DocumentUploader from "../../../components/DocumentUploader"
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUploadDocumentMutation } from '../../../globalState/complianceState/complianceStateApis'
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod';

const fileTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
const maxSize = 3 * 1024 * 1024;

const documentsUploadSchema = z.object({
    extraDocs: z
        .array(z.instanceof(File))
        .refine(
            (files) =>
                !files ||
                files.every((file) => fileTypes.includes(file.type)),
            { message: "Only JPEG, PNG, JPG and PDF are allowed" }
        )
        .refine(
            (files) =>
                !files ||
                files.every((file) => file.size <= maxSize),
            { message: "Each file must not exceed 3MB" }
        ),
});


function ExtraDocumentUploadModal({ onClose }) {

    const dispatch = useDispatch()

    const defaultValues = {
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
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues);
                onClose()
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    };

    return (
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography sx={{ mb: "1.2rem", fontWeight: "700", fontSize: "1.5rem" }}>Upload extra documents</Typography>
            <Stack>
                <DocumentUploader
                    py={12}
                    name="extraDocs"
                    multiple={true}
                    label="Other files"
                    value={watch("extraDocs")}
                    onChange={(file) => setValue("extraDocs", file, { shouldValidate: true })}
                />
                {errors.extraDocs && <Typography color="error" fontSize={"14px"}>{errors.extraDocs.message}</Typography>}
            </Stack>
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
    )
}

export default ExtraDocumentUploadModal;