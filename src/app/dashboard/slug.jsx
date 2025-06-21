"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardSlug({ params }) {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white">Redirecting to dashboard...</div>
    </div>
  );
}