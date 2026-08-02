import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import { BASE_URL } from "../constants/baseUrl";
import UserManagementHeader from "../components/profile/user_management/UserManagementHeader";
import UserCard from "../components/profile/user_management/UserCard";
import AddUserCard from "../components/profile/user_management/AddUserCard";
import DeleteUserModal from "../components/profile/user_management/DeleteUserModal";
import ChangeRoleModal from "../components/profile/user_management/ChangeRoleModal";

const UserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/user/v1/get-all-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleRoleClick = (user) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-10">
        <UserManagementHeader />

        <main className="max-w-6xl mx-auto px-4 py-6">
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800">
              User Management
            </h2>

            <p className="text-slate-500 mt-1">
              Manage all registered users and their roles.
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">
                Loading users...
              </p>
            </div>
          ) : (
            <>
              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {users.map((user) => (
                  <UserCard
                    key={user.userId}
                    user={user}
                    onDelete={handleDeleteClick}
                    onChangeRole={handleRoleClick}
                  />
                ))}

                <AddUserCard
                  onClick={() => navigate("/register")}
                />
              </div>

              {/* Empty State */}
              {users.length === 0 && (
                <div className="text-center mt-20">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    No Users Found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Click below to register your first user.
                  </p>

                  <div className="mt-8 flex justify-center">
                    <AddUserCard
                      onClick={() => navigate("/register")}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Delete Modal */}
      <DeleteUserModal
        isOpen={deleteModalOpen}
        selectedUser={selectedUser}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={fetchUsers}
      />

      {/* Change Role Modal */}
      <ChangeRoleModal
        isOpen={roleModalOpen}
        selectedUser={selectedUser}
        onClose={() => {
          setRoleModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={fetchUsers}
      />
    </>
  );
};

export default UserManagement;