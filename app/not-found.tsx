import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex max-w-2xl flex-col items-center py-32 text-center">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to all posts
      </Link>
    </div>
  )
}
