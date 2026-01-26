// resources/js/pages/error.tsx
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({ status }: { status: number }) {
  const title = {
    503: '503: Service Unavailable',
    500: '500: Server Error',
    404: '404: Page Not Found',
    403: '403: Forbidden',
  }[status]

  const description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[status]

  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <Head title={title} />
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">{status}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{description}</p>
        <div className="mt-6">
          <Link href="/">
            <Button size="lg">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
