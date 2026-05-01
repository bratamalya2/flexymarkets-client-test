import { Container, Stack, Typography } from "@mui/material";
import Marquee from "react-fast-marquee";

const MarqueeComponent = ({ message }) => {

  return (
    <Container sx={{ bgcolor: "#f0f087bd" }}>
      <Marquee pauseOnHover={true}>
        <Typography sx={{ p: "15px" }}>{message} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</Typography>
      </Marquee>
    </Container >
  )
};

export default MarqueeComponent;