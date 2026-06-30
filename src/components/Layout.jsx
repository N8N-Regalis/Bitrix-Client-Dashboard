import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import {
  Users, ChevronRight, Menu, ChevronLeft, Building2, ClipboardList
} from 'lucide-react'
import { cn } from '../utils/utils'

const NAV = [
  { to: '/', label: 'Client Dashboard', icon: Users },
  { to: '/assignments', label: 'Client Assignments', icon: ClipboardList },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        'h-full flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 relative',
        sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
      )}>
        {/* Handle bar to collapse */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-l-lg flex items-center justify-center shadow-md hover:shadow-lg transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        )}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100 leading-tight font-orbitron uppercase tracking-wide">Bitrix CRM</p>
              <p className="text-xs glow-text font-medium uppercase">Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-slate-800'
                  : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={cn('w-4 h-4 flex-shrink-0', isActive ? '' : 'text-slate-500 group-hover:text-slate-300')} 
                    style={isActive ? { color: 'rgb(129, 140, 248)' } : {}}
                  />
                  <span className="flex-1 font-orbitron text-xs uppercase tracking-wider group-hover:text-slate-100" style={isActive ? { color: 'rgb(129, 140, 248)' } : {}}>{label}</span>
                  {isActive && <ChevronRight className="w-3 h-3" style={{ color: 'rgb(129, 140, 248)' }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">Built by <span className="glow-text uppercase font-bold">Automations Team</span></p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header with toggle button (only shows when sidebar is closed) */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
          {!sidebarOpen && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md hover:shadow-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100 leading-tight font-orbitron uppercase tracking-wide">Bitrix CRM</p>
                  <p className="text-xs glow-text font-medium uppercase">Dashboard</p>
                </div>
              </div>
            </div>
          )}
        </header>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
