'use client';

import { Suspense } from 'react';
import CoursContent from './CoursContent';

export default function CoursPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-16 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="w-64 h-6 bg-gray-200 rounded-lg" />
            <div className="w-96 h-4 bg-gray-100 rounded-lg" />
          </div>
        </div>
      }
    >
      <CoursContent />
    </Suspense>
  );
}
