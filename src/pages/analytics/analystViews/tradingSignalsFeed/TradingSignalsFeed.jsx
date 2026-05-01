import { Box, Typography, Stack } from "@mui/material";
import { tradingSignalsFeedData } from "./tradingSignalsFeedData";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SearchPanel from "../../../../components/SearchPanel";

const sentimentColors = {
  bullish: "#18c05b",
  bearish: "#c13b34",
  caution: "orange",
};

const getSentimentIcon = (sentimentType) => {
  switch (sentimentType) {
    case "bullish":
      return <ArrowCircleUpIcon sx={{ color: sentimentColors.bullish, fontSize: 20 }} />;
    case "bearish":
      return <ArrowCircleDownIcon sx={{ color: sentimentColors.bearish, fontSize: 20 }} />;
    case "caution":
      return <ReportProblemIcon sx={{ color: sentimentColors.caution, fontSize: 20 }} />;
    default:
      return null;
  }
};

function TradingSignalsFeed({ onSelectSignal }) {
  return (
    <Stack mt={"2rem"} gap={"1.2rem"}>
      <Stack>
        <SearchPanel width={"100%"} placeholder={"Search the results"} />
      </Stack>
      <Stack sx={{ width: "100%", height: 800, overflow: "auto" }}>
        <Box sx={{ pr: ".5rem" }}>
          {tradingSignalsFeedData.map((item, index) => (
            <Box key={index}>
              <Stack onClick={() => onSelectSignal(item)} sx={{ pb: 2, cursor: "pointer" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={".3rem"}>
                  <Typography fontSize="16px" color="textPrimary">
                    {item.pair}
                  </Typography>
                  <Typography fontSize="14px" color="textSecondary">
                    {item.time}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {getSentimentIcon(item.sentimentType)}
                  <Typography variant="body1" sx={{ color: sentimentColors[item.sentimentType] || "black" }}>
                    {item.sentiment}
                  </Typography>
                </Stack>

                <Typography color="textPrimary">{item.action}</Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}

export default TradingSignalsFeed;