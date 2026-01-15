import { Suspense } from "react"
import JakartaContent from "./jakarta-content"

export default function JakartaPage() {
  return (
    <Suspense fallback={null}>
      <JakartaContent />
    </Suspense>
  )
}
