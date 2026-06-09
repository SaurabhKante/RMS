import { Route, Routes, useLocation } from "react-router-dom";


import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dishes from "./pages/Dishes";
import Dues from "./pages/Dues";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dishmanagement from "./pages/Dishmanagement";

function App() {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}

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
            <Route path="/dishes/manage" element={<Dishmanagement />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;