import { Suspense } from "react"
import LampungContent from "./lampung-content"

export default function LampungPage() {
  return (
    <Suspense fallback={null}>
      <LampungContent />
    </Suspense>
  )
}
