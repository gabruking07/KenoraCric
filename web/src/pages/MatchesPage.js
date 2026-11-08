import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { api } from "../lib/api";
import { MatchCard } from "../components/cricket/MatchCard";
export function MatchesPage() {
    const [matches, setMatches] = useState([]);
    useEffect(() => { api.matches.list().then(setMatches).catch(() => setMatches([])); }, []);
    const live = matches.filter(match => match.status === "live");
    const upcoming = matches.filter(match => match.status === "scheduled");
    const past = matches.filter(match => match.status === "completed").sort((a, b) => Date.parse(b.startAt || "") - Date.parse(a.startAt || ""));
    return _jsxs("main", { className: "page", children: [_jsx("span", { className: "eyebrow muted", children: "MATCH CENTRE" }), _jsxs("h1", { children: ["All matches", _jsx("span", { children: "." })] }), _jsx("p", { className: "lead", children: "Live action, upcoming fixtures, and completed results." }), live.length > 0 && _jsxs("section", { className: "section", children: [_jsx("div", { className: "section-head", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow muted", children: "LIVE NOW" }), _jsxs("h2", { children: ["Live matches", _jsx("span", { children: "." })] })] }) }), _jsx("div", { className: "match-grid", children: live.map(match => _jsx(MatchCard, { match: match }, match._id)) })] }), upcoming.length > 0 && _jsxs("section", { className: "section", children: [_jsx("div", { className: "section-head", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow muted", children: "FIXTURES" }), _jsxs("h2", { children: ["Upcoming matches", _jsx("span", { children: "." })] })] }) }), _jsx("div", { className: "match-grid", children: upcoming.map(match => _jsx(MatchCard, { match: match }, match._id)) })] }), past.length > 0 && _jsxs("section", { className: "section", children: [_jsx("div", { className: "section-head", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow muted", children: "RESULTS" }), _jsxs("h2", { children: ["Past matches", _jsx("span", { children: "." })] })] }) }), _jsx("div", { className: "match-grid", children: past.map(match => _jsx(MatchCard, { match: match }, match._id)) })] }), matches.length === 0 && _jsxs("div", { className: "empty-card wide", children: [_jsx(CalendarDays, {}), _jsx("b", { children: "Fixtures will appear here" }), _jsx("span", { children: "Create matches through the API to publish them." })] })] });
}
//# sourceMappingURL=MatchesPage.js.map