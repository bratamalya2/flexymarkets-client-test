export const ANALYSIS_TIMEFRAMES = [
    { label: "1M", period: 1, range: 3 * 24 * 60 * 60 },
    { label: "5M", period: 5, range: 7 * 24 * 60 * 60 },
    { label: "15M", period: 15, range: 15 * 24 * 60 * 60 },
    { label: "30M", period: 30, range: 30 * 24 * 60 * 60 },
    { label: "1H", period: 60, range: 90 * 24 * 60 * 60 },
];

const round = (value, digits = 5) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return null;
    return Number(number.toFixed(digits));
};

const formatValue = (value, digits = 5) => {
    const rounded = round(value, digits);
    if (rounded === null) return "-";
    return String(rounded);
};

const parseNumber = (value) => {
    const number = Number(String(value ?? "").replace(/,/g, ""));
    return Number.isFinite(number) ? number : NaN;
};

const parseTime = (value) => {
    if (value === undefined || value === null || value === "") return 0;

    const numericTime = Number(value);
    if (Number.isFinite(numericTime)) {
        return numericTime > 9999999999 ? Math.floor(numericTime / 1000) : numericTime;
    }

    const rawTime = String(value).trim();
    const mt5Date = rawTime.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (mt5Date) {
        const [, year, month, day, hour = "0", minute = "0", second = "0"] = mt5Date;
        return Math.floor(Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
        ) / 1000);
    }

    const parsed = Date.parse(rawTime);
    return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : 0;
};

const getValue = (row, keys) => {
    const key = keys.find((candidate) => row?.[candidate] !== undefined);
    return key !== undefined ? row[key] : undefined;
};

const finalizeCandle = ({ time, open, high, low, close, volume }) => ({
    time,
    open,
    high: Math.max(high, open, close),
    low: Math.min(low, open, close),
    close,
    volume: Number.isFinite(volume) ? volume : null,
});

