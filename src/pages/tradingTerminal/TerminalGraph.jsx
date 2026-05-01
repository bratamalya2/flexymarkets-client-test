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
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>Please select a symbol</Typography>
            </Stack>
    );
}

export default memo(TradingViewWidget);














// import { useEffect, useRef, memo } from "react";
// import { Stack, Typography } from "@mui/material";
// import { useSelector } from "react-redux";

// function TradingViewAdvancedChart() {
//     const { selectedSymbol } = useSelector((state) => state.terminal);
//     const containerRef = useRef(null);

//     useEffect(() => {
//         if (!selectedSymbol || !containerRef.current) return;

//         containerRef.current.innerHTML = "";

//         const script1 = document.createElement("script");
//         script1.src = "/charting_library/charting_library.standalone.js";
//         script1.type = "text/javascript";

//         const script2 = document.createElement("script");
//         script2.src = "/datafeeds/udf/dist/bundle.js";
//         script2.type = "text/javascript";

//         const initChart = () => {
//             if (!window.TradingView || !window.Datafeeds) return;

//             // const datafeed = new window.Datafeeds.UDFCompatibleDatafeed(
//             //     "https://demo-feed-data.tradingview.com"
//             // );

//             const datafeed = [
//                 [
//                     1759487520,
//                     3859.72,
//                     3860.61,
//                     3859.51,
//                     3859.55
//                 ]
//             ]

//             const widget = (window.tvWidget = new window.TradingView.widget({
//                 fullscreen: false,
//                 symbol: "AAPL",
//                 interval: "D",
//                 container: containerRef.current,
//                 datafeed,
//                 library_path: "/charting_library/",
//                 locale: "en",
//                 time_frames: [
//                     { text: "50y", resolution: "6M" },
//                     { text: "3y", resolution: "W" },
//                     { text: "8m", resolution: "D" },
//                     { text: "2m", resolution: "D" },
//                     { text: "1m", resolution: "60" },
//                     { text: "1w", resolution: "30" },
//                     { text: "7d", resolution: "30" },
//                     { text: "5d", resolution: "10" },
//                     { text: "3d", resolution: "10" },
//                     { text: "2d", resolution: "5" },
//                     { text: "1d", resolution: "5" }
//                 ],
//                 disabled_features: [
//                     "save_chart_properties_to_local_storage",
//                     "volume_force_overlay",
//                 ],
//                 enabled_features: ["move_logo_to_main_pane", "study_templates"],
//                 overrides: {
//                     "mainSeriesProperties.style": 1,
//                     volumePaneSize: "tiny",
//                 },
//                 theme: "dark",
//                 autosize: true,
//             }));

//             widget.onChartReady(() => {
//                 console.log("TradingView chart ready!");

//                 const addBuySellLine = (price, type) => {
//                     const isBuy = type === "buy";
//                     const color = isBuy ? "#00FF00" : "#FF0000";
//                     const label = isBuy ? "BUY" : "SELL";

//                     widget.chart().createShape(
//                         { price },
//                         {
//                             shape: "horizontal_line",
//                             lock: false,
//                             disableSave: false,
//                             disableUndo: false,
//                             overrides: {
//                                 linecolor: color,
//                                 linewidth: 2,
//                                 linestyle: 0,
//                                 showLabel: true,
//                                 textcolor: color,
//                                 fontsize: 13,
//                                 bold: true,
//                                 horzLabelsAlign: "right",
//                                 vertLabelsAlign: "middle",
//                             },
//                             text: `${label} @ $${price}`,
//                         }
//                     );
//                 };

//                 const BUY_PRICES = [160, 165, 170];
//                 const SELL_PRICES = [150, 145, 140];

//                 BUY_PRICES.forEach((p) => addBuySellLine(p, "buy"));
//                 SELL_PRICES.forEach((p) => addBuySellLine(p, "sell"));

//                 widget.onContextMenu((time, price) => [
//                     {
//                         position: "top",
//                         text: `Add BUY line @ $${price.toFixed(2)}`,
//                         click: () => addBuySellLine(price, "buy"),
//                     },
//                     {
//                         position: "top",
//                         text: `Add SELL line @ $${price.toFixed(2)}`,
//                         click: () => addBuySellLine(price, "sell"),
//                     },
//                 ]);
//             });
//         };

//         script1.onload = () => {
//             document.body.appendChild(script2);
//             script2.onload = initChart;
//         };
//         document.body.appendChild(script1);

//         return () => {
//             containerRef.current.innerHTML = "";
//             if (window.tvWidget) {
//                 window.tvWidget.remove();
//             }
//         };
//     }, [selectedSymbol]);

//     return <div
//         ref={containerRef}
//         style={{ width: "100%", height: "100%", background: "#0F0F0F" }}
//     />
//     //   selectedSymbol ? 
//     //   (
//     //     <div
//     //       ref={containerRef}
//     //       style={{ width: "100%", height: "100%", background: "#0F0F0F" }}
//     //     />
//     //   ) 
//     //   : (
//     //     <Stack
//     //       sx={{
//     //         height: "100%",
//     //         justifyContent: "center",
//     //         alignItems: "center",
//     //       }}
//     //     >
//     //       <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
//     //         Please select a symbol
//     //       </Typography>
//     //     </Stack>
//     //   );
// }

// export default memo(TradingViewAdvancedChart);