import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rothy's Official Homepage - Exact Replica",
  description: "Complete replica of Rothy's homepage with all CSS and JavaScript",
}

export default function RothysHomepage() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/rothys-static/index.html"
        className="w-full h-full border-0"
        title="Rothy's Homepage - Local Assets"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
      />
    </div>
  )
}