export function normalizeAnalysisCandles(raw) {
    const rows = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.answer)
            ? raw.answer
            : Array.isArray(raw?.data)
                ? raw.data
                : [];

    if (rows.length === 0) return [];

    const first = rows[0];
    if (typeof first === "string" && first.includes(",")) {
        return rows
            .map((row) => String(row).split(","))
            .map((c) => finalizeCandle({
                time: parseTime(c[0]),
                open: parseNumber(c[1]),
                high: parseNumber(c[2]),
                low: parseNumber(c[3]),
                close: parseNumber(c[4]),
                volume: parseNumber(c[5]),
            }))
            .filter((c) => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
    }

    if (!Array.isArray(first) && typeof first !== "object" && rows.length >= 5) {
        const chunkSize = rows.length % 6 === 0 ? 6 : 5;
        const chunkedRows = [];
        for (let index = 0; index <= rows.length - chunkSize; index += chunkSize) {
            chunkedRows.push(rows.slice(index, index + chunkSize));
        }

        return chunkedRows
            .map((c) => finalizeCandle({
                time: parseTime(c[0]),
                open: parseNumber(c[1]),
                high: parseNumber(c[2]),
                low: parseNumber(c[3]),
                close: parseNumber(c[4]),
                volume: parseNumber(c[5]),
            }))
            .filter((c) => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
    }

    if (Array.isArray(first)) {
        return rows
            .map((c) => {
                const time = parseTime(c[0]);
                const open = parseNumber(c[1]);
                const high = parseNumber(c[2]);
                const low = parseNumber(c[3]);
                const close = parseNumber(c[4]);
                const volume = parseNumber(c[5]);

                if (high < low) {
                    return finalizeCandle({
                        time,
                        high: parseNumber(c[1]),
                        low: parseNumber(c[2]),
                        open: parseNumber(c[3]),
                        close,
                        volume,
                    });
                }

                return finalizeCandle({ time, open, high, low, close, volume });
            })
            .filter((c) => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
    }

    return rows
        .map((c) => finalizeCandle({
            time: parseTime(getValue(c, ["time", "Time", "TIME", "date", "Date", "DATE", "datetime", "DateTime", "DATETIME", "timestamp", "Timestamp", "TIMESTAMP"])),
            open: parseNumber(getValue(c, ["open", "Open", "OPEN", "o", "O"])),
            high: parseNumber(getValue(c, ["high", "High", "HIGH", "h", "H"])),
            low: parseNumber(getValue(c, ["low", "Low", "LOW", "l", "L"])),
            close: parseNumber(getValue(c, ["close", "Close", "CLOSE", "c", "C"])),
            volume: parseNumber(getValue(c, ["volume", "Volume", "tick_volume", "TickVolume", "VolumeTick", "real_volume", "RealVolume"])),
        }))
        .filter((c) => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
}

const last = (values) => values[values.length - 1] ?? null;

const sliceLast = (values, period) => values.slice(Math.max(0, values.length - period));

const average = (values) => {
    const valid = values.filter(Number.isFinite);
    if (!valid.length) return null;
    return valid.reduce((sum, value) => sum + value, 0) / valid.length;
};

const standardDeviation = (values) => {
    const mean = average(values);
    if (mean === null) return null;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
};

const highest = (candles, period, key = "high") => {
    const values = sliceLast(candles, period).map((candle) => candle[key]).filter(Number.isFinite);
    return values.length ? Math.max(...values) : null;
};

const lowest = (candles, period, key = "low") => {
    const values = sliceLast(candles, period).map((candle) => candle[key]).filter(Number.isFinite);
    return values.length ? Math.min(...values) : null;
};

const sma = (values, period) => {
    if (values.length < period) return null;
    return average(values.slice(values.length - period));
};

const emaSeries = (values, period) => {
    if (values.length < period) return [];
    const multiplier = 2 / (period + 1);
    const output = Array(values.length).fill(null);
    let previous = average(values.slice(0, period));
    output[period - 1] = previous;

    for (let index = period; index < values.length; index += 1) {
        previous = (values[index] - previous) * multiplier + previous;
        output[index] = previous;
    }

    return output;
};

const wma = (values, period) => {
    if (values.length < period) return null;
    const subset = values.slice(values.length - period);
    const denominator = (period * (period + 1)) / 2;
    return subset.reduce((sum, value, index) => sum + value * (index + 1), 0) / denominator;
};

const wmaSeries = (values, period) => values.map((_, index) => wma(values.slice(0, index + 1), period));

const hma = (values, period) => {
    if (values.length < period) return null;
    const half = Math.floor(period / 2);
    const sqrtPeriod = Math.max(1, Math.floor(Math.sqrt(period)));
    const fullWma = wmaSeries(values, period);
    const halfWma = wmaSeries(values, half);
    const diff = values.map((_, index) => {
        if (!Number.isFinite(fullWma[index]) || !Number.isFinite(halfWma[index])) return null;
        return 2 * halfWma[index] - fullWma[index];
    }).filter(Number.isFinite);
    return wma(diff, sqrtPeriod);
};

const trueRangeSeries = (candles) => candles.map((candle, index) => {
    if (index === 0) return candle.high - candle.low;
    const previousClose = candles[index - 1].close;
    return Math.max(
        candle.high - candle.low,
        Math.abs(candle.high - previousClose),
        Math.abs(candle.low - previousClose)
    );
});

const atrSeries = (candles, period = 14) => {
    const ranges = trueRangeSeries(candles);
    if (ranges.length < period) return [];
    const output = Array(ranges.length).fill(null);
    let previous = average(ranges.slice(0, period));
    output[period - 1] = previous;
    for (let index = period; index < ranges.length; index += 1) {
        previous = ((previous * (period - 1)) + ranges[index]) / period;
        output[index] = previous;
    }
    return output;
};

const rsiSeries = (values, period = 14) => {
    if (values.length <= period) return [];
    const output = Array(values.length).fill(null);
    let gains = 0;
    let losses = 0;

    for (let index = 1; index <= period; index += 1) {
        const change = values[index] - values[index - 1];
        if (change >= 0) gains += change;
        else losses += Math.abs(change);
    }

    let averageGain = gains / period;
    let averageLoss = losses / period;
    output[period] = averageLoss === 0 ? 100 : 100 - (100 / (1 + averageGain / averageLoss));

    for (let index = period + 1; index < values.length; index += 1) {
        const change = values[index] - values[index - 1];
        averageGain = ((averageGain * (period - 1)) + Math.max(change, 0)) / period;
        averageLoss = ((averageLoss * (period - 1)) + Math.max(-change, 0)) / period;
        output[index] = averageLoss === 0 ? 100 : 100 - (100 / (1 + averageGain / averageLoss));
    }

    return output;
};

const macd = (values) => {
    const fast = emaSeries(values, 12);
    const slow = emaSeries(values, 26);
    const macdLine = values.map((_, index) => (
        Number.isFinite(fast[index]) && Number.isFinite(slow[index]) ? fast[index] - slow[index] : null
    ));
    const validMacd = macdLine.filter(Number.isFinite);
    const signalValues = emaSeries(validMacd, 9);
    const latestMacd = last(validMacd);
    const latestSignal = last(signalValues.filter(Number.isFinite));
    return {
        line: latestMacd,
        signal: latestSignal,
        histogram: Number.isFinite(latestMacd) && Number.isFinite(latestSignal) ? latestMacd - latestSignal : null,
    };
};

const stochastic = (candles, period = 14, signalPeriod = 3) => {
    if (candles.length < period) return null;
    const kSeries = candles.map((_, index) => {
        if (index + 1 < period) return null;
        const window = candles.slice(index + 1 - period, index + 1);
        const high = Math.max(...window.map((candle) => candle.high));
        const low = Math.min(...window.map((candle) => candle.low));
        if (high === low) return 50;
        return ((candles[index].close - low) / (high - low)) * 100;
    });
    const validK = kSeries.filter(Number.isFinite);
    return {
        k: last(validK),
        d: sma(validK, signalPeriod),
    };
};

const stochRsi = (values, period = 14) => {
    const rsi = rsiSeries(values, period).filter(Number.isFinite);
    if (rsi.length < period) return null;
    const window = sliceLast(rsi, period);
    const min = Math.min(...window);
    const max = Math.max(...window);
    if (max === min) return 50;
    return ((last(rsi) - min) / (max - min)) * 100;
};

const cci = (candles, period = 20) => {
    if (candles.length < period) return null;
    const typicalPrices = candles.map((candle) => (candle.high + candle.low + candle.close) / 3);
    const window = sliceLast(typicalPrices, period);
    const mean = average(window);
    const meanDeviation = average(window.map((value) => Math.abs(value - mean)));
    if (!meanDeviation) return null;
    return (last(typicalPrices) - mean) / (0.015 * meanDeviation);
};

const williamsR = (candles, period = 14) => {
    const high = highest(candles, period);
    const low = lowest(candles, period);
    const close = last(candles)?.close;
    if (high === null || low === null || high === low) return null;
    return ((high - close) / (high - low)) * -100;
};

const roc = (values, period = 12) => {
    if (values.length <= period) return null;
    const current = last(values);
    const previous = values[values.length - 1 - period];
    if (!previous) return null;
    return ((current - previous) / previous) * 100;
};

const momentum = (values, period = 10) => {
    if (values.length <= period) return null;
    return last(values) - values[values.length - 1 - period];
};

const awesomeOscillator = (candles) => {
    if (candles.length < 34) return null;
    const median = candles.map((candle) => (candle.high + candle.low) / 2);
    return sma(median, 5) - sma(median, 34);
};

const adx = (candles, period = 14) => {
    if (candles.length <= period * 2) return null;
    const trs = trueRangeSeries(candles);
    const plusDm = [0];
    const minusDm = [0];

    for (let index = 1; index < candles.length; index += 1) {
        const upMove = candles[index].high - candles[index - 1].high;
        const downMove = candles[index - 1].low - candles[index].low;
        plusDm.push(upMove > downMove && upMove > 0 ? upMove : 0);
        minusDm.push(downMove > upMove && downMove > 0 ? downMove : 0);
    }

    const plusDiSeries = [];
    const minusDiSeries = [];
    const dxSeries = [];
    for (let index = period; index < candles.length; index += 1) {
        const tr = average(trs.slice(index + 1 - period, index + 1)) * period;
        const plus = average(plusDm.slice(index + 1 - period, index + 1)) * period;
        const minus = average(minusDm.slice(index + 1 - period, index + 1)) * period;
        const plusDi = tr ? (plus / tr) * 100 : 0;
        const minusDi = tr ? (minus / tr) * 100 : 0;
        const dx = (plusDi + minusDi) ? (Math.abs(plusDi - minusDi) / (plusDi + minusDi)) * 100 : 0;
        plusDiSeries.push(plusDi);
        minusDiSeries.push(minusDi);
        dxSeries.push(dx);
    }

    return {
        adx: sma(dxSeries, period),
        plusDi: last(plusDiSeries),
        minusDi: last(minusDiSeries),
    };
};

const bollingerBands = (values, period = 20, multiplier = 2) => {
    if (values.length < period) return null;
    const window = sliceLast(values, period);
    const basis = average(window);
    const deviation = standardDeviation(window);
    return {
        upper: basis + deviation * multiplier,
        basis,
        lower: basis - deviation * multiplier,
        width: basis ? ((deviation * multiplier * 2) / basis) * 100 : null,
    };
};

const keltnerChannels = (candles, values, period = 20, multiplier = 2) => {
    const middle = last(emaSeries(values, period).filter(Number.isFinite));
    const atr = last(atrSeries(candles, 10).filter(Number.isFinite));
    if (!Number.isFinite(middle) || !Number.isFinite(atr)) return null;
    return {
        upper: middle + atr * multiplier,
        middle,
        lower: middle - atr * multiplier,
    };
};

const donchianChannels = (candles, period = 20) => {
    const upper = highest(candles, period);
    const lower = lowest(candles, period);
    if (upper === null || lower === null) return null;
    return {
        upper,
        lower,
        middle: (upper + lower) / 2,
    };
};

const parabolicSar = (candles, step = 0.02, maxStep = 0.2) => {
    if (candles.length < 5) return null;
    let rising = candles[1].close >= candles[0].close;
    let sar = rising ? candles[0].low : candles[0].high;
    let extreme = rising ? candles[0].high : candles[0].low;
    let acceleration = step;

    for (let index = 1; index < candles.length; index += 1) {
        sar += acceleration * (extreme - sar);
        const candle = candles[index];

        if (rising) {
            if (candle.low < sar) {
                rising = false;
                sar = extreme;
                extreme = candle.low;
                acceleration = step;
            } else if (candle.high > extreme) {
                extreme = candle.high;
                acceleration = Math.min(acceleration + step, maxStep);
            }
        } else if (candle.high > sar) {
            rising = true;
            sar = extreme;
            extreme = candle.high;
            acceleration = step;
        } else if (candle.low < extreme) {
            extreme = candle.low;
            acceleration = Math.min(acceleration + step, maxStep);
        }
    }

    return { value: sar, trend: rising ? "up" : "down" };
};

const supertrend = (candles, period = 10, multiplier = 3) => {
    const atr = atrSeries(candles, period);
    if (!atr.length) return null;
    let finalUpper = null;
    let finalLower = null;
    let trend = "up";
    let value = null;

    for (let index = 0; index < candles.length; index += 1) {
        if (!Number.isFinite(atr[index])) continue;
        const hl2 = (candles[index].high + candles[index].low) / 2;
        const basicUpper = hl2 + multiplier * atr[index];
        const basicLower = hl2 - multiplier * atr[index];
        const previousClose = candles[index - 1]?.close ?? candles[index].close;

        finalUpper = finalUpper === null || basicUpper < finalUpper || previousClose > finalUpper ? basicUpper : finalUpper;
        finalLower = finalLower === null || basicLower > finalLower || previousClose < finalLower ? basicLower : finalLower;

        if (trend === "down" && candles[index].close > finalUpper) trend = "up";
        else if (trend === "up" && candles[index].close < finalLower) trend = "down";

        value = trend === "up" ? finalLower : finalUpper;
    }

    return { value, trend };
};

const ichimoku = (candles) => {
    if (candles.length < 52) return null;
    const tenkan = (highest(candles, 9) + lowest(candles, 9)) / 2;
    const kijun = (highest(candles, 26) + lowest(candles, 26)) / 2;
    const spanA = (tenkan + kijun) / 2;
    const spanB = (highest(candles, 52) + lowest(candles, 52)) / 2;
    return { tenkan, kijun, spanA, spanB };
};

const pivotPoints = (candles) => {
    if (candles.length < 2) return null;
    const previous = candles[candles.length - 2];
    const pivot = (previous.high + previous.low + previous.close) / 3;
    return {
        pivot,
        r1: (2 * pivot) - previous.low,
        s1: (2 * pivot) - previous.high,
        r2: pivot + (previous.high - previous.low),
        s2: pivot - (previous.high - previous.low),
    };
};

const supportResistance = (candles) => {
    const window = sliceLast(candles, 60);
    if (window.length < 10) return null;
    return {
        resistance: Math.max(...window.map((candle) => candle.high)),
        support: Math.min(...window.map((candle) => candle.low)),
        swingHigh: highest(candles, 10),
        swingLow: lowest(candles, 10),
    };
};

const volumeWindow = (candles, period) => {
    const window = sliceLast(candles, period);
    if (window.length < period || !window.every((candle) => Number.isFinite(candle.volume) && candle.volume > 0)) return null;
    return window;
};

const typicalPrice = (candle) => (candle.high + candle.low + candle.close) / 3;

const vwap = (candles, period = 20) => {
    const window = volumeWindow(candles, period);
    if (!window) return null;
    const totalVolume = window.reduce((sum, candle) => sum + candle.volume, 0);
    if (!totalVolume) return null;
    return window.reduce((sum, candle) => sum + typicalPrice(candle) * candle.volume, 0) / totalVolume;
};

const vwma = (candles, period = 20) => {
    const window = volumeWindow(candles, period);
    if (!window) return null;
    const totalVolume = window.reduce((sum, candle) => sum + candle.volume, 0);
    if (!totalVolume) return null;
    return window.reduce((sum, candle) => sum + candle.close * candle.volume, 0) / totalVolume;
};

const obv = (candles) => {
    const validCandles = candles.filter((candle) => Number.isFinite(candle.volume) && candle.volume > 0);
    if (validCandles.length < 20) return null;
    const values = [0];
    for (let index = 1; index < validCandles.length; index += 1) {
        const current = validCandles[index];
        const previous = validCandles[index - 1];
        const direction = current.close > previous.close ? 1 : current.close < previous.close ? -1 : 0;
        values.push(values[index - 1] + direction * current.volume);
    }
    return { current: last(values), previous: values[Math.max(0, values.length - 10)] };
};

const moneyFlowIndex = (candles, period = 14) => {
    const window = volumeWindow(candles, period + 1);
    if (!window) return null;
    let positiveFlow = 0;
    let negativeFlow = 0;

    for (let index = 1; index < window.length; index += 1) {
        const currentTypical = typicalPrice(window[index]);
        const previousTypical = typicalPrice(window[index - 1]);
        const rawFlow = currentTypical * window[index].volume;
        if (currentTypical > previousTypical) positiveFlow += rawFlow;
        if (currentTypical < previousTypical) negativeFlow += rawFlow;
    }

    if (!negativeFlow) return 100;
    return 100 - (100 / (1 + (positiveFlow / negativeFlow)));
};

const chaikinMoneyFlow = (candles, period = 20) => {
    const window = volumeWindow(candles, period);
    if (!window) return null;
    const totalVolume = window.reduce((sum, candle) => sum + candle.volume, 0);
    if (!totalVolume) return null;
    const moneyFlowVolume = window.reduce((sum, candle) => {
        const range = candle.high - candle.low;
        const multiplier = range === 0 ? 0 : ((candle.close - candle.low) - (candle.high - candle.close)) / range;
        return sum + multiplier * candle.volume;
    }, 0);
    return moneyFlowVolume / totalVolume;
};

const accumulationDistribution = (candles) => {
    const validCandles = candles.filter((candle) => Number.isFinite(candle.volume) && candle.volume > 0);
    if (validCandles.length < 20) return null;
    const values = [];
    validCandles.reduce((sum, candle) => {
        const range = candle.high - candle.low;
        const multiplier = range === 0 ? 0 : ((candle.close - candle.low) - (candle.high - candle.close)) / range;
        const value = sum + multiplier * candle.volume;
        values.push(value);
        return value;
    }, 0);
    return { current: last(values), previous: values[Math.max(0, values.length - 10)] };
};

const volumeOscillator = (candles, shortPeriod = 5, longPeriod = 20) => {
    const volumes = candles
        .map((candle) => candle.volume)
        .filter((volume) => Number.isFinite(volume) && volume > 0);
    if (volumes.length < longPeriod) return null;
    const shortAverage = sma(volumes, shortPeriod);
    const longAverage = sma(volumes, longPeriod);
    if (!longAverage) return null;
    return ((shortAverage - longAverage) / longAverage) * 100;
};

const detectPatterns = (candles) => {
    if (candles.length < 3) return [];
    const current = candles[candles.length - 1];
    const previous = candles[candles.length - 2];
    const third = candles[candles.length - 3];
    const range = current.high - current.low;
    const body = Math.abs(current.close - current.open);
    const upperWick = current.high - Math.max(current.close, current.open);
    const lowerWick = Math.min(current.close, current.open) - current.low;
    const patterns = [];

    if (range > 0 && body <= range * 0.1) patterns.push({ name: "Doji", signal: "Neutral", detail: "Open and close are nearly equal." });
    if (body > 0 && lowerWick >= body * 2 && upperWick <= body) patterns.push({ name: "Hammer", signal: "Bullish", detail: "Long lower wick indicates rejection of lower prices." });
    if (body > 0 && upperWick >= body * 2 && lowerWick <= body) patterns.push({ name: "Shooting Star", signal: "Bearish", detail: "Long upper wick indicates rejection of higher prices." });
    if (current.close > current.open && previous.close < previous.open && current.open <= previous.close && current.close >= previous.open) {
        patterns.push({ name: "Bullish Engulfing", signal: "Bullish", detail: "Current candle engulfs the previous bearish body." });
    }
    if (current.close < current.open && previous.close > previous.open && current.open >= previous.close && current.close <= previous.open) {
        patterns.push({ name: "Bearish Engulfing", signal: "Bearish", detail: "Current candle engulfs the previous bullish body." });
    }
    if (current.high < previous.high && current.low > previous.low) patterns.push({ name: "Inside Bar", signal: "Neutral", detail: "Compression inside the previous candle range." });
    if (current.high > previous.high && current.low < previous.low) patterns.push({ name: "Outside Bar", signal: current.close >= current.open ? "Bullish" : "Bearish", detail: "Range expansion around the previous candle." });
    if (range > 0 && body >= range * 0.85) patterns.push({ name: "Marubozu", signal: current.close >= current.open ? "Bullish" : "Bearish", detail: "Strong directional candle with small wicks." });
    if (third.close < third.open && Math.abs(previous.close - previous.open) < (third.high - third.low) * 0.35 && current.close > current.open && current.close > ((third.open + third.close) / 2)) {
        patterns.push({ name: "Morning Star", signal: "Bullish", detail: "Three-candle reversal from bearish pressure." });
    }
    if (third.close > third.open && Math.abs(previous.close - previous.open) < (third.high - third.low) * 0.35 && current.close < current.open && current.close < ((third.open + third.close) / 2)) {
        patterns.push({ name: "Evening Star", signal: "Bearish", detail: "Three-candle reversal from bullish pressure." });
    }

    return patterns;
};

const signalTone = (signal) => {
    if (signal === "Strong Buy" || signal === "Buy" || signal === "Bullish") return "bullish";
    if (signal === "Strong Sell" || signal === "Sell" || signal === "Bearish") return "bearish";
    return "neutral";
};

const signalScore = (signal) => {
    if (signal === "Strong Buy") return 2;
    if (signal === "Buy" || signal === "Bullish") return 1;
    if (signal === "Strong Sell") return -2;
    if (signal === "Sell" || signal === "Bearish") return -1;
    return 0;
};

const makeItem = ({ name, value, signal, description }) => ({
    name,
    value,
    signal,
    tone: signalTone(signal),
    score: signalScore(signal),
    description,
});

const priceVsAverageSignal = (close, averageValue, bullishLabel = "Buy", bearishLabel = "Sell") => {
    if (!Number.isFinite(averageValue)) return "Neutral";
    if (close > averageValue) return bullishLabel;
    if (close < averageValue) return bearishLabel;
    return "Neutral";
};

const pushIfValue = (items, config) => {
    if (config.value === null || config.value === undefined || config.value === "-") return;
    items.push(makeItem(config));
};

export function computeTechnicalAnalysis(candles) {
    const cleanCandles = [...candles]
        .filter((candle) => candle?.time && Number.isFinite(candle.open) && Number.isFinite(candle.high) && Number.isFinite(candle.low) && Number.isFinite(candle.close))
        .sort((a, b) => a.time - b.time)
        .filter((item, index, array) => index === 0 || item.time !== array[index - 1].time);

    if (cleanCandles.length < 60) {
        return {
            ready: false,
            message: "At least 60 candles are required for a useful technical analysis snapshot.",
            candles: cleanCandles,
        };
    }

    const closes = cleanCandles.map((candle) => candle.close);
    const close = last(closes);
    const latestCandle = last(cleanCandles);
    const trend = [];
    const momentumItems = [];
    const volatility = [];
    const volumeItems = [];
    const levels = [];
    const patterns = detectPatterns(cleanCandles);

    [5, 10, 20, 50, 100, 200].forEach((period) => {
        const value = sma(closes, period);
        pushIfValue(trend, {
            name: `SMA ${period}`,
            value: formatValue(value),
            signal: priceVsAverageSignal(close, value),
            description: close > value ? "Price is trading above this moving average." : "Price is trading below this moving average.",
        });
    });

    [5, 10, 20, 50, 100, 200].forEach((period) => {
        const value = last(emaSeries(closes, period).filter(Number.isFinite));
        pushIfValue(trend, {
            name: `EMA ${period}`,
            value: formatValue(value),
            signal: priceVsAverageSignal(close, value),
            description: close > value ? "Recent price action is above the exponential average." : "Recent price action is below the exponential average.",
        });
    });

    [20, 50].forEach((period) => {
        const value = wma(closes, period);
        pushIfValue(trend, {
            name: `WMA ${period}`,
            value: formatValue(value),
            signal: priceVsAverageSignal(close, value),
            description: "Weighted average gives more importance to recent candles.",
        });
    });

    [20, 50].forEach((period) => {
        const value = hma(closes, period);
        pushIfValue(trend, {
            name: `HMA ${period}`,
            value: formatValue(value),
            signal: priceVsAverageSignal(close, value),
            description: "Hull moving average reacts faster than classic moving averages.",
        });
    });

    const psar = parabolicSar(cleanCandles);
    pushIfValue(trend, {
        name: "Parabolic SAR",
        value: formatValue(psar?.value),
        signal: psar?.trend === "up" ? "Buy" : "Sell",
        description: psar?.trend === "up" ? "SAR is below price, indicating an upward trend." : "SAR is above price, indicating downward pressure.",
    });

    const supertrendValue = supertrend(cleanCandles);
    pushIfValue(trend, {
        name: "Supertrend",
        value: formatValue(supertrendValue?.value),
        signal: supertrendValue?.trend === "up" ? "Buy" : "Sell",
        description: supertrendValue?.trend === "up" ? "Supertrend is positive." : "Supertrend is negative.",
    });

    const ichimokuValue = ichimoku(cleanCandles);
    if (ichimokuValue) {
        const cloudTop = Math.max(ichimokuValue.spanA, ichimokuValue.spanB);
        const cloudBottom = Math.min(ichimokuValue.spanA, ichimokuValue.spanB);
        pushIfValue(trend, {
            name: "Ichimoku Cloud",
            value: `${formatValue(ichimokuValue.spanA)} / ${formatValue(ichimokuValue.spanB)}`,
            signal: close > cloudTop ? "Buy" : close < cloudBottom ? "Sell" : "Neutral",
            description: close > cloudTop ? "Price is above the cloud." : close < cloudBottom ? "Price is below the cloud." : "Price is inside the cloud.",
        });
    }

    const adxValue = adx(cleanCandles);
    if (adxValue?.adx !== null) {
        pushIfValue(trend, {
            name: "ADX 14",
            value: `${formatValue(adxValue.adx, 2)} | +DI ${formatValue(adxValue.plusDi, 2)} / -DI ${formatValue(adxValue.minusDi, 2)}`,
            signal: adxValue.adx < 20 ? "Neutral" : adxValue.plusDi > adxValue.minusDi ? "Buy" : "Sell",
            description: adxValue.adx < 20 ? "Trend strength is weak." : "Trend strength is meaningful.",
        });
    }

    const rsi = last(rsiSeries(closes, 14).filter(Number.isFinite));
    pushIfValue(momentumItems, {
        name: "RSI 14",
        value: formatValue(rsi, 2),
        signal: rsi > 70 ? "Sell" : rsi < 30 ? "Buy" : rsi > 55 ? "Buy" : rsi < 45 ? "Sell" : "Neutral",
        description: rsi > 70 ? "Overbought zone." : rsi < 30 ? "Oversold zone." : "Momentum is within normal range.",
    });

    const macdValue = macd(closes);
    pushIfValue(momentumItems, {
        name: "MACD",
        value: `${formatValue(macdValue.line)} / ${formatValue(macdValue.signal)} / ${formatValue(macdValue.histogram)}`,
        signal: macdValue.histogram > 0 ? "Buy" : macdValue.histogram < 0 ? "Sell" : "Neutral",
        description: macdValue.histogram > 0 ? "MACD histogram is positive." : "MACD histogram is negative.",
    });

    const stochasticValue = stochastic(cleanCandles);
    pushIfValue(momentumItems, {
        name: "Stochastic 14,3",
        value: `%K ${formatValue(stochasticValue?.k, 2)} / %D ${formatValue(stochasticValue?.d, 2)}`,
        signal: stochasticValue?.k > 80 ? "Sell" : stochasticValue?.k < 20 ? "Buy" : stochasticValue?.k > stochasticValue?.d ? "Buy" : "Sell",
        description: "Compares close against the recent high-low range.",
    });

    const stochRsiValue = stochRsi(closes);
    pushIfValue(momentumItems, {
        name: "Stochastic RSI",
        value: formatValue(stochRsiValue, 2),
        signal: stochRsiValue > 80 ? "Sell" : stochRsiValue < 20 ? "Buy" : "Neutral",
        description: "Applies stochastic logic to RSI values.",
    });

    const cciValue = cci(cleanCandles);
    pushIfValue(momentumItems, {
        name: "CCI 20",
        value: formatValue(cciValue, 2),
        signal: cciValue > 100 ? "Buy" : cciValue < -100 ? "Sell" : "Neutral",
        description: "Measures deviation from typical price average.",
    });

    const williamsValue = williamsR(cleanCandles);
    pushIfValue(momentumItems, {
        name: "Williams %R",
        value: formatValue(williamsValue, 2),
        signal: williamsValue > -20 ? "Sell" : williamsValue < -80 ? "Buy" : "Neutral",
        description: "Shows overbought or oversold position in the recent range.",
    });

    const rocValue = roc(closes);
    pushIfValue(momentumItems, {
        name: "ROC 12",
        value: `${formatValue(rocValue, 2)}%`,
        signal: rocValue > 0 ? "Buy" : rocValue < 0 ? "Sell" : "Neutral",
        description: "Rate of change from 12 candles ago.",
    });

    const momentumValue = momentum(closes);
    pushIfValue(momentumItems, {
        name: "Momentum 10",
        value: formatValue(momentumValue),
        signal: momentumValue > 0 ? "Buy" : momentumValue < 0 ? "Sell" : "Neutral",
        description: "Raw price change from 10 candles ago.",
    });

    const aoValue = awesomeOscillator(cleanCandles);
    pushIfValue(momentumItems, {
        name: "Awesome Oscillator",
        value: formatValue(aoValue),
        signal: aoValue > 0 ? "Buy" : aoValue < 0 ? "Sell" : "Neutral",
        description: "Compares short and long median-price momentum.",
    });

    const atrValue = last(atrSeries(cleanCandles, 14).filter(Number.isFinite));
    pushIfValue(volatility, {
        name: "ATR 14",
        value: formatValue(atrValue),
        signal: "Neutral",
        description: "Average true range measures current volatility.",
    });

    const bb = bollingerBands(closes);
    if (bb) {
        pushIfValue(volatility, {
            name: "Bollinger Bands",
            value: `${formatValue(bb.lower)} / ${formatValue(bb.basis)} / ${formatValue(bb.upper)}`,
            signal: close > bb.upper ? "Sell" : close < bb.lower ? "Buy" : close > bb.basis ? "Buy" : "Sell",
            description: close > bb.upper || close < bb.lower ? "Price is outside the band." : "Price is inside the band.",
        });
        pushIfValue(volatility, {
            name: "BB Width",
            value: `${formatValue(bb.width, 2)}%`,
            signal: "Neutral",
            description: "Wider bands imply higher volatility.",
        });
    }

    const keltner = keltnerChannels(cleanCandles, closes);
    if (keltner) {
        pushIfValue(volatility, {
            name: "Keltner Channels",
            value: `${formatValue(keltner.lower)} / ${formatValue(keltner.middle)} / ${formatValue(keltner.upper)}`,
            signal: close > keltner.upper ? "Buy" : close < keltner.lower ? "Sell" : "Neutral",
            description: "ATR-based channel around EMA.",
        });
    }

    const donchian = donchianChannels(cleanCandles);
    if (donchian) {
        pushIfValue(volatility, {
            name: "Donchian Channels",
            value: `${formatValue(donchian.lower)} / ${formatValue(donchian.middle)} / ${formatValue(donchian.upper)}`,
            signal: close >= donchian.upper ? "Buy" : close <= donchian.lower ? "Sell" : "Neutral",
            description: "Breakout channel based on recent highs and lows.",
        });
    }

    const sd = standardDeviation(sliceLast(closes, 20));
    pushIfValue(volatility, {
        name: "Std. Deviation 20",
        value: formatValue(sd),
        signal: "Neutral",
        description: "Dispersion of close prices over the last 20 candles.",
    });

    const returns = closes.slice(1).map((value, index) => Math.log(value / closes[index])).filter(Number.isFinite);
    const hv = standardDeviation(sliceLast(returns, 20));
    pushIfValue(volatility, {
        name: "Historical Volatility",
        value: hv === null ? "-" : `${formatValue(hv * 100, 3)}%`,
        signal: "Neutral",
        description: "Log-return volatility over the last 20 candles.",
    });

    const vwapValue = vwap(cleanCandles);
    pushIfValue(volumeItems, {
        name: "VWAP 20",
        value: formatValue(vwapValue),
        signal: priceVsAverageSignal(close, vwapValue),
        description: close > vwapValue ? "Price is above volume-weighted average price." : "Price is below volume-weighted average price.",
    });

    const vwmaValue = vwma(cleanCandles);
    pushIfValue(volumeItems, {
        name: "VWMA 20",
        value: formatValue(vwmaValue),
        signal: priceVsAverageSignal(close, vwmaValue),
        description: close > vwmaValue ? "Price is above the volume-weighted moving average." : "Price is below the volume-weighted moving average.",
    });

    const obvValue = obv(cleanCandles);
    if (obvValue) {
        pushIfValue(volumeItems, {
            name: "OBV",
            value: formatValue(obvValue.current, 2),
            signal: obvValue.current > obvValue.previous ? "Buy" : obvValue.current < obvValue.previous ? "Sell" : "Neutral",
            description: "On-balance volume trend over the recent candles.",
        });
    }

    const mfiValue = moneyFlowIndex(cleanCandles);
    pushIfValue(volumeItems, {
        name: "Money Flow Index",
        value: formatValue(mfiValue, 2),
        signal: mfiValue > 80 ? "Sell" : mfiValue < 20 ? "Buy" : mfiValue > 50 ? "Buy" : "Sell",
        description: "Volume-adjusted RSI-style money flow pressure.",
    });

    const cmfValue = chaikinMoneyFlow(cleanCandles);
    pushIfValue(volumeItems, {
        name: "Chaikin Money Flow",
        value: formatValue(cmfValue, 4),
        signal: cmfValue > 0 ? "Buy" : cmfValue < 0 ? "Sell" : "Neutral",
        description: "Accumulation or distribution pressure over 20 candles.",
    });

    const adValue = accumulationDistribution(cleanCandles);
    if (adValue) {
        pushIfValue(volumeItems, {
            name: "Accumulation / Distribution",
            value: formatValue(adValue.current, 2),
            signal: adValue.current > adValue.previous ? "Buy" : adValue.current < adValue.previous ? "Sell" : "Neutral",
            description: "Cumulative money-flow volume direction.",
        });
    }

    const volumeOscillatorValue = volumeOscillator(cleanCandles);
    pushIfValue(volumeItems, {
        name: "Volume Oscillator",
        value: volumeOscillatorValue === null ? "-" : `${formatValue(volumeOscillatorValue, 2)}%`,
        signal: volumeOscillatorValue > 0 ? (latestCandle.close >= latestCandle.open ? "Buy" : "Sell") : "Neutral",
        description: "Short-term volume compared with longer-term volume.",
    });

    const latestVolume = Number.isFinite(latestCandle.volume) ? latestCandle.volume : null;
    const averageVolume = latestVolume === null ? null : average(sliceLast(cleanCandles.map((candle) => candle.volume).filter(Number.isFinite), 20));
    pushIfValue(volumeItems, {
        name: "Relative Volume",
        value: latestVolume === null || !averageVolume ? "-" : `${formatValue(latestVolume / averageVolume, 2)}x`,
        signal: "Neutral",
        description: "Latest candle volume relative to its 20-candle average.",
    });

    const pivots = pivotPoints(cleanCandles);
    if (pivots) {
        pushIfValue(levels, {
            name: "Pivot Point",
            value: `P ${formatValue(pivots.pivot)} | R1 ${formatValue(pivots.r1)} | S1 ${formatValue(pivots.s1)}`,
            signal: close > pivots.pivot ? "Buy" : "Sell",
            description: "Classic pivot based on the previous candle.",
        });
        pushIfValue(levels, {
            name: "Pivot R2 / S2",
            value: `R2 ${formatValue(pivots.r2)} | S2 ${formatValue(pivots.s2)}`,
            signal: "Neutral",
            description: "Secondary pivot support and resistance.",
        });
    }

    const sr = supportResistance(cleanCandles);
    if (sr) {
        pushIfValue(levels, {
            name: "Support / Resistance",
            value: `${formatValue(sr.support)} / ${formatValue(sr.resistance)}`,
            signal: close > ((sr.support + sr.resistance) / 2) ? "Buy" : "Sell",
            description: "Recent high-low range over the latest candles.",
        });
        pushIfValue(levels, {
            name: "Swing High / Low",
            value: `${formatValue(sr.swingLow)} / ${formatValue(sr.swingHigh)}`,
            signal: "Neutral",
            description: "Nearest 10-candle swing boundaries.",
        });
    }

    pushIfValue(levels, {
        name: "Current Candle Range",
        value: `${formatValue(latestCandle.low)} - ${formatValue(latestCandle.high)}`,
        signal: latestCandle.close >= latestCandle.open ? "Bullish" : "Bearish",
        description: "Range and direction of the latest candle.",
    });

    const groups = [
        { name: "Trend", items: trend },
        { name: "Momentum", items: momentumItems },
        { name: "Volatility", items: volatility },
        { name: "Volume", items: volumeItems },
        { name: "Support / Resistance", items: levels },
    ];

    const scoredItems = groups.flatMap((group) => group.items).filter((item) => item.signal !== "Neutral");
    const totalScore = scoredItems.reduce((sum, item) => sum + item.score, 0);
    const bullish = scoredItems.filter((item) => item.score > 0).length;
    const bearish = scoredItems.filter((item) => item.score < 0).length;
    const confidence = scoredItems.length ? Math.min(100, Math.round((Math.abs(totalScore) / scoredItems.length) * 50)) : 0;

    const label = totalScore >= 8
        ? "Strong Buy"
        : totalScore >= 3
            ? "Buy"
            : totalScore <= -8
                ? "Strong Sell"
                : totalScore <= -3
                    ? "Sell"
                    : "Neutral";

    return {
        ready: true,
        candles: cleanCandles,
        latest: latestCandle,
        summary: {
            label,
            score: totalScore,
            bullish,
            bearish,
            neutral: groups.flatMap((group) => group.items).filter((item) => item.signal === "Neutral").length,
            confidence,
            tone: signalTone(label),
        },
        groups,
        patterns,
        unavailable: volumeItems.length ? [] : [
            "VWAP",
            "VWMA",
            "OBV",
            "Money Flow Index",
            "Chaikin Money Flow",
            "Accumulation / Distribution",
            "Volume Oscillator",
        ],
    };
}
