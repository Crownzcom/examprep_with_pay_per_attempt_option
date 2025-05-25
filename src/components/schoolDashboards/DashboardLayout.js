import React from 'react'
import {
  Home,
  UserPlus,
  FileText,
  BarChart,
  Book,
  FileQuestion,
  History,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DashboardLayout = () => {
  // console.log('context', useAuth())
  const { accountType } = useAuth()
  // console.log('user-type:', accountType)

  const user = {
    userType: accountType,
  }
  const isSchool = user.userType === 'school'
  const isStudent = user.userType === 'student'

  const navigationItems = isSchool
    ? [
        {
          name: 'Dashboard',
          icon: <Home size={18} />,
          href: '/school-dashboard',
        },
        {
          name: 'User Management',
          icon: <UserPlus size={18} />,
          href: '/school-dashboard/users',
        },
        {
          name: 'Paper Setting',
          icon: <FileText size={18} />,
          href: '/school-dashboard/papers',
        },
        {
          name: 'Reports',
          icon: <BarChart size={18} />,
          href: '/school-dashboard/reports',
        },
      ]
    : isStudent
    ? [
        {
          name: 'Dashboard',
          icon: <Home size={18} />,
          href: '/student-dashboard',
        },
        {
          name: 'Learning Mode',
          icon: <Book size={18} />,
          href: '/student-dashboard/learning',
        },
        {
          name: 'Test Mode',
          icon: <FileQuestion size={18} />,
          href: '/student-dashboard/tests',
        },
        {
          name: 'Past Papers',
          icon: <History size={18} />,
          href: '/student-dashboard/past-papers',
        },
      ]
    : [{ name: 'Dashboard', icon: <BarChart size={18} />, href: '/dashboard' }]

  return (
    <div className="d-flex">
      <aside
        className="bg-light p-3"
        style={{
          minHeight: '90vh',
          width: '240px',
          borderRight: '1px solid #ddd',
        }}
      >
        <ul className="list-unstyled">
          {navigationItems.map((item) => (
            <li key={item.name} className="mb-3">
              <NavLink
                to={item.href}
                end={
                  item.href === '/school-dashboard' ||
                  item.href === '/student-dashboard'
                }
                className={({ isActive }) =>
                  `d-flex align-items-center rounded text-decoration-none ${
                    isActive ? 'btn btn-sm btn-dark text-white' : 'text-dark'
                  }`
                }
              >
                {item.icon}
                <span className="ms-2">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <main className="p-4" style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
