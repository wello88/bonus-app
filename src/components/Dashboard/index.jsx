import React from "react";
import { useAuth } from "../contexts/AuthContext";
import FinanceDashboard from "./FinanceDashboard";
import ManagerDashboard from "./ManagerDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === "FINANCE" ? (
    <FinanceDashboard />
  ) : user.role === "MANAGER" ? (
    <ManagerDashboard />
  ) : (
    <div>Unauthorized</div>
  );
};

export default Dashboard;
