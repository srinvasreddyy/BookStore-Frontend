import { createFileRoute } from '@tanstack/react-router'
import Specials from '../pages/Specials'

export const Route = createFileRoute('/specials')({
  component: Specials,
})