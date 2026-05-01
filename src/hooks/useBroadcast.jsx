import { useEffect, useRef } from "react";

const CACHE = {};

export function getBroadcastChannel(name = "mt5-account") {
    if (!CACHE[name]) CACHE[name] = new BroadcastChannel(name);
    return CACHE[name];
}

export function useBroadcast(name = "mt5-account") {
    const ref = useRef(getBroadcastChannel(name));

    useEffect(() => {
        ref.current = getBroadcastChannel(name);
    }, [name]);

    useEffect(() => {
        const onUnload = () => {
            try { CACHE[name] && CACHE[name].close(); } catch (e) { }
            CACHE[name] = undefined;
        };
        window.addEventListener("pagehide", onUnload);
        window.addEventListener("beforeunload", onUnload);
        return () => {
            window.removeEventListener("pagehide", onUnload);
            window.removeEventListener("beforeunload", onUnload);
        };
    }, [name]);

    return ref.current;
}