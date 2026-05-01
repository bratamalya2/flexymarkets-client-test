import { Stack, Typography, Box, Divider, Button, Skeleton } from "@mui/material";
import { useGetEconomicCalenderDataQuery } from "../../globalState/userState/userStateApis";
import { Fragment } from "react";

function TerminalCalendarComponent() {

  const { data, isLoading, refetch } = useGetEconomicCalenderDataQuery()

  const handleRefetch = () => {
    refetch()
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High": return "green";
      case "Medium": return "yellow";
      case "Low": return "red";
      default: return "blue";
    }
  };


  return (
    <Stack
      sx={{
        overflow: "auto",
        width: "350px",
        // pl: "60px",
        bgcolor: "#292929",
        // mt: {
        //   xs: "56px",
        //   sm: "64px"
        // },
        "&::-webkit-scrollbar": {
          height: "5px",
        },
      }}
    >
      <Box sx={{ p: "1rem", position: "sticky", top: 0, bgcolor: "#292929", zIndex: 1 }}>
        <Typography fontSize={"1.2rem"}>Economic calendar</Typography>
        <Button onClick={handleRefetch} fullWidth sx={{ border: theme => `1px solid ${theme.palette.primary.main}`, mt: "10px" }}>Reload</Button>
      </Box>
      <Divider sx={{ height: "3px" }} />
      {
        isLoading
          ?
          [...Array(5)].map((_, i) => (
            <Stack sx={{ p: "1rem", wordBreak: "normal", gap: "5px" }} key={i}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Skeleton width={"25%"} />
                <Skeleton width={"25%"} />
              </Box>
              <Skeleton />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton width={"25%"} />
                <Skeleton width={"25%"} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton width={"25%"} />
                <Skeleton width={"25%"} />
              </Box>
              <Skeleton />
            </Stack>
          ))
          :
          data?.data?.map(item => (
            <Fragment key={item.title}>
              <Stack sx={{ p: "1rem", wordBreak: "normal", gap: "5px" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography color="white">
                    {item.title}
                  </Typography>
                  <Typography color={getImpactColor(item.impact)}>
                    {item.impact}
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  {item.country}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">
                    Previous :
                  </Typography>
                  <Typography color="text.secondary">
                    {item.previous || "NA"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">
                    Forecast :
                  </Typography>
                  <Typography color="text.secondary">
                    {item.forecast || "NA"}
                  </Typography>
                </Box>
                <Typography color="text.secondary" fontSize={"12px"}>
                  {new Date(item.date).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                </Typography>
              </Stack>
              <Divider sx={{ height: "3px" }} />
            </Fragment>
          ))
      }
    </Stack>
  )
}

export default TerminalCalendarComponent;