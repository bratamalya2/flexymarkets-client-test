import { HeroSection } from "../../../components/HeroSectionForIB"
import { RewardsGrid } from "../../../components/IBRewardGrid"
import { LuxuryRewardsShowcase } from "../../../components/IBLuxuryRewardsShowcase"
import { RewardTiers } from "../../../components/IBRewardTiers"
import { DashboardPreview } from "../../../components/DashboardPreview"
import { HowItWorks } from "../../../components/HowItWorks"
import { GlobalTrust } from "../../../components/GlobalTrust"
import IBApplicationForm from "../../../components/IBApplicationForm"
import { CTABanner } from "../../../components/CTABanner"
import { setThemeMode } from "../../../globalState/userPanelState/themeMode/themeModeSlice"
import { useDispatch } from "react-redux"
import { useEffect, useRef } from "react"


function IBElite() {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setThemeMode("dark"));
    }, []);

    const applicationFormRef = useRef(null);

    return (
        <>
            <HeroSection applicationFormRef={applicationFormRef} />
            <RewardsGrid />
            <LuxuryRewardsShowcase />
            <RewardTiers />
            <DashboardPreview />
            <HowItWorks />
            <GlobalTrust />
            <div ref={applicationFormRef}><IBApplicationForm /></div>
            <CTABanner applicationFormRef={applicationFormRef} />
        </>
    )
}

export default IBElite;