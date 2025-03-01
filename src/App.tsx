import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./components/dashboard/Dashboard";
import DocumentList from "./components/documents/DocumentList";
import DocumentForm from "./components/documents/DocumentForm";
import DocumentDetail from "./components/documents/DocumentDetail";
import AdvancedSearch from "./components/search/AdvancedSearch";
import MassIntentionsManager from "./components/mass-intentions/MassIntentionsManager";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/documents/baptism"
          element={<Home defaultView="list" defaultDocumentType="baptism" />}
        />
        <Route
          path="/documents/marriage"
          element={<Home defaultView="list" defaultDocumentType="marriage" />}
        />
        <Route
          path="/documents/communion"
          element={<Home defaultView="list" defaultDocumentType="communion" />}
        />
        <Route
          path="/documents/confirmation"
          element={
            <Home defaultView="list" defaultDocumentType="confirmation" />
          }
        />
        <Route path="/search" element={<Home defaultView="search" />} />
        <Route path="/digitalize" element={<Home defaultView="digitalize" />} />
        <Route
          path="/mass-intentions"
          element={<Home defaultView="mass-intentions" />}
        />
        <Route path="/admin/users" element={<Home />} />
        <Route path="/admin/settings" element={<Home />} />
        <Route
          path="/admin/ai-settings"
          element={<Home defaultView="ai-settings" />}
        />
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
