import { Stack, Typography } from "@mui/material";
import { analystViewsFooterData } from "./analystViewsFooterData";

function AnalystViewsFooter() {
  return (
    <Stack sx={{ gap: ".7rem", mb: "2.5rem" }}>
      {
        analystViewsFooterData.map((data, i) => (
          <Typography key={i} fontSize={"13px"} color="textSecondary">{data}</Typography>
        ))
      }
    </Stack>
  )
}

export default AnalystViewsFooter;