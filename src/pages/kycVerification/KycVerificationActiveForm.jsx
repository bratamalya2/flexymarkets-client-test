import { Box, Stack, Typography } from '@mui/material'
import PhoneVerification from './phoneVerification/PhoneVerification';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import OTPInput from '../../components/OTPInput';
import PhoneOtpVerification from './phoneVerification/PhoneOtpVerification';
import PersonalInfoVerification from './personalInfoVerification/PersonalInfoVerification';
import EconomicProfileVerification from './economicProfileVerification/EconomicProfileVerification';
import SourceOfIncomeOption from './economicProfileVerification/SourceOfIncomeOption';
import OccupationOrIndustryOptions from './economicProfileVerification/OccupationOrIndustryOptions';
import TotalWealthOption from './economicProfileVerification/TotalWealthOption';
import CurrentEmploymentOption from './economicProfileVerification/CurrentEmploymentOption';
import YearlyIncomeAfterTaxesOptions from './economicProfileVerification/YearlyIncomeAfterTaxesOptions';
import CFDTradingExperienceOptions from './economicProfileVerification/CFDTradingExperienceOptions';
import TimeExpendInMarket from './economicProfileVerification/TimeExpendInMarket';
import MonthlyIncomeToInvest from './economicProfileVerification/MonthlyIncomeToInvest';
import PlansOnTradingWithInOneYear from './economicProfileVerification/PlansOnTradingWithInOneYear';
import TimeToMasterTradingSkill from './economicProfileVerification/TimeToMasterTradingSkill';
import TradingInstrumentsPlanToUse from './economicProfileVerification/TradingInstrumentsPlanToUse';
import HowDidYouKnowAboutFlexyMarketsFirstTime from './economicProfileVerification/HowDidYouKnowAboutFlexyMarketsFirstTime';
import DocumentsVerification from './documentsVerification/DocumentsVerification';
import EditName from './documentsVerification/EditName';
import DataUseAgreement from './documentsVerification/DataUseAgreement';
import VerifyIdentity from './documentsVerification/VerifyIdentity';
import EmailOtpVerification from './emailVerification/EmailOtpVerification';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useGetUserDataQuery } from '../../globalState/userState/userStateApis';
import EmailVerification from './emailVerification/EmailVerification';
import DocumentSubmitted from './documentsVerification/DocumentSubmitted';
import { Icon } from "@iconify/react";
import { useGetDocumentDataQuery } from '../../globalState/complianceState/complianceStateApis';


function KycVerificationActiveForm() {

    const { token } = useSelector((state) => state.auth)

    const { data: docData, isLoading: docLoading } = useGetDocumentDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const areDocsUploaded = docData?.status

    const { kycStep } = useSelector(state => state.kyc)

    // const { data, isLoading, refetch } = useGetUserDataQuery()

    // const userEmail = !isLoading && data?.data?.userData?.email
    // const isEmailVerified = !isLoading && data?.data?.userData?.isEmailVerified

    const allKycComponent = {
        emailVerification: EmailVerification,
        emailOtpVerification: EmailOtpVerification,
        phoneVerification: PhoneVerification,
        phoneOtpVerification: PhoneOtpVerification,
        personalInfoVerification: PersonalInfoVerification,
        // economicProfileVerification: EconomicProfileVerification,
        // sourceOfIncomeOption: SourceOfIncomeOption,
        // occupationOrIndustryOptions: OccupationOrIndustryOptions,
        // totalWealthOption: TotalWealthOption,
        // currentEmploymentOption: CurrentEmploymentOption,
        // yearlyIncomeAfterTaxesOptions: YearlyIncomeAfterTaxesOptions,
        // CFDTradingExperienceOptions: CFDTradingExperienceOptions,
        // timeExpendInMarket: TimeExpendInMarket,
        // timeToMasterTradingSkill: TimeToMasterTradingSkill,
        // monthlyIncomeToInvest: MonthlyIncomeToInvest,
        // plansOnTradingWithInOneYear: PlansOnTradingWithInOneYear,
        // tradingInstrumentsPlanToUse: TradingInstrumentsPlanToUse,
        // howDidYouKnowAboutFlexyMarketsFirstTime: HowDidYouKnowAboutFlexyMarketsFirstTime,
        documentsVerification: DocumentsVerification,
        dataUseAgreement: DataUseAgreement,
        verifyIdentity: VerifyIdentity,
        documentSubmitted: DocumentSubmitted
    }

    const ActiveComponent = allKycComponent[kycStep]

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [kycStep]);

    return (
        <Stack sx={{ width: { xs: "100%", md: "600px" } }}>
            {
                areDocsUploaded
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