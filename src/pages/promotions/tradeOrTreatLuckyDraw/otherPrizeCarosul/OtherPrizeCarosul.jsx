import Slider from "react-slick";
import "../../../../components/latest/latestNewsCarosul.css";
import {
  Container,
  useMediaQuery,
  useTheme,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { tradeOrTreatLuckyDrawCardsOtherPrizeDetails } from "../tradeOrTreatLuckyDrawCards/tradeOrTreatLuckyDrawCardsDetails";

function OtherPrizeCarosul() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const sliderHeight = matches ? 220 : 250;

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: matches ? 2 : 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <Container className="slider-container" sx={{ height: `${sliderHeight}px`, paddingLeft: 0, paddingRight: 0 }}>
      <Slider {...settings}>
        {tradeOrTreatLuckyDrawCardsOtherPrizeDetails?.map((item, index) => (
          <div key={index} className="slide-wrapper">
            <Stack
              className="slide-item"
              component="div"
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                p: 2,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
                boxSizing: "border-box",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                {item?.prizeLevel}
              </Typography>

              <Box
                component="img"
                src="/fxfavicon.ico"
                width="100%"
                sx={{
                  height: matches ? "110px" : "120px",
                  objectFit: "contain",
                  borderRadius: ".7rem",
                }}
                alt={item?.prizeType || `prize-${index}`}
              />

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {item?.prizeType}
              </Typography>
            </Stack>
          </div>
        ))}
      </Slider>
    </Container>
  );
}

export default OtherPrizeCarosul;