import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import ParticipantManagement from "./pages/ParticipantManagement";
import LotteryPage from "./pages/LotteryPage";
import ResultManagement from "./pages/ResultManagement";
import PrizeList from "./pages/PrizeList";
import Settings from "./pages/Settings";
import { AppProvider } from "./context/AppContext";

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<LotteryPage />} />
            <Route path="/prize-list" element={<PrizeList />} />
            <Route path="/participants" element={<ParticipantManagement />} />
            <Route path="/history" element={<ResultManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
