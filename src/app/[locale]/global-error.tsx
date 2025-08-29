"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-24">
      <h2 className="text-2xl-semi text-ui-fg-base">Something went wrong!</h2>
      <button 
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  )
} 