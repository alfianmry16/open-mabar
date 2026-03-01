interface LoadingPageProps {
  label?: string
  fullScreen?: boolean
}

export function LoadingPage({ label = 'Memuat...', fullScreen = true }: LoadingPageProps) {
  return (
    <div
      className={`flex items-center justify-center bg-slate-50 dark:bg-slate-950 ${fullScreen ? 'min-h-screen' : 'min-h-[60vh] flex-1'
        }`}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo mark */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-xl opacity-40 scale-110 animate-pulse" />

          {/* Icon box */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 text-white"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        {/* Animated dots loader */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
                style={{
                  animation: `loading-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide">
            {label}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes loading-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
