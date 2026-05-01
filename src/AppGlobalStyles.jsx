import { GlobalStyles } from '@mui/material';

const AppGlobalStyles = ({ styleScrollBar }) => (
  <GlobalStyles
    styles={(theme) => ({
      '::-webkit-scrollbar': { width: '10px', height: '10px', ...styleScrollBar },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.main,
        borderRadius: '10px',
      },
      body: {
        overflowX: 'hidden',
        margin: 0,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
    })}
  />
);

export default AppGlobalStyles;