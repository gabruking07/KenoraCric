import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { overs, runRate } from "@kenoracric/cricket-engine";
import { api, socketUrl } from "../lib/api";
export function MatchPage() {
    const { id = "" } = useParams();
    const [match, setMatch] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        api.matches.get(id).then(setMatch).catch(reason => setError(reason instanceof Error ? reason.message : "Match unavailable"));
        const socket = io(socketUrl);
        socket.emit("match:join", id);
        socket.on("score:update", setMatch);
        return () => { socket.emit("match:leave", id); socket.disconnect(); };
    }, [id]);
    if (!match)
        return _jsxs("main", { className: "page", children: [_jsx(Link, { to: "/matches", children: "Back to match centre" }), _jsx("h2", { children: error || "Loading match..." })] });
    return _jsxs("main", { className: "page", children: [_jsx(Link, { to: "/matches", children: "Back to match centre" }), _jsxs("div", { className: "match-detail", children: [_jsxs("span", { className: "live-pill", children: [_jsx("i", {}), match.status] }), _jsxs("h1", { children: [match.teamA, " ", _jsx("span", { children: "v" }), " ", match.teamB] }), _jsxs("p", { children: [match.title, " / ", match.venue, " / ", match.format] }), _jsxs("div", { className: "detail-score", children: [match.innings.runs, "/", match.innings.wickets, _jsxs("small", { children: [overs(match.innings.legalBalls), " overs / RR ", runRate(match.innings.runs, match.innings.legalBalls)] })] }), _jsxs("div", { className: "ball-list", children: [_jsx("h3", { children: "Recent deliveries" }), match.events.slice(-12).reverse().map((event, index) => _jsxs("span", { children: [event.runs, event.wicket ? " W" : ""] }, event.eventId || index))] })] })] });
}
//# sourceMappingURL=MatchPage.js.map