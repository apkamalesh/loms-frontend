# LOMS Frontend v4 — React

## Quick Start
```bash
npm install
npm start
# App at http://localhost:3000
```

## New Pages (v4)
| Page                  | Path                     | Description                        |
|-----------------------|--------------------------|------------------------------------|
| Sign Up               | /signup                  | Role selection + registration form |
| Pending Approvals     | /admin/pending-users     | Approve / reject new signups       |
| Visitor Logs          | /admin/login-logs        | All login activity with IP/browser |

## User Flow
```
New User → /signup → Select Role (Student/Teacher) → Fill form
         → "Awaiting admin approval" screen

Admin → /admin/pending-users → See list → Click Approve / Reject

Approved User → /login → Dashboard
```

## Role Access
| Role    | Pages                                                      |
|---------|------------------------------------------------------------|
| ADMIN   | Dashboard, Departments, Subjects, LOs, Users, Pending, Logs|
| TEACHER | Dashboard, Tests, Enter Marks, Class Summary               |
| STUDENT | Dashboard, My Results                                      |
