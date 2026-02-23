import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './AdminUsers.css';

const AdminUsers = () => {
  const [usersByRole, setUsersByRole] = useState({ students: [], instructors: [], admins: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.admin
      .users()
      .then((data) => setUsersByRole(data || { students: [], instructors: [], admins: [] }))
      .catch(() => setUsersByRole({ students: [], instructors: [], admins: [] }))
      .finally(() => setLoading(false));
  }, []);

  const allUsers = [
    ...(usersByRole.students || []).map((u) => ({ ...u, role: 'student' })),
    ...(usersByRole.instructors || []).map((u) => ({ ...u, role: 'instructor' })),
    ...(usersByRole.admins || []).map((u) => ({ ...u, role: 'admin' })),
  ];

  const filteredUsers = allUsers.filter(
    (user) =>
      (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.id || '').toString().toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-page">
      <div className="container">
        <h1>General User (Students) Oversight</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Name, User ID, Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button">Search</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="users-table">
            <div className="table-header">
              <span>USER ID</span>
              <span>NAME</span>
              <span>EMAIL</span>
              <span>ROLE</span>
              <span>ENROLLED COURSES</span>
              <span>ACTIONS</span>
            </div>
            {filteredUsers.map((user) => (
              <div key={user.id} className="table-row">
                <span>{user.id}</span>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>
                  <span className={`status ${(user.role || '').toLowerCase()}`}>{user.role}</span>
                </span>
                <span>{(user.enrolledCourses || []).length}</span>
                <span className="actions">
                  <button type="button" className="view-btn">View Profile</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
