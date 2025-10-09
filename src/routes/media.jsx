import { createFileRoute } from '@tanstack/react-router'
import MediaCoverage from '../pages/MediaCoverage'

export const Route = createFileRoute('/media')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MediaCoverage/>
}
