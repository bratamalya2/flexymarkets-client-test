// Standalone Test Suite for Frontend Trading Terminal Core Logic

// 1. Symbol Normalization Logic
function normalizeSymbol(s) {
    return s?.split('.')[0]?.toUpperCase() || "";
}

// 2. Candle Data Normalization Logic (Copied exactly from TerminalGraph.jsx)
function normalizeCandles(raw) {
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const first = raw[0];
    if (Array.isArray(first)) {
        return raw
            .map(c => ({ time: Number(c[0]), open: Number(c[1]), high: Number(c[2]), low: Number(c[3]), close: Number(c[4]) }))
            .filter(c => c.time > 0 && c.open > 0);
    }
    return raw
        .map(c => ({
            time: Number(c.time ?? c.Time ?? c.date ?? c.timestamp ?? 0),
            open: Number(c.open ?? c.Open),
            high: Number(c.high ?? c.High),
            low: Number(c.low ?? c.Low),
            close: Number(c.close ?? c.Close),
        }))
        .filter(c => c.time > 0 && !isNaN(c.open));
}

// 3. Timezone Dynamic Offset Alignment Logic (Mocks TerminalGraph.jsx logic)
function calculateCandleTime(nowSec, candleSec, prevCandleTime, prevOffset) {
    const clientCandleTime = Math.floor(nowSec / candleSec) * candleSec;
    const timezoneOffset = prevOffset !== undefined ? prevOffset : prevCandleTime - clientCandleTime;
    return {
        timezoneOffset,
        candleTime: clientCandleTime + timezoneOffset
    };
}

// ================= TEST RUNNER =================
const assertions = [];
function assert(name, condition) {
    if (condition) {
        assertions.push({ name, status: 'PASS' });
    } else {
        assertions.push({ name, status: 'FAIL' });
        console.error(`Assertion failed: ${name}`);
    }
}

console.log("==========================================");
console.log("RUNNING TRADING TERMINAL LOGIC TEST SUITE");
console.log("==========================================\n");

// --- Test Suite 1: Symbol Normalization ---
console.log("Testing: Symbol Normalization");
assert("Normalize simple symbol", normalizeSymbol("eurusd") === "EURUSD");
assert("Normalize symbol with dot suffix (.a)", normalizeSymbol("EURUSD.a") === "EURUSD");
assert("Normalize symbol with raw suffix (.raw)", normalizeSymbol("GBPUSD.raw") === "GBPUSD");
assert("Normalize symbol with numeric suffix (.123)", normalizeSymbol("BTCUSD.123") === "BTCUSD");
assert("Normalize already uppercase symbol", normalizeSymbol("XAUUSD") === "XAUUSD");
assert("Normalize empty or undefined handles gracefully", normalizeSymbol(null) === "");

// --- Test Suite 2: Candle Data Normalization ---
console.log("Testing: Candle Data Normalization");

const rawArrayOfArrays = [
    [1779444000, 1.0850, 1.0860, 1.0840, 1.0855],
    [1779444060, 1.0855, 1.0865, 1.0850, 1.0860]
];
const normalizedArrays = normalizeCandles(rawArrayOfArrays);
assert("Parse array of arrays time", normalizedArrays[0].time === 1779444000);
assert("Parse array of arrays open", normalizedArrays[0].open === 1.0850);
assert("Parse array of arrays close", normalizedArrays[1].close === 1.0860);

const rawArrayOfObjects = [
    { time: 1779444000, open: 1.0850, high: 1.0860, low: 1.0840, close: 1.0855 },
    { Time: 1779444060, Open: 1.0855, High: 1.0865, Low: 1.0850, Close: 1.0860 }
];
const normalizedObjects = normalizeCandles(rawArrayOfObjects);
assert("Parse objects with lowercase keys", normalizedObjects[0].time === 1779444000);
assert("Parse objects with uppercase keys", normalizedObjects[1].time === 1779444060);
assert("Parse objects open price", normalizedObjects[1].open === 1.0855);

const rawDirtyData = [
    { time: 0, open: 1.0850 }, // Invalid time
    { time: 1779444000, open: NaN } // Invalid price
];
assert("Filter out invalid/dirty candles", normalizeCandles(rawDirtyData).length === 0);

// --- Test Suite 3: Timeframe Configuration Verification ---
console.log("Testing: Timeframe Constants");
const TIMEFRAMES = [
    { label: '1M',  period: 1,     candleSec: 60 },
    { label: '5M',  period: 5,     candleSec: 300 },
    { label: '1H',  period: 60,    candleSec: 3600 },
    { label: '4H',  period: 240,   candleSec: 14400 },
    { label: '1D',  period: 1440,  candleSec: 86400 }
];

TIMEFRAMES.forEach(tf => {
    assert(`Period match for ${tf.label}`, tf.period * 60 === tf.candleSec);
});

// --- Test Suite 4: Dynamic Timezone Alignment ---
console.log("Testing: Timezone Offset Alignment");

// Scenario: Client is in UTC, MT5 Server is in UTC+3 (10800 seconds offset)
const clientTime = 1779444000; // Client current time
const mt5Time = clientTime + 10800; // Server current time
const candleSec = 60; // 1M

// First tick establishes the timezone offset from the last historical candle time
const resFirst = calculateCandleTime(clientTime, candleSec, mt5Time, undefined);
assert("Establish server timezone offset correctly (+3 hours)", resFirst.timezoneOffset === 10800);
assert("Align first tick candle time with server time", resFirst.candleTime === mt5Time);

// Subsequent ticks use the established offset to remain aligned
const clientTimeLater = clientTime + 30; // 30 seconds later (same candle)
const resLater = calculateCandleTime(clientTimeLater, candleSec, mt5Time, resFirst.timezoneOffset);
assert("Retain timezone offset for subsequent ticks", resLater.timezoneOffset === 10800);
assert("Keep tick in the same candle window", resLater.candleTime === mt5Time);

const clientTimeNextCandle = clientTime + 65; // 65 seconds later (next candle)
const resNext = calculateCandleTime(clientTimeNextCandle, candleSec, mt5Time, resFirst.timezoneOffset);
assert("Advance to next candle window seamlessly with offset", resNext.candleTime === mt5Time + 60);

// ================= RESULTS =================
console.log("\n==========================================");
console.log("TEST RESULTS SUMMARY");
console.log("==========================================");
const passed = assertions.filter(a => a.status === 'PASS').length;
const failed = assertions.filter(a => a.status === 'FAIL').length;
console.log(`Passed: ${passed} / ${assertions.length}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
} else {
    console.log("All tests passed successfully!");
    process.exit(0);
}
