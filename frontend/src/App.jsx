import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dishes from "./pages/Dishes";
import Dues from "./pages/Dues";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dishmanagement from "./pages/Dishmanagement";
import Profile from "./pages/Profile";
import AdminRoute from "./pages/AdminRoute";
import Unauthorized from "./pages/Unauthorized";
import UserManagement from "./pages/UserManagement";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-slate-50 overflow-auto">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<Home />} />

              <Route path="/dishes" element={<Dishes />} />

              <Route path="/dues" element={<Dues />} />

              <Route path="/expenses" element={<Expenses />} />

              <Route path="/profile" element={<Profile />} />

              <Route
                path="/analytics"
                element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                }
              />

              <Route path="/dishes/manage" element={<Dishmanagement />} />

              <Route
                path="/register"
                element={
                  <AdminRoute>
                    <Register />
                  </AdminRoute>
                }
              />

              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                }
              />

              <Route path="/update-profile" element={<UpdateProfile />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
