import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { applyDelivery, newInnings, overs, runRate } from "@kenoracric/cricket-engine";
import { api } from "../lib/api";
export function ScoringPage() {
    const [matches, setMatches] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [innings, setInnings] = useState(newInnings());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(() => localStorage.getItem("kc_token") || "");
    const [message, setMessage] = useState("Ready");
    const selected = matches.find(match => match._id === selectedId);
    useEffect(() => { api.matches.list().then(setMatches).catch(() => setMessage("Could not load matches.")); }, []);
    function selectMatch(id) {
        setSelectedId(id);
        const match = matches.find(item => item._id === id);
        if (match)
            setInnings(match.innings);
        else
            setInnings(newInnings());
    }
    async function signIn(event) {
        event.preventDefault();
        try {
            const session = await api.auth.login({ email, password });
            if (session.user.role !== "scorer" && session.user.role !== "admin") {
                setMessage("This account does not have scorer permissions.");
                return;
            }
            localStorage.setItem("kc_token", session.token);
            setToken(session.token);
            setPassword("");
            setMessage("Signed in as " + session.user.name + ".");
        }
        catch (reason) {
            setMessage(reason instanceof Error ? reason.message : "Sign-in failed.");
        }
    }
    async function score(delivery) {
        if (!selected) {
            setMessage("Choose a match first.");
            return;
        }
        if (!token) {
            setMessage("Sign in with an assigned scorer account before scoring.");
            return;
        }
        const next = applyDelivery(innings, delivery);
        const event = { eventId: crypto.randomUUID(), sequence: selected.sequence + 1, delivery };
        setInnings(next);
        setMessage("Syncing delivery...");
        try {
            const updated = await api.scoring.submit(selected._id, event, token);
            setMatches(current => current.map(match => match._id === updated._id ? updated : match));
            setMessage("Delivery synced.");
        }
        catch (reason) {
            setMessage(reason instanceof Error ? reason.message : "Scoring request failed.");
        }
    }
    function signOut() { localStorage.removeItem("kc_token"); setToken(""); setMessage("Signed out."); }
    return _jsxs("main", { className: "page scorer", children: [_jsx("span", { className: "eyebrow muted", children: "SCORER WORKSPACE" }), _jsxs("h1", { children: ["Live scoring", _jsx("span", { children: "." })] }), _jsx("p", { className: "lead", children: "Use the same scorer account and API as the Android app." }), !token ? _jsxs("form", { className: "token-form", onSubmit: signIn, children: [_jsxs("label", { children: ["Email", _jsx("input", { type: "email", value: email, onChange: event => setEmail(event.target.value), required: true })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", value: password, onChange: event => setPassword(event.target.value), required: true })] }), _jsx("button", { className: "button small", children: "Sign in" })] }) : _jsxs("div", { className: "scorer-auth", children: [_jsx("span", { children: message }), _jsx("button", { onClick: signOut, children: "Sign out" })] }), _jsxs("label", { className: "select-label", children: ["Select match", _jsxs("select", { value: selectedId, onChange: event => selectMatch(event.target.value), children: [_jsx("option", { value: "", children: "Choose a match" }), matches.map(match => _jsxs("option", { value: match._id, children: [match.teamA, " v ", match.teamB, " / ", match.status] }, match._id))] })] }), _jsxs("div", { className: "scorer-board", children: [_jsxs("div", { className: "scorer-score", children: [_jsx("span", { children: message }), _jsxs("strong", { children: [innings.runs, _jsxs("small", { children: ["/", innings.wickets] })] }), _jsxs("b", { children: [overs(innings.legalBalls), " ", _jsx("small", { children: "overs" })] }), _jsxs("em", { children: ["RR ", runRate(innings.runs, innings.legalBalls)] })] }), _jsx("div", { className: "run-buttons", children: [0, 1, 2, 3, 4, 6].map(runs => _jsx("button", { onClick: () => score({ runs }), children: runs === 0 ? "DOT" : runs }, runs)) }), _jsxs("div", { className: "extra-buttons", children: [_jsx("button", { onClick: () => score({ runs: 0, extra: "wides" }), children: "Wide" }), _jsx("button", { onClick: () => score({ runs: 0, extra: "noBalls" }), children: "No ball" }), _jsx("button", { onClick: () => score({ runs: 1, extra: "byes" }), children: "Bye" }), _jsx("button", { onClick: () => score({ runs: 1, extra: "legByes" }), children: "Leg bye" }), _jsx("button", { className: "wicket", onClick: () => score({ runs: 0, wicket: "bowled" }), children: "Wicket" })] }), _jsxs("div", { className: "recent", children: ["Current over ", _jsx("b", { children: innings.balls.slice(-6).map(ball => ball.wicket ? "W" : ball.extra ? "E" : ball.runs).join(" / ") || "No deliveries yet" })] })] })] });
}
//# sourceMappingURL=ScoringPage.js.map