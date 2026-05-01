import { getBroadcastChannel } from "../hooks/useBroadcast";

export function notifyMt5AccountChange(accountId, channel, name = "mt5-account") {

    localStorage.setItem("mt5-active-account", accountId);

    const send = (ch) => ch.postMessage({ type: "ACCOUNT_CHANGED", accountId });

    try {
        send(channel || getBroadcastChannel(name));
    } catch (err) {
        if (err && err.name === "InvalidStateError") {
            const fresh = getBroadcastChannel(name);
            try { send(fresh); } catch (e) { }
        } else {
            console.error(err);
        }
    }
}