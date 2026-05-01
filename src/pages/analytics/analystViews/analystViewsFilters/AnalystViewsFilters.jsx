import { InputLabel, Box, useMediaQuery } from "@mui/material";
import { analystViewsFiltersData } from "./analystViewsFiltersData";
import Selector from "../../../../components/Selector";
import Grid from "@mui/material/Grid2";

function AnalystViewsFilters({ active }) {

    const matches = useMediaQuery('(min-width:500px)');

    return (
        <Box mt={"1.2rem"}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
                {
                    Object.entries(analystViewsFiltersData).map(([key, values], i) => (
                        values.for.includes(active) && (
                            <Grid key={i} item size={{ xs: 12, sm: 6, md: 3 }}>
                                <InputLabel sx={{ mb: ".5rem", fontSize: ".8rem" }}>{key}</InputLabel>
                                <Selector
                                    items={values.items}
                                    selected={values.items[0]}
                                    shouldBeFullWidth={true}
                                    showDefaultOption={false}
                                />
                            </Grid>
                        )
                    ))
                }
            </Grid>
        </Box>
    )
}

export default AnalystViewsFilters;