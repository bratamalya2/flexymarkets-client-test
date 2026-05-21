import { Stack, Typography } from '@mui/material';
import { useEffect, useRef, memo } from 'react';
import { useSelector } from 'react-redux';

function TradingViewWidget() {

    const { selectedSymbol } = useSelector(state => state.terminal)

    const container = useRef();

    useEffect(() => {

        if (!container.current) return;

        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
        {
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": false,
          "hide_top_toolbar": true,
          "hide_legend": false,
          "hide_volume": true,
          "hotlist": false,
          "interval": "5",
          "locale": "en",
          "save_image": false,
          "style": "1",
          "symbol": "OANDA:${selectedSymbol?.name}",
          "theme": "dark",
          "timezone": "Etc/UTC",
          "backgroundColor": "#0F0F0F",
          "gridColor": "rgba(242, 242, 242, 0.06)",
          "watchlist": [
            "OANDA:AUDJPY",
            "OANDA:AUDNZD",
            "OANDA:AUDUSD",
            "OANDA:CADCHF",
            "OANDA:CADJPY",
            "OANDA:CHFJPY",
            "OANDA:EURAUD",
            "OANDA:EURCAD",
            "OANDA:EURCHF",
            "OANDA:EURGBP",
            "OANDA:EURJPY",
            "OANDA:EURNZD",
            "OANDA:EURUSD",
            "OANDA:GBPAUD",
            "OANDA:GBPCAD",
            "OANDA:GBPCHF",
            "OANDA:GBPJPY",
            "OANDA:GBPNZD",
            "OANDA:GBPUSD",
            "OANDA:NZDCAD",
            "OANDA:NZDCHF",
            "OANDA:NZDJPY",
            "OANDA:NZDUSD",
            "OANDA:US30USD",
            "OANDA:USDCAD",
            "OANDA:USDCHF",
            "OANDA:USDJPY",
            "OANDA:USDNOK",
            "OANDA:XAGUSD",
            "OANDA:XAUUSD"
          ],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`;
        container.current.appendChild(script);
    },
        [selectedSymbol]
    );

    return (
        selectedSymbol
            ?
            <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
                <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
            </div>
            :
            <Stack sx={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>Loading...</Typography>
            </Stack>
    );
}

export default memo(TradingViewWidget);