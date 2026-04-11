import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { requireUser } from '@/lib/authUser';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: 'home' },
    { href: '/dashboard/chat', label: 'Chat with Richard', icon: 'chat' },
    { href: '/dashboard/cases', label: 'My Cases', icon: 'folder' },
    { href: '/dashboard/cases/new', label: 'Submit a Case', icon: 'plus' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">
                  Signed in as
                </p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user.name || user.email || 'User'}
                </p>
                {user.email && user.name && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors"
                  >
                    <SidebarIcon name={item.icon} />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href="/auth/logout"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <SidebarIcon name="logout" />
                  Logout
                </a>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarIcon({ name }: { name: string }) {
  const common = 'w-5 h-5 flex-shrink-0';
  switch (name) {
    case 'home':
      return (
        <svg className={common} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      );
    case 'chat':
      return (
        <svg className={common} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.84 8.84 0 01-3.075-.538A4.99 4.99 0 012 17l1.4-3.5A6.44 6.44 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'folder':
      return (
        <svg className={common} fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    case 'plus':
      return (
        <svg className={common} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'logout':
      return (
        <svg className={common} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
}
