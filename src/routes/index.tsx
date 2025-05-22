import { createFileRoute } from '@tanstack/react-router'
import KeywordToCsvConverter from "@/convert-to-csv.tsx";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <KeywordToCsvConverter/>
}
