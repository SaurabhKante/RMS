import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dishes from "./pages/Dishes";
import Dues from "./pages/Dues";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import DashboardHeader from "./components/DashboardHeader";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-slate-50 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/dues" element={<Dues />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
