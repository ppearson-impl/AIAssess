'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Assessment from '@/components/Assessment';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return <Assessment />;
}
