import * as React from 'react'
import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { location } = useRouterState()

  // Check if path is /login or /register
  const hideLayout =
    location.pathname === '/login' || location.pathname === '/register'

  // Scroll to top whenever route changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <React.Fragment>
      {!hideLayout && <NavBar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </React.Fragment>
  )
}
