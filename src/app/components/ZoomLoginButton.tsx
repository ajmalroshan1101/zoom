'use client';

export default function ZoomLoginButton() {
  return (
    <a
      href="/api/auth/zoom"
      className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
    >
      <svg
        className="w-6 h-6 mr-2"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M4.585 8.354a1.5 1.5 0 0 0-.5 1.12v5.052a1.5 1.5 0 0 0 .5 1.12l4.5 4.052a1.5 1.5 0 0 0 2-.02l2.5-2.25a1.5 1.5 0 0 0 .5-1.12V8.354a1.5 1.5 0 0 0-.5-1.12l-2.5-2.25a1.5 1.5 0 0 0-2-.02L4.585 8.354z"/>
      </svg>
      Sign in with Zoom
    </a>
  );
}