import { createFileRoute } from '@tanstack/react-router'
import ProductsByCategory from '../../pages/ProductsByCategory'

export const Route = createFileRoute('/products/$category')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductsByCategory/>
}
