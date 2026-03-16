'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const CATEGORIES = [
  { id: 'bug', label: 'Signaler un bug', icon: '🐛' },
  { id: 'suggestion', label: 'Suggestion', icon: '💡' },
  { id: 'question', label: 'Question', icon: '❓' },
  { id: 'autre', label: 'Autre', icon: '📩' },
];

export default function ContactPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    const cat = CATEGORIES.find(c => c.id === category);
    const userEmail = user?.email || '';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, category: cat?.label || category, subject, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez r\u00e9essayer.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
            Nous <span className="bg-gradient-to-r from-primary-600 via-violet-500 to-primary-600 bg-clip-text text-transparent">contacter</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Un bug, une suggestion ou une question ? N&apos;h&eacute;sitez pas &agrave; nous &eacute;crire.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          {sent ? (
            /* ---- Success state ---- */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Message envoy&eacute; !</h2>
              <p className="text-gray-500 mb-6">
                Merci pour votre message. Notre &eacute;quipe vous r&eacute;pondra dans les plus brefs d&eacute;lais &agrave; l&apos;adresse <span className="font-medium text-gray-700">{user?.email}</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { setSent(false); setSubject(''); setMessage(''); }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Envoyer un autre message
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
                >
                  Retour &agrave; l&apos;accueil
                </Link>
              </div>
            </div>
          ) : (
            /* ---- Contact form ---- */
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {/* Category selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">Cat&eacute;gorie</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        category === cat.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-xs">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email connecté */}
              {user?.email && (
                <div className="mb-5 p-3 bg-violet-50 border border-violet-100 rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-sm text-violet-700">R&eacute;ponse envoy&eacute;e &agrave; : <span className="font-bold">{user.email}</span></span>
                </div>
              )}

              {/* Subject */}
              <div className="mb-5">
                <label htmlFor="subject" className="block text-sm font-bold text-gray-900 mb-2">Sujet</label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Erreur lors du lancement d'un QCM"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="D&eacute;crivez votre probl&egrave;me ou votre suggestion en d&eacute;tail..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    Envoyer le message
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Votre message sera envoy&eacute; &agrave; notre &eacute;quipe support.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
