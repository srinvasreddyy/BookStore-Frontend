import { createFileRoute } from '@tanstack/react-router'
import Cart from "../pages/cart/Cart.jsx"
export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Cart/>
}
