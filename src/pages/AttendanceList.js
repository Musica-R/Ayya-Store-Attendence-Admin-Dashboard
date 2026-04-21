import React, { useState, useEffect } from 'react';
import '../styles/AttendanceList.css';
// import Lottie from 'react-lottie';
// import animationData from '../LottieFiles/Completing Tasks.json';
import * as XLSX from "xlsx-js-style";
import Lottie from "lottie-react";
import animationData from "../LottieFiles/Completing Tasks.json";



const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState([]);

  const [userType, setUserType] = useState('present');
  // 'present' | 'absent'

  const now = new Date();

  const [dateFilter, setDateFilter] = useState(now.toISOString().split('T')[0]);

  const handleDate = (e) => {
    const { value } = e.target;
    setDateFilter(value);
  };

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice',
  //   },
  // };

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchAttendance = async () => {
      try {

        let url = '';

        if (userType === 'present') {
          url = `https://store.mpdatahub.com/api/attendance-list?date=${dateFilter}`;
        } else {
          url = `https://store.mpdatahub.com/api/attendance-List-absent?date=${dateFilter}`;
        }

        const response = await fetch(url);

        const result = await response.json();

        if (isMounted && result.success && result.data) {
          setAttendanceData(result.data);
          setLoading(false);
        }

      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        if (isMounted) {
          timeoutId = setTimeout(fetchAttendance, 10000);
        }
      }
    };

    fetchAttendance();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };

  }, [dateFilter, userType]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("https://store.mpdatahub.com/api/employee-List");
        const data = await res.json();

        if (data.success) {
          setEmployees(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  const fetchMonthlyReport = async () => {
    if (!selectedUser) return alert("Select Employee");

    try {
      const res = await fetch(
        `https://store.mpdatahub.com/api/get-Monthly-Summary?user_id=${selectedUser}&month=${month}&year=${year}`
      );

      const data = await res.json();

      if (data.success) {
        setReport(data.data.attendance);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToExcel = (data, fileName) => {
    // Convert JSON → Sheet
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A3" });

    // Add Company Title (Row 1)
    XLSX.utils.sheet_add_aoa(ws, [["AYYA-STORE"]], { origin: "A1" });

    // Add empty row (spacing)
    XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A2" });

    // Get column count
    const colCount = Object.keys(data[0] || {}).length;

    // Merge title across columns
    ws["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: colCount - 1 },
      },
    ];

    // Title Style
    ws["A1"].s = {
      font: {
        bold: true,
        sz: 16,
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };

    // Header Style (Row 3)
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });

      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true },
          alignment: { horizontal: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    // Center align all data
    for (let row = 3; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            alignment: {
              horizontal: "center",
            },
          };
        }
      }
    }

    // Set column width
    ws["!cols"] = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Export file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const exportDailyReport = () => {
    const formatted = attendanceData.map((item) => ({
      Name: item.name,
      Date: item.attendance_date,
      CheckIn: item.check_in,
      CheckOut: item.check_out,
      Status: item.type,
      WorkedHours: item.worked_hours,
    }));

    exportToExcel(formatted, "Daily_Attendance_Report");
  };

  const exportMonthlyReport = () => {
    const formatted = report.map((r) => ({
      Date: r.date,
      CheckIn: r.check_in,
      CheckOut: r.check_out,
      Status: r.type,
    }));

    exportToExcel(formatted, "Monthly_Attendance_Report");
  };


  // FORMAT TIME
  const formatTime = (timeString) => {
    if (
      !timeString ||
      timeString === '00:00:00' ||
      timeString === '00:00' ||
      timeString === '0:0' ||
      timeString.includes('0000')
    ) {
      return '--';
    }

    const [hour, minute] = timeString.split(':');
    let h = parseInt(hour, 10);

    if (isNaN(h)) return '--';

    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    return `${h}:${minute} ${ampm}`;
  };

  // FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  const openModal = () => {
    setReport([]);
    setSelectedUser('');
    setShowModal(true);
  };

  // GET USER INITIALS
  const getInitials = (name) => {
    if (!name) return 'UN';
    return name.substring(0, 2).toUpperCase();
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setReport([]);
    setSelectedUser('');
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
  };
  if (loading) {
    return (
      <div className="attendance-page loading-container">
        <div className="loader-pulse"></div>
        <p>Loading attendance records...</p>
      </div>
    );
  }

  // FORMAT WORKED HOURS
  const formatDuration = (timeString) => {
    if (!timeString || timeString === '00:00:00') return '--';

    const [hours, minutes] = timeString.split(':').map(Number);

    if (hours === 0 && minutes === 0) return '--';

    if (hours === 0) {
      return `${minutes} min`;
    }

    if (minutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;
  };


  return (
    <div className="attendance-page fade-in-up">
      {/* HEADER */}
      <div className="page-header glass-panel">
        <div className="header-content">
          <div className="permission-title-group">
            {/* <Lottie options={defaultOptions} height={70} width={70} /> */}
            <Lottie animationData={animationData} loop={true} style={{ width: 70, height: 70 }} />
            <div>
              <h1>Attendance Records</h1>
              <p>Track and manage employee daily presence and work hours.</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="stat-badge">
              <span className="badge-label">Monthly Records</span>
              <span className="badge-value">{attendanceData.length}</span>
            </div>
          </div>
        </div>
        <br />
        <div className="header-actions">
          <button className="primary-btn" onClick={exportDailyReport}>
            Download Daily Report
          </button>

          <button className="success-btn" onClick={openModal}>
            Monthly Report
          </button>
        </div>
      </div>


      <div
        style={{ display: 'flex', width: '100%', gap: '30px', padding: '10px' }}
      >
        <div className="form-group">
          <label>Date Filter</label>
          <input
            type="date"
            name="attendance_date"
            value={dateFilter}
            onChange={handleDate}
            required
          />
        </div>
      </div>

      <div className="attendance-toggle">

        <button
          className={userType === 'present' ? 'active-toggle' : ''}
          onClick={() => {
            setUserType('present');
            setLoading(true);
          }}
        >
          Employee Check-in List
        </button>

        <button
          className={userType === 'absent' ? 'active-toggle' : ''}
          onClick={() => {
            setUserType('absent');
            setLoading(true);
          }}
        >
          Employee Non Check-in List
        </button>

      </div>

      {/* TABLE */}
      <div className="attendance-content glass-panel">
        <div className="table-responsive">
          <table className="elegant-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Late By</th>
                <th>Worked Hours</th>
                <th>Shortfall / Overtime</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record , index) => (
                <tr key={`${record.name}-${record.attendance_date}-${index}`} className="table-row">
                    {/* EMPLOYEE */}
                    <td>
                      <div className="employee-cell">
                        <div className="avatar-circle">
                          {getInitials(record.name)}
                        </div>

                        <span className="employee-name">{record.name}</span>
                      </div>
                    </td>

                    {/* DATE */}
                    <td>{formatDate(record.attendance_date)}</td>

                    {/* CHECK IN */}
                    <td>
                      <div className="time-badge in">
                        {record.type === 'ABSENT'
                          ? '--'
                          : formatTime(record.check_in)}
                      </div>
                    </td>

                    {/* CHECK OUT */}
                    <td>
                      <div className="time-badge out">
                        {record.type === 'ABSENT'
                          ? '--'
                          : formatTime(record.check_out)}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td>
                      <div className="status-flex">
                        <span
                          className={`status-pill ${record.type?.toLowerCase() === 'present'
                            ? 'present'
                            : 'absent'
                            }`}
                        >
                          {record.type || 'N/A'}
                        </span>

                        {record.late_checkin === 1 && (
                          <span
                            className="late-indicator"
                            title={`Late by ${record.late_checkin_time}`}
                          >
                            Late
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {record.late_checkin === 1
                        ? formatDuration(record.late_checkin_time)
                        : '--'}
                    </td>


                    {/* WORKED HOURS */}
                    <td>
                      <span className="hours-text">
                        {formatDuration(record.worked_hours)}
                      </span>
                    </td>

                    {/* SHORTFALL / OVERTIME */}
                    <td>
                      <span className="hours-text">
                        {formatDuration(record.overtimed_hours)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No attendance records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>Monthly Attendance Report</h2>
              <button onClick={handleCloseModal}>✕</button>
            </div>

            <div className="modal-filters">

              {/* Employee */}
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.empid})
                  </option>
                ))}
              </select>

              {/* Month */}
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              {/* Year */}
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              <button className="primary-btn" onClick={fetchMonthlyReport}>
                Get Report
              </button>

              <button className="success-btn" onClick={exportMonthlyReport}>
                Export Excel
              </button>
            </div>

            <div className="modal-table">
              {report.length === 0 ? (
                <div>No data available</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.map((r, i) => (
                      <tr key={i}>
                        <td>{r.date}</td>
                        <td>{formatTime(r.check_in)}</td>
                        <td>{formatTime(r.check_out)}</td>
                        <td>{r.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
