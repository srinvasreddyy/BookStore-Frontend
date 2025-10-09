import { createFileRoute } from '@tanstack/react-router'
import CheckoutPage from '../pages/CheckoutPage'

export const Route = createFileRoute('/checkout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CheckoutPage/>
}
