import React, { useEffect, useState } from 'react';
import '../styles/EmpList.css';
import { FiEdit2, FiX, FiSave, FiSearch } from 'react-icons/fi';
// import Lottie from 'react-lottie';
// import animationData from '../LottieFiles/Employee Search.json';
import Lottie from "lottie-react";
import animationData from "../LottieFiles/Employee Search.json";

const API_URL = 'https://store.mpdatahub.com/api/employee-List';
const UPDATE_URL = 'https://store.mpdatahub.com/api/update-profile';
const INACTIVE_URL = 'https://store.mpdatahub.com/api/employees/inactive';
const ROLE_API = "https://store.mpdatahub.com/api/roles";
const COMPANY_API = "https://store.mpdatahub.com/api/list-company";
const BRANCH_API = "https://store.mpdatahub.com/api/get-branch-for-company?company_id=";

// INTERN APIs
const INTERN_URL = 'https://store.mpdatahub.com/api/employee-List-roles';
const INACTIVE_INTERN_URL = 'https://store.mpdatahub.com/api/employees/inactive/roles';

export default function EmpList() {
  const [employees, setEmployees] = useState([]);
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
  const [interns, setInterns] = useState([]);
  const [inactiveInterns, setInactiveInterns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);

  // active | inactive | intern | inactive_intern
  const [filterStatus, setFilterStatus] = useState('active');

  useEffect(() => {
    fetchEmployees();
    fetchInactiveEmployees();
    fetchInterns();
    fetchInactiveInterns();
    fetchRoles();
    fetchCompanies();
  }, []);

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice',
  //   },
  // };

  const counts = {
    active: employees.length,
    inactive: inactiveEmployees.length,
    intern: interns.length,
    inactive_intern: inactiveInterns.length,
  };

  const tabLabels = {
    active: 'Employee List',
    inactive: 'Inactive Employee List',
    intern: 'Intern List',
    inactive_intern: 'Inactive Intern List',
  };

  /* ---------------- FETCH ACTIVE EMPLOYEES ---------------- */

  const fetchEmployees = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json.success) {
        setEmployees(json.data);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ---------------- FETCH INACTIVE EMPLOYEES ---------------- */

  const fetchInactiveEmployees = async () => {
    try {
      const res = await fetch(INACTIVE_URL);
      const json = await res.json();

      if (json.success) {
        setInactiveEmployees(json.data);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ---------------- FETCH INTERN LIST ---------------- */

  const fetchInterns = async () => {
    try {
      const res = await fetch(INTERN_URL);
      const json = await res.json();

      if (json.success) {
        setInterns(json.data);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ---------------- FETCH INACTIVE INTERN LIST ---------------- */

  const fetchInactiveInterns = async () => {
    try {
      const res = await fetch(INACTIVE_INTERN_URL);
      const json = await res.json();

      if (json.success) {
        setInactiveInterns(json.data);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(ROLE_API);
      const json = await res.json();

      if (json.success) {
        setRoles(json.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(COMPANY_API);
      const json = await res.json();

      if (json.success) {
        setCompanies(json.data);

        // load first company's branches
        if (json.data.length > 0) {
          fetchBranches(json.data[0].id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBranches = async (companyId) => {
    try {
      const res = await fetch(
        `${BRANCH_API}${companyId}`
      );
      const json = await res.json();

      if (json.success) {
        setBranches(json.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- UPDATE EMPLOYEES STATUS ---------------- */

  const updateEmployeeStatus = async (id, status) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://store.mpdatahub.com/api/update-Employee-Status?user_id=${id}&status=${status}`
      );
      const json = await res.json();

      if (json.success) {
        fetchEmployees();
        fetchInactiveEmployees();
        fetchInterns();
        fetchInactiveInterns();
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ---------------- TOOGLE BUTTON ---------------- */

  const handleToggle = (id, status) => {
    const updatedStatus = status === 0 ? 1 : 0;
    updateEmployeeStatus(id, updatedStatus);
  };

  /* ---------------- OPEN EDIT ---------------- */

  const openEdit = (emp) => {
    setEditData({
      id: emp.id,
      name: emp.name || "",
      empid: emp.empid || "",
      email: emp.email || "",
      mobile: emp.mobile || "",
      position: emp.position || "",
      address: emp.address || "",
      dob: emp.dob || "",
      role_id: emp.role_id || "",
      company_id: emp.company_id || "",
      branch_id: emp.branch_id || "",
      start_time: emp.start_time ? emp.start_time.slice(0, 5) : "",
      end_time: emp.end_time ? emp.end_time.slice(0, 5) : "",
    });

    fetchBranches(emp.company_id);

    setEditModal(true);
  };

  const formatTime = (time) => {
    if (!time) return '';

    const [hour, minute] = time.split(':');

    let h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12 || 12; // convert 0 → 12

    return `${h}:${minute} ${ampm}`;
  };

  /* ---------------- INPUT CHANGE ---------------- */

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- SAVE EDIT ---------------- */

  const saveEdit = async () => {
    if (!editData?.id) {
      setSaveError('ID missing');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const formData = new FormData();
      const formatToHMS = (time) => {
        if (!time) return '';
        if (time.length === 8) return time;
        return time + ':00'; // convert HH:mm → HH:mm:ss
      };
      formData.append('id', editData.id);

      // only send changed fields
      if (editData.name) formData.append('name', editData.name);
      if (editData.empid) formData.append('empid', editData.empid);
      if (editData.email) formData.append('email', editData.email);
      if (editData.mobile) formData.append('mobile', editData.mobile);
      if (editData.position) formData.append('position', editData.position);
      if (editData.address) formData.append('address', editData.address);
      if (editData.dob) formData.append('dob', editData.dob);
      if (editData.start_time) {
        formData.append('start_time', formatToHMS(editData.start_time));
      }

      if (editData.end_time) {
        formData.append('end_time', formatToHMS(editData.end_time));
      }
      formData.append("role_id", editData.role_id);
      formData.append("company_id", editData.company_id);
      formData.append("branch_id", editData.branch_id);

      const res = await fetch(UPDATE_URL, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      console.log('API Response:', json);

      if (json.success) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editData.id ? { ...emp, ...editData } : emp
          )
        );
        setInterns((prev) =>
          prev.map((emp) =>
            emp.id === editData.id ? { ...emp, ...editData } : emp
          )
        );

        setEditModal(false);
      } else {
        setSaveError(json.message || 'Update failed');
      }
    } catch {
      setSaveError('Network error');
    }
    setSaving(false);
  };

  /* ---------------- SEARCH ---------------- */

  const matchesSearch = (emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

  const active = employees.filter(matchesSearch);
  const inactive = inactiveEmployees.filter(matchesSearch);
  const internList = interns.filter(matchesSearch);
  const inactiveInternList = inactiveInterns.filter(matchesSearch);

  const listByTab = {
    active,
    inactive,
    intern: internList,
    inactive_intern: inactiveInternList,
  };

  const headerCountLabel = () => {
    if (filterStatus === 'active') return `${employees.length} employees`;
    if (filterStatus === 'inactive') return `${inactiveEmployees.length} employees`;
    if (filterStatus === 'intern') return `${interns.length} interns`;
    return `${inactiveInterns.length} interns`;
  };

  /* ---------------- GROUP BY BRANCH ---------------- */

  const groupByBranch = (list) => {
    const groups = {};

    list.forEach((emp) => {
      const key = emp.branch_id ?? 'unassigned';

      if (!groups[key]) {
        groups[key] = {
          branch_id: emp.branch_id,
          branch_name: emp.branch_name || 'Unassigned Branch',
          items: [],
        };
      }
      groups[key].items.push(emp);
    });

    return Object.values(groups);
  };

  const renderEmpCard = (emp) => (
    <div className="emp-card" key={emp.id}>
      <div className="emp-card-top">
        <img
          src={emp.profile_img}
          alt={emp.name}
          className="emp-avatar"
        />
        <div className="emp-badge">{emp.empid}</div>
      </div>

      <div className="emp-card-body">
        <h3>{emp.name}</h3>

        <span className="emp-position">{emp.position || 'N/A'}</span>

        <p>
          <strong>Email:</strong> {emp.email}
        </p>
        <p>
          <strong>Phone:</strong> {emp.mobile}
        </p>
        <p>
          <strong>DOB:</strong> {emp.dob || 'N/A'}
        </p>
        <p>
          <strong>Address:</strong> {emp.address}
        </p>
        <p>
          <strong>Work Time:</strong>{' '}
          {formatTime(emp.start_time)} to {formatTime(emp.end_time)}
        </p>

        {/*============= BUTTONS =================*/}
        <div className="emp-card-actions">
          <label className="switch">
            <input
              type="checkbox"
              checked={emp.status === 1}
              onChange={() => handleToggle(emp.id, emp.status)}
            />
            <span className="slider"></span>
          </label>

          <span className="status-text">
            {emp.status === 1 ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="emp-card-actions">
        <button className="btn-edit" onClick={() => openEdit(emp)}>
          <FiEdit2 /> Edit
        </button>
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="emplist-page">
      {/* HEADER */}

      <div className="emplist-header">
        <div className="emplist-title">
          {/* <Lottie options={defaultOptions} height={90} width={70} /> */}
          <Lottie animationData={animationData} loop={true} style={{ width: 90, height: 70 }} />
          <div>
            <h1>Employee List</h1>
            <p>{headerCountLabel()}</p>
          </div>
        </div>

        <div className="emplist-search-wrap">
          <FiSearch className="search-icon" />
          <input
            className="emplist-search"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && <p>Loading...</p>}

      <div className="pl-tabs">
        {['active', 'inactive', 'intern', 'inactive_intern'].map((s) => (
          <button
            key={s}
            className={`pl-tab ${filterStatus === s ? 'pl-tab--active' : ''}`}
            onClick={() => {
              setFilterStatus(s);
            }}
          >
            {tabLabels[s]}
            <span className="pl-tab-count">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* EMPLOYEE GRID - GROUPED BY BRANCH */}

      {loading ? (
        <div className="emp-grid">
          <div className="emp-loader">
            <p>Loading employees...</p>
          </div>
        </div>
      ) : listByTab[filterStatus].length === 0 ? (
        <div className="emp-grid">
          <div className="emp-loader">
            <p>No records found.</p>
          </div>
        </div>
      ) : (
        groupByBranch(listByTab[filterStatus]).map((group) => (
          <div className="branch-section" key={group.branch_id ?? 'unassigned'}>
            <div className="branch-section-header">
              <span className="branch-id-badge">
                Branch {group.branch_id ?? '-'}
              </span>
              <h2 className="branch-section-title">{group.branch_name}</h2>
              <span className="branch-section-tag">{tabLabels[filterStatus]}</span>
              <span className="branch-section-count">{group.items.length}</span>
            </div>

            <div className="emp-grid">
              {group.items.map((emp) => renderEmpCard(emp))}
            </div>
          </div>
        ))
      )}

      {/* EDIT MODAL */}

      {editModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Edit Employee</h2>

              <button
                className="modal-close"
                onClick={() => setEditModal(false)}
              >
                <FiX />
              </button>
            </div>

            {saveError && <div className="modal-api-error">{saveError}</div>}

            <div className="modal-form">

              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Employee ID</label>
                <input
                  name="empid"
                  value={editData.empid}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Mobile</label>
                <input
                  name="mobile"
                  value={editData.mobile}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <input
                  name="position"
                  value={editData.position}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  name="role_id"
                  value={editData.role_id}
                  onChange={handleEditChange}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Company</label>

                <select
                  name="company_id"
                  value={editData.company_id}
                  onChange={(e) => {
                    handleEditChange(e);
                    fetchBranches(e.target.value);
                  }}
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Branch</label>

                <select
                  name="branch_id"
                  value={editData.branch_id}
                  onChange={handleEditChange}
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={editData.dob}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  name="start_time"
                  value={editData.start_time}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  name="end_time"
                  value={editData.end_time}
                  onChange={handleEditChange}
                />
              </div>

            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>

              <button className="btn-save" onClick={saveEdit} disabled={saving}>
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <FiSave /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}