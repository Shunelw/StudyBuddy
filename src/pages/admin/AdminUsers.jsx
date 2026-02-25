import React, { useState } from "react";
import { mockUsers } from "../../utils/mockData";
import "./AdminUsers.css";

// Build a flat list of all users with their roles
const allUsers = [
    ...mockUsers.students.map(u => ({ ...u, role: 'student' })),
    ...mockUsers.instructors.map(u => ({ ...u, role: 'instructor' })),
    ...mockUsers.admins.map(u => ({ ...u, role: 'admin' })),
];

const AdminUsers = () => {
    const [search, setSearch] = useState("");

    const filteredUsers = allUsers.filter(user =>
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
                        {/* <span>ACTIONS</span> */}
                    </div>

                    {filteredUsers.map((user) => (
                        <div key={`${user.role}-${user.id}`} className="table-row">
                            <span>{user.id}</span>
                            <span>{user.name}</span>
                            <span>{user.email}</span>
                            <span>
                                <span className={`status ${user.role}`}>
                                    {user.role}
                                </span>
                            </span>
                            {/* <span className="actions">
                                <button className="view-btn">View Profile</button>
                            </span> */}
                        </div>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="table-row">
                            <span style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No users found
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;