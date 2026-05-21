import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Stack,
  Skeleton,
  Alert,
  useMediaQuery
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SecondTraderSlider, TraderSliders } from './recommendSlider.jsx';
import { useMasterTraderListQuery } from '../../../globalState/socialTrading/socialTradingApis.js';
import { TraderCard } from './TraderCard.jsx';

// --- GrowthBanner component (unchanged) ---
const GrowthBanner = ({ bannerData }) => {
  const theme = useTheme();
  
  const {
    title = "Growth Shield",
    description = "Earn up to 100% p.a. of investment. Cover up to 20% loss from copying. You keep the earnings, we subsidize the losses.",
    percentageText = "up to 100% p.a.",
    termsText = "TnC Apply",
    icon: BannerIcon = CardGiftcardIcon,
    iconColor = "error"
  } = bannerData || {};

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="700">{title}</Typography>
        <IconButton size="small"><InfoOutlinedIcon fontSize="small" color="action" /></IconButton>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`
            : 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          border: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <Box sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          borderRadius: '50%',
          boxShadow: theme.shadows[2],
          display: { xs: 'none', sm: 'block' }
        }}>
          <BannerIcon color={iconColor} sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {description.split(percentageText).map((part, index, array) => {
            if (index < array.length - 1) {
              return (
                <React.Fragment key={index}>
                  {part}
                  <Typography 
                    component="span" 
                    fontWeight="800" 
                    color="error.main" 
                    sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), px: 1, borderRadius: 1 }}
                  >
                    {percentageText}
                  </Typography>
                </React.Fragment>
              );
            }
            return part;
          })}
          <Typography component="span" variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>{termsText}</Typography>
        </Typography>
      </Paper>
    </Box>
  );
};

// --- Main TradingDashboardLayout component ---
const TradingDashboardLayout = ({ 
  config = {
    rowsPerPage: 12,
    chartTimeframe: "30D",
    cardPadding: 1.5,
    transitionDuration: 0.5,
    skeletonHeight: 320,
    skeletonCount: 3,
    breakpoints: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    banner: {
      title: "Growth Shield",
      description: "Earn up to 100% p.a. of investment. Cover up to 20% loss from copying. You keep the earnings, we subsidize the losses.",
      percentageText: "up to 100% p.a.",
      termsText: "TnC Apply"
    }
  }
}) => {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const cardsToShow = isMobile ? config.breakpoints.mobile : isTablet ? config.breakpoints.tablet : config.breakpoints.desktop;

  const { data, isLoading, isError, error } = useMasterTraderListQuery({
    page: page,
    sizePerPage: config.rowsPerPage,
    chartTimeframe: config.chartTimeframe
  });

  const traders = data?.data?.masterTraders || [];
  const totalRecords = data?.data?.totalRecords || 0;
  const totalPages = data?.data?.totalPages || 1;
  const currentPage = data?.data?.currentPage || 1;

  useEffect(() => {
    setIndex(0);
  }, [cardsToShow]);

  const maxIndex = Math.max(0, traders.length - cardsToShow);

  const handleNext = () => {
    if (index < maxIndex) {
      setIndex((prev) => prev + 1);
    } else if (page < totalPages) {
      setPage((prev) => prev + 1);
      setIndex(0);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    } else if (page > 1) {
      setPage((prev) => prev - 1);
      setIndex(Math.max(0, config.rowsPerPage - cardsToShow));
    }
  };

  const renderSkeletons = () => {
    const skeletonCount = config.skeletonCount || 3;
    return (
      <Box sx={{ overflow: 'hidden', mx: -2, px: 1 }}>
        <Stack direction="row" spacing={2}>
          {[...Array(skeletonCount)].map((_, i) => (
            <Skeleton 
              key={i} 
              variant="rectangular" 
              height={config.skeletonHeight} 
              width={`${100 / cardsToShow}%`} 
              sx={{ borderRadius: 4, flexShrink: 0 }} 
            />
          ))}
        </Stack>
      </Box>
    );
  };

  const renderError = () => {
    const errorMessage = error?.data?.message || "Failed to load traders";
    return <Alert severity="error">{errorMessage}</Alert>;
  };

  const isBackDisabled = page === 1 && index === 0;
  const isNextDisabled = page >= totalPages && index >= maxIndex;

  return (
    <Box sx={{ 
      bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f4f6f8', 
      minHeight: '100vh', 
      py: 6 
    }}>
      <Container maxWidth="lg">
        <GrowthBanner bannerData={config.banner} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          {totalRecords > 0 && (
            <Typography variant="body2" color="text.secondary">
              Showing {((currentPage - 1) * config.rowsPerPage) + 1} - {Math.min(currentPage * config.rowsPerPage, totalRecords)} of {totalRecords} traders
            </Typography>
          )}
          
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={handleBack} 
              disabled={isBackDisabled || isLoading} 
              sx={{ border: '1px solid', borderColor: theme.palette.divider }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={handleNext} 
              disabled={isNextDisabled || isLoading} 
              sx={{ border: '1px solid', borderColor: theme.palette.divider }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {isLoading ? (
          renderSkeletons()
        ) : isError ? (
          renderError()
        ) : traders.length > 0 ? (
          <Box sx={{ overflow: 'hidden', mx: -2, px: 2, pb: 2 }}>
            <Box sx={{
              display: 'flex',
              transition: `transform ${config.transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
              transform: `translateX(-${index * (100 / cardsToShow)}%)`,
              width: '100%'
            }}>
              {traders.map((trader, i) => (
                <Box
                  key={trader.id || `trader-${i}`}
                  sx={{
                    minWidth: `${100 / cardsToShow}%`,
                    maxWidth: `${100 / cardsToShow}%`,
                    boxSizing: 'border-box',
                    padding: config.cardPadding
                  }}
                >
                  <TraderCard 
                    data={trader} 
                    rank={((currentPage - 1) * config.rowsPerPage) + i + 1} 
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Alert severity="info">No traders available</Alert>
        )}

        <TraderSliders />
        <SecondTraderSlider />
      </Container>
    </Box>
  );
};

export default TradingDashboardLayout;