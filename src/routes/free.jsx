import { createFileRoute } from '@tanstack/react-router'
import FreeContent from '../pages/FreeContent'

export const Route = createFileRoute('/free')({
  component: FreeContent,
})