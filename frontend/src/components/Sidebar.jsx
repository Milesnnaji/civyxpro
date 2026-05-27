import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard',   label: 'Dashboard',       icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  { to: '/builder',     label: 'Resume Builder',   icon: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z' },
  { to: '/templates',   label: 'Templates',        icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { to: '/marketplace', label: 'Marketplace',      icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0' },
  { to: '/payments',    label: 'Payment History',  icon: 'M2 8h20v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8z M2 8l2-4h16l2 4' },
  { to: '/profile',     label: 'Profile',          icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z' },
]

function Icon({ d, size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-card border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <div className="text-2xl font-black leading-none">
          <span className="gradient-text">Civyx</span>
          <span style={{ color: '#F5C542' }}>Pro</span>
        </div>
        <div className="text-xs text-muted mt-1">AI Resume Builder</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-[10px] rounded-xl text-sm font-medium transition-all no-underline ${
                isActive
                  ? 'bg-[#6C63FF22] text-[#A5A0FF]'
                  : 'text-muted hover:text-white hover:bg-elevated'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon d={item.icon} size={16} color={isActive ? '#A5A0FF' : '#7B7A9D'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #A78BFA)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
            <div className="text-xs text-muted truncate">{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted text-sm hover:text-white hover:border-[#6C63FF55] transition-all cursor-pointer bg-transparent">
          <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
          Logout
        </button>
      </div>
    </aside>
  )
}
