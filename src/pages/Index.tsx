
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import DashboardPage from "./DashboardPage";
import ReportsPage from "./ReportsPage";
import CreateReportPage from "./CreateReportPage";
import NotFound from "./NotFound";

const Index = () => {
  return (
    <HomePage />
  );
};

export default Index;
