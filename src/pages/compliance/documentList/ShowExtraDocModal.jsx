import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";


function ShowExtraDocModal({ data }) {

    return (
        <>
            <Typography fontSize={"1.5rem"} fontWeight={"700"} mb={"1rem"}>Extra documents</Typography>
            <Grid container spacing={2}>
                {
                    data?.map((image, i) => (
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <a href={image} target="_blank" rel="noopener noreferrer" key={i}>
                                <img
                                    src={image}
                                    alt="hasExtraDocs"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    }}
                                />
                            </a>
                        </Grid>
                    ))
                }
            </Grid>
        </>
    )
}

export default ShowExtraDocModal;