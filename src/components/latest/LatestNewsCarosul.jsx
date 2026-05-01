import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./latestNewsCarosul.css";
import { Container, useMediaQuery, useTheme } from '@mui/material';

function LatestNewsCarosul({ isKycVerified }) {

  const theme = useTheme()

  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <Container
      sx={{
        mt: isKycVerified ? "30px" : 0,
        mb: !isKycVerified ? "30px" : 0,
        borderRadius: "10px"
      }}
    >
      <Slider {...settings}>
        {
          (
            matches
              ?
              ['/bannerMobile1.jpg', '/bannerMobile2.jpg', '/bannerMobile3.jpg']
              :
              ['/banner1.jpg', '/banner2.jpg', '/banner3.jpg']
          ).map((src, index) => (
            <div key={index}>
              <img
                src={src}
                alt={`banner-${index + 1}`}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  display: "block"
                }}
              />
            </div>
          ))}
      </Slider>
    </Container>
  );
}

export default LatestNewsCarosul;