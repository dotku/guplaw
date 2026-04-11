'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export interface NavPracticeArea {
  slug: string;
  title: string;
  shortDescription: string;
}

interface NavUser {
  email?: string | null;
  name?: string | null;
}

interface Props {
  user: NavUser | null;
  practiceAreas: NavPracticeArea[];
}

export default function NavbarClient({ user, practiceAreas }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false);
  const areasRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAreasOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!areasOpen) return;
    const onClick = (e: MouseEvent) => {
      if (areasRef.current && !areasRef.current.contains(e.target as Node)) {
        setAreasOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [areasOpen]);

  const displayName = user?.name || user?.email || '';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-900 via-blue-700 to-amber-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-700 to-amber-600 bg-clip-text text-transparent tracking-tight">
              GPULaw
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Practice Areas dropdown */}
            <div className="relative" ref={areasRef}>
              <button
                type="button"
                onClick={() => setAreasOpen((v) => !v)}
                aria-expanded={areasOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Practice Areas
                <svg
                  className={`w-4 h-4 transition-transform ${areasOpen ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {areasOpen && (
                <div className="absolute left-0 mt-2 w-[520px] bg-white rounded-xl shadow-2xl border-2 border-gray-100 p-3 grid grid-cols-2 gap-1">
                  {practiceAreas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/${area.slug}`}
                      onClick={() => setAreasOpen(false)}
                      className="px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="font-bold text-gray-900 text-sm group-hover:text-blue-900">
                        {area.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                        {area.shortDescription}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#how-it-works"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#membership"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#get-help"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop auth actions */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-900 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <span
                  className="text-sm text-gray-700 max-w-[160px] truncate"
                  title={displayName}
                >
                  <span className="text-gray-500">Hi,</span>{' '}
                  <span className="font-semibold text-gray-900">{displayName}</span>
                </span>
                <a
                  href="/auth/logout"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Login
                </a>
                <a
                  href="/auth/login?screen_hint=signup"
                  className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Sign up
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-blue-900 hover:bg-blue-50 transition-colors"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
            {/* Mobile practice areas collapse */}
            <button
              type="button"
              onClick={() => setMobileAreasOpen((v) => !v)}
              aria-expanded={mobileAreasOpen}
              className="w-full flex items-center justify-between px-3 py-3 text-base font-semibold text-gray-800 rounded-lg hover:bg-blue-50"
            >
              Practice Areas
              <svg
                className={`w-5 h-5 transition-transform ${mobileAreasOpen ? 'rotate-180' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {mobileAreasOpen && (
              <div className="pl-3 space-y-1 border-l-2 border-blue-100 ml-3 mb-2">
                {practiceAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/${area.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                  >
                    {area.title}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-base font-semibold text-gray-800 rounded-lg hover:bg-blue-50"
            >
              How It Works
            </Link>
            <Link
              href="/#membership"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-base font-semibold text-gray-800 rounded-lg hover:bg-blue-50"
            >
              Pricing
            </Link>
            <Link
              href="/#get-help"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-base font-semibold text-gray-800 rounded-lg hover:bg-blue-50"
            >
              Contact
            </Link>

            {/* Mobile auth actions */}
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Signed in as{' '}
                    <span className="font-semibold text-gray-900 break-all">{displayName}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold px-4 py-3 rounded-lg shadow-md"
                  >
                    Go to Dashboard
                  </Link>
                  <a
                    href="/auth/logout"
                    className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-4 py-3 rounded-lg transition-colors"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="block text-center border-2 border-gray-300 hover:border-blue-700 text-gray-900 font-semibold px-4 py-3 rounded-lg transition-colors"
                  >
                    Login
                  </a>
                  <a
                    href="/auth/login?screen_hint=signup"
                    className="block text-center bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold px-4 py-3 rounded-lg shadow-md"
                  >
                    Sign up
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
