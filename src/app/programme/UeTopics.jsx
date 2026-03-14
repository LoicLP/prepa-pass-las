'use client';

import { useState } from 'react';

export default function UeTopics({ topics }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Th&egrave;mes abord&eacute;s</h3>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {expanded && (
        <ul className="grid sm:grid-cols-2 gap-2 mt-3">
          {topics.map((t, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
