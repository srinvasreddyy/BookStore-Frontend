import { createFileRoute, redirect } from '@tanstack/react-router'
import ResetPassword from '../pages/ResetPassword'

export const Route = createFileRoute('/reset-password')({
  component: RouteComponent,
  validateSearch: (search) => ({
    email: search.email,
    otp: search.otp,
  }),
  beforeLoad: ({ search }) => {
    if (!search.email || !search.otp) {
      throw redirect({
        to: '/forgot-password',
        search: {},
      })
    }
  },
})

function RouteComponent() {
  return <ResetPassword/>
}