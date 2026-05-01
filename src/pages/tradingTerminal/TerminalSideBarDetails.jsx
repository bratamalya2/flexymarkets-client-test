import TerminalSideBarSymbol from "./TerminalSideBarSymbol"
import TerminalCalendarComponent from "./TerminalCalendarComponent"

function TerminalSideBarDetails({ Component }) {
    if (!Component) return null;

    switch (Component) {
        case "symbol":
            return <TerminalSideBarSymbol />;
        case "calendar":
            return <TerminalCalendarComponent />;
        default:
            return null;
    }
}

export default TerminalSideBarDetails;