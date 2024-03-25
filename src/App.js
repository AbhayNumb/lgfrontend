import "./App.css";
import "flowbite";

import Dashboard from "./components/dashboard";
import Login from "./components/login";
import WebContextProvider from "./context/contextprovider";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import ChartComp from "./components/chart";
function App() {
  return (
    <Router>
      <WebContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <div>
                <Sidebar />
                <Dashboard />
              </div>
            }
          />
          <Route
            path="/dashboard/charts"
            element={
              <div>
                <Sidebar />
                <ChartComp />
              </div>
            }
          />
        </Routes>
        <Toaster />
      </WebContextProvider>
    </Router>
  );
}

export default App;
