import { Stack, Typography } from '@mui/material'
import PhoneVerification from './phoneVerification/PhoneVerification';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonalInfoVerification from './personalInfoVerification/PersonalInfoVerification';
import DocumentsVerification from './documentsVerification/DocumentsVerification';
import DataUseAgreement from './documentsVerification/DataUseAgreement';
import VerifyIdentity from './documentsVerification/VerifyIdentity';
import EmailOtpVerification from './emailVerification/EmailOtpVerification';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import EmailVerification from './emailVerification/EmailVerification';
import DocumentSubmitted from './documentsVerification/DocumentSubmitted';
import { useGetDocumentDataQuery } from '../../globalState/complianceState/complianceStateApis';


function KycVerificationActiveForm() {

    const { token } = useSelector((state) => state.auth)

    const { data: docData } = useGetDocumentDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const areDocsSubmitted = Boolean(docData?.data?.status && docData.data.status !== "REJECTED")

    const { kycStep } = useSelector(state => state.kyc)

    // const { data, isLoading, refetch } = useGetUserDataQuery()

    // const userEmail = !isLoading && data?.data?.userData?.email
    // const isEmailVerified = !isLoading && data?.data?.userData?.isEmailVerified

    const allKycComponent = {
        emailVerification: EmailVerification,
        emailOtpVerification: EmailOtpVerification,
        phoneVerification: PhoneVerification,
        personalInfoVerification: PersonalInfoVerification,
        documentsVerification: DocumentsVerification,
        dataUseAgreement: DataUseAgreement,
        verifyIdentity: VerifyIdentity,
        documentSubmitted: DocumentSubmitted
    }

    const ActiveComponent = allKycComponent[kycStep] || PhoneVerification

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [kycStep]);

    return (
        <Stack sx={{ width: { xs: "100%", md: "600px" } }}>
            {
                areDocsSubmitted
                    ?
                    <Typography>Documents submitted Wait for Approval</Typography>
                    :
                    <Typography>Complete the profile verification to remove all limitations on depositing and trading</Typography>
            }
            <ActiveComponent />
            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    mt: "2rem"
                }}
            >
                <LockOutlinedIcon sx={{ fontSize: "14px" }} />
                <Typography color="textSecondary" fontSize={"14px"}>All data is encrypted for security</Typography>
            </Stack>
        </Stack>
    )
}

export default KycVerificationActiveForm;
