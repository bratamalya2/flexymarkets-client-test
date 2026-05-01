import { createTheme } from "@mui/material/styles";

export const getCustomTheme = (selectedTheme) => {

    const brandColors = {
        brandLight: "#699d89",
        brandDark: "#17433d",
        activeNavigation: "#17433d4a"
    };

    return createTheme({
        breakpoints: {
            values: { xs: 0, sm: 600, md: 900, lg: 1230, xl: 1536 },
        },
        palette: {
            mode: selectedTheme === "dark" ? "dark" : "light",
            primary: { main: selectedTheme === "dark" ? brandColors.brandLight : brandColors.brandDark },
            background: {
                default: selectedTheme === "dark" ? "#121212" : "#f5f5f5",
                paper: selectedTheme === "dark" ? "#1e1e1e" : "#ffffff",
            },
            text: {
                primary: selectedTheme === "dark" ? "#ffffff" : "#000000",
                secondary: selectedTheme === "dark" ? "#b0b0b0" : "#555555",
            },
            custom: {
                ...brandColors,
            },
        },
        typography: {
            // fontFamily: "'Roboto', sans-serif",
            fontFamily: "'Tomato Grotesk', 'Roboto', sans-serif",
        },
        components: {
            MuiStack: {
                variants: [
                    {
                        props: { variant: 'section' },
                        style: {
                            backgroundColor: selectedTheme === "dark" ? "#292929" : "transparent",
                        },
                    },
                ],
            },
            MuiGrid2: {
                variants: [
                    {
                        props: { variant: 'section' },
                        style: {
                            backgroundColor: selectedTheme === "dark" ? "#292929" : "transparent",
                        },
                    },
                ],
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                    },
                    containedPrimary: {
                        backgroundColor: selectedTheme === "dark" ? brandColors.brandLight : brandColors.brandDark,
                        color: "#fff",
                        '&:hover': {
                            backgroundColor: selectedTheme === "dark" ? "#5a8d7a" : "#0e2e29",
                        }
                    },
                    outlinedPrimary: {
                        borderColor: selectedTheme === "dark" ? brandColors.brandLight : brandColors.brandDark,
                        color: selectedTheme === "dark" ? brandColors.brandLight : brandColors.brandDark,
                        '&:hover': {
                            backgroundColor: selectedTheme === "dark" ? "rgba(105, 157, 137, 0.1)" : "rgba(23, 67, 61, 0.1)",
                        }
                    }
                }
            }
        }
    })
};