import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { api } from "../lib/api";
import { MatchCard } from "../components/cricket/MatchCard";
export function MatchesPage() {
    const [matches, setMatches] = useState([]);
    useEffect(() => { api.matches.list().then(setMatches).catch(() => setMatches([])); }, []);
    return _jsxs("main", { className: "page", children: [_jsx("span", { className: "eyebrow muted", children: "MATCH CENTRE" }), _jsxs("h1", { children: ["All matches", _jsx("span", { children: "." })] }), _jsx("p", { className: "lead", children: "Live action and upcoming fixtures, supplied by the shared KenoraCric API." }), matches.length ? _jsx("div", { className: "match-grid", children: matches.map(match => _jsx(MatchCard, { match: match }, match._id)) }) : _jsxs("div", { className: "empty-card wide", children: [_jsx(CalendarDays, {}), _jsx("b", { children: "Fixtures will appear here" }), _jsx("span", { children: "Create matches through the API to publish them." })] })] });
}
//# sourceMappingURL=MatchesPage.js.map