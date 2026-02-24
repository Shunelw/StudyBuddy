import React, { useState, useEffect } from "react";
import { apiGetUsers } from "../../utils/api";
import "./AdminUsers.css";

const AdminUsers = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        apiGetUsers().then(setUsers).catch(console.error);
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        String(user.id).includes(search)
    );

    return (
        <div className="admin-users-page">
            <div className="container">
                <h1>General User Oversight</h1>

                {/* Search Section */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by Name, Email, or ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button>Search</button>
                </div>

                {/* Table */}
                <div className="users-table">
                    <div className="table-header">
                        <span>ID</span>
                        <span>NAME</span>
                        <span>EMAIL</span>
                        <span>ROLE</span>
                        <span>ACTIONS</span>
                    </div>

                    {filteredUsers.map((user) => (
                        <div key={user.id} className="table-row">
                            <span>{user.id}</span>
                            <span>{user.name}</span>
                            <span>{user.email}</span>
                            <span>
                                <span className={`status ${user.role}`}>
                                    {user.role}
                                </span>
                            </span>
                            <span className="actions">
                                <button className="view-btn">View Profile</button>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;