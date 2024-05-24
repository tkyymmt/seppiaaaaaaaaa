'use client';

import MainLayout from '../components/MainLayout';

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout >{children}</MainLayout>
  )
}
