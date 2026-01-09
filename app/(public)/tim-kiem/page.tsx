import { redirect } from 'next/navigation'

interface TimKiemPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function TimKiemPage({ searchParams }: TimKiemPageProps) {
  const params = await searchParams
  const query = params.q || ''
  return redirect(`/search?q=${encodeURIComponent(query)}`)
}
