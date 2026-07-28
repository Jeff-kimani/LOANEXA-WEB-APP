import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'LOANEXA USA | Micro-Finance',
  description: 'US Manual Lending Network',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}