import { createFileRoute } from '@tanstack/react-router'
import OldBooks from '../pages/OldBooks'

export const Route = createFileRoute('/old-books')({
  component: OldBooks,
})