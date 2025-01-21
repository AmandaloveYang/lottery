import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import ParticipantManagement from "./pages/ParticipantManagement";
import LotteryDraw from "./pages/LotteryDraw";
import ResultManagement from "./pages/ResultManagement";
import PrizeList from "./pages/PrizeList";
import Settings from "./pages/Settings";
import { AppProvider } from "./context/AppContext";

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/prize-list" element={<PrizeList />} />
            <Route path="/participants" element={<ParticipantManagement />} />
            <Route path="/lottery" element={<LotteryDraw />} />
            <Route path="/history" element={<ResultManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </Router>
    </AppProvider>
  );
};

export default App;
