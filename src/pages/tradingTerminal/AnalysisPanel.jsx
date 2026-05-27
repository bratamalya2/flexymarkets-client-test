import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PublicIcon from "@mui/icons-material/Public";
import TechnicalAnalysisPanel from "./TechnicalAnalysisPanel";
import FundamentalAnalysisPanel from "./FundamentalAnalysisPanel";

const ANALYSIS_SECTIONS = [
    {
        id: "technical",
        label: "Technical",
        description: "Indicators from chart candles",
        icon: AutoGraphIcon,
    },
    {
        id: "fundamental",
        label: "Fundamental",
        description: "News and macro drivers",
        icon: PublicIcon,
    },
];

function AnalysisPanel() {
    const [activeSection, setActiveSection] = useState("technical");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Box
                sx={{
                    p: "10px",
                    borderRadius: "18px",
                    background: "rgba(15, 19, 30, 0.86)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: "10px",
                }}
            >
                {ANALYSIS_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                        <Button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            sx={{
                                minHeight: "58px",
                                p: "10px 12px",
                                justifyContent: "flex-start",
                                gap: "10px",
                                borderRadius: "14px",
                                textTransform: "none",
                                color: isActive ? "white" : "#9fb0c8",
                                background: isActive
                                    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.24), rgba(31, 122, 224, 0.18))"
                                    : "rgba(255,255,255,0.04)",
                                border: `1px solid ${isActive ? "rgba(76, 175, 80, 0.38)" : "rgba(255,255,255,0.08)"}`,
                                "&:hover": {
                                    background: isActive
                                        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(31, 122, 224, 0.22))"
                                        : "rgba(76, 175, 80, 0.1)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "11px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: isActive ? "rgba(76, 175, 80, 0.2)" : "rgba(255,255,255,0.06)",
                                }}
                            >
                                <Icon sx={{ fontSize: "18px", color: isActive ? "#4CAF50" : "#9fb0c8" }} />
                            </Box>
                            <Stack alignItems="flex-start" gap="2px">
                                <Typography sx={{ fontSize: "13px", fontWeight: 950 }}>
                                    {section.label} Analysis
                                </Typography>
                                <Typography sx={{ color: isActive ? "#b7c4d8" : "#718096", fontSize: "11px", fontWeight: 700 }}>
                                    {section.description}
                                </Typography>
                            </Stack>
                        </Button>
                    );
                })}
            </Box>

            {activeSection === "technical" ? <TechnicalAnalysisPanel /> : <FundamentalAnalysisPanel />}
        </Box>
    );
}

export default AnalysisPanel;
