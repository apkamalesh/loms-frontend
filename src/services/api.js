import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login  = (data) => API.post('/auth/login',  data);

// ── Dashboard
export const getAdminDashboard   = ()   => API.get('/admin/dashboard');
export const getTeacherDashboard = (id) => API.get(`/teacher/dashboard/${id}`);
export const getStudentDashboard = (id) => API.get(`/student/dashboard/${id}`);

// ── Users
export const getUsers        = ()         => API.get('/admin/users');
export const getUsersByRole  = (role)     => API.get(`/admin/users/role/${role}`);
export const getPendingUsers = ()         => API.get('/admin/users/pending');
export const createUser      = (data)     => API.post('/admin/users', data);
export const updateUser      = (id, data) => API.put(`/admin/users/${id}`, data);
export const approveUser     = (id)       => API.patch(`/admin/users/${id}/approve`);
export const deleteUser      = (id)       => API.delete(`/admin/users/${id}`);
export const getLoginLogs    = ()         => API.get('/admin/login-logs');

// ── Departments
export const getDepartments   = ()         => API.get('/admin/departments');
export const createDepartment = (data)     => API.post('/admin/departments', data);
export const updateDepartment = (id, data) => API.put(`/admin/departments/${id}`, data);
export const deleteDepartment = (id)       => API.delete(`/admin/departments/${id}`);

// ── Subjects
export const getSubjects          = ()         => API.get('/admin/subjects');
export const getSubjectsByTeacher = (tid)      => API.get(`/teacher/subjects/my/${tid}`);
export const getSubjectsByStudent = (sid)      => API.get(`/student/subjects/my/${sid}`);
export const createSubject        = (data)     => API.post('/admin/subjects', data);
export const updateSubject        = (id, data) => API.put(`/admin/subjects/${id}`, data);
export const deleteSubject        = (id)       => API.delete(`/admin/subjects/${id}`);

// ── Learning Outcomes
export const getLearningOutcomes   = ()         => API.get('/admin/learning-outcomes');
export const getLOsBySubject       = (sid)      => API.get(`/teacher/learning-outcomes/subject/${sid}`);
export const createLearningOutcome = (data)     => API.post('/admin/learning-outcomes', data);
export const updateLearningOutcome = (id, data) => API.put(`/admin/learning-outcomes/${id}`, data);
export const deleteLearningOutcome = (id)       => API.delete(`/admin/learning-outcomes/${id}`);

// ── Enrollments
export const enrollStudent       = (sid, subid) => API.post(`/admin/enrollments/enroll?studentId=${sid}&subjectId=${subid}`);
export const unenrollStudent     = (sid, subid) => API.delete(`/admin/enrollments/unenroll?studentId=${sid}&subjectId=${subid}`);
export const getEnrolledStudents = (subid)      => API.get(`/admin/enrollments/subject/${subid}/students`);

// ── Tests
export const getTestsBySubject = (sid)       => API.get(`/teacher/tests/subject/${sid}`);
export const createTest        = (data)      => API.post('/teacher/tests', data);
export const deleteTest        = (id)        => API.delete(`/teacher/tests/${id}`);

// ── Marks
export const enterMarks        = (data) => API.post('/teacher/marks', data);
export const getClassSummary   = (sid)  => API.get(`/teacher/marks/class-summary/${sid}`);
export const getStudentResults = (sid)  => API.get(`/student/marks/results/${sid}`);

export default API;
