import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { Stack } from '@mui/material';
import VerificationStepOne from "./verificationStepOne/VerificationStepOne";
import VerificationStepTwo from './verificationStepTwo/VerificationStepTwo';
import VerificationStepThree from './verificationStepThree/VerificationStepThree';
import { useSelector } from 'react-redux';


function VerificationSteps() {

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const { selectedTheme } = useSelector((state) => state.themeMode);

    const stepsData = [
        {
            title: "Confirm email and phone number. Add personal details",
            Component: VerificationStepOne,
            stepNo: "1"
        },
        {
            title: "Verify your identity",
            Component: VerificationStepTwo,
            stepNo: "2"
        },
        {
            title: "Verify residential address",
            Component: VerificationStepThree,
            stepNo: "3"
        },
    ];

    return (
        <Stack
            variant={"section"}
            sx={{
                border: "1px solid #e2e4e4",
                borderRadius: "6px",
                overflow: "hidden"
            }}
        >
            {stepsData.map((data, i) => {
                const panelId = `panel${i}`;
                const { Component } = data;
                return (
                    <Accordion
                        key={i}
                        expanded={expanded === panelId}
                        onChange={handleChange(panelId)}
                        sx={{ boxShadow: "none", py: ".5rem", borderTop: i !== 0 && "1px solid #e2e4e4" }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${panelId}-content`}
                            id={`${panelId}-header`}
                        >
                            <Typography
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "25px",
                                    height: "25px",
                                    bgcolor: "primary.main",
                                    borderRadius: "100%",
                                    color: "white",
                                    mr: "20px",
                                    fontWeight: "bold",
                                    fontSize: '12px',
                                    flexShrink: 0
                                }}
                            >{data.stepNo}</Typography>
                            <Typography component="span">{data.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Component />
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Stack>
    );
}

export default VerificationSteps;