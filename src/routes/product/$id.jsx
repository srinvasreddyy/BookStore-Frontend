import { createFileRoute } from '@tanstack/react-router'
import SingleProduct from '../../pages/SingleProduct'

export const Route = createFileRoute('/product/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SingleProduct />
}
