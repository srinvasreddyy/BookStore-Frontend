import { createFileRoute, redirect } from '@tanstack/react-router'
import VerifyOTP from '../pages/VerifyOTP'

export const Route = createFileRoute('/verify-otp')({
  component: RouteComponent,
  validateSearch: (search) => ({
    email: search.email,
  }),
  beforeLoad: ({ search }) => {
    if (!search.email) {
      throw redirect({
        to: '/forgot-password',
        search: {},
      })
    }
  },
})

function RouteComponent() {
  return <VerifyOTP/>
}