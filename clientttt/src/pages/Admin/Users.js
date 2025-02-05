import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-users`);
      setUsers(data.users);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Lifecycle method to fetch users
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Layout title="Users">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Users List</h1>
          <div className="d-flex flex-wrap">
            {users?.map((user) => (
              <div key={user._id} className="card m-2" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text"><strong>Email:</strong> {user.email}</p>
                  <p className="card-text"><strong>Phone:</strong> {user.phone}</p>
                  <p className="card-text">
                    <strong>Role:</strong> {user.role === 1 ? "Admin" : "User"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
