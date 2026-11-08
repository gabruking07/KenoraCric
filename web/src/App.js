import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import { SiteHeader } from "./components/layout/SiteHeader";
import { HomePage } from "./pages/HomePage";
import { MatchesPage } from "./pages/MatchesPage";
import { MatchPage } from "./pages/MatchPage";
import { ScoringPage } from "./pages/ScoringPage";
import { InfoPage } from "./pages/InfoPage";
export default function App() {
    return _jsxs(_Fragment, { children: [_jsx(SiteHeader, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/matches", element: _jsx(MatchesPage, {}) }), _jsx(Route, { path: "/matches/:id", element: _jsx(MatchPage, {}) }), _jsx(Route, { path: "/scoring", element: _jsx(ScoringPage, {}) }), _jsx(Route, { path: "*", element: _jsx(InfoPage, {}) })] })] });
}
//# sourceMappingURL=App.js.map