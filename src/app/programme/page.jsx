import Link from 'next/link';
import { PROGRAMME_DATA } from '@/data/programme';
import UeTopics from './UeTopics';

const UE_ICON_STYLES = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

export const metadata = {
  title: 'Programme PASS/LAS - Pr\u00e9pa PASS/LAS',
  description: 'D\u00e9couvrez le programme d\u00e9taill\u00e9 des 6 UE du tronc commun PASS/LAS : anatomie, chimie, biologie cellulaire, biostatistiques, biophysique et SSH.',
};

export default function ProgrammePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-14 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="absolute w-[300px] h-[300px] bg-violet-300/8 rounded-full blur-[80px] top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="geo-circle-light w-40 h-40 top-20 right-[8%] hidden lg:block"></div>
        <div className="geo-ring-light w-56 h-56 -bottom-12 left-[3%] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-primary-200 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                <span className="text-sm font-semibold text-primary-700">Tronc commun officiel</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
                Le programme <span className="programme-gradient-text">PASS/LAS</span> d&eacute;taill&eacute;
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                Retrouvez le d&eacute;tail des <strong className="text-gray-900">6 Unit&eacute;s d&apos;Enseignement</strong> du tronc commun de la premi&egrave;re ann&eacute;e de sant&eacute;. Chaque UE est d&eacute;crypt&eacute;e avec ses <strong className="text-gray-900">th&egrave;mes, coefficients</strong> et volumes horaires.
              </p>
              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                <div className="prog-stat flex items-center gap-3" style={{ transition: 'transform 0.2s ease' }}>
                  <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">6</div>
                    <div className="text-xs font-medium text-gray-500">UE au programme</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
                <div className="prog-stat flex items-center gap-3" style={{ transition: 'transform 0.2s ease' }}>
                  <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">~800h</div>
                    <div className="text-xs font-medium text-gray-500">Volume horaire</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
                <div className="prog-stat flex items-center gap-3" style={{ transition: 'transform 0.2s ease' }}>
                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">100%</div>
                    <div className="text-xs font-medium text-gray-500">Programme couvert</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 6 UE mini cards grid */}
            <div className="hidden lg:block relative h-[340px]">
              {/* Row 1: 3 cards */}
              <div className="absolute top-0 left-0 w-[155px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-500/10 border border-indigo-100/50 p-4 ue-float">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-2.5">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                </div>
                <div className="text-sm font-bold text-gray-900">Anatomie</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Coeff. 5 &middot; 80h</div>
              </div>

              <div className="absolute top-2 left-[175px] w-[155px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-emerald-500/10 border border-emerald-100/50 p-4 ue-float ue-float-delay-1">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-2.5">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                </div>
                <div className="text-sm font-bold text-gray-900">Chimie / Biochimie</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Coeff. 5 &middot; 80h</div>
              </div>

              <div className="absolute top-0 right-0 w-[155px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-violet-500/10 border border-violet-100/50 p-4 ue-float ue-float-delay-2">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-2.5">
                  <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                </div>
                <div className="text-sm font-bold text-gray-900">Biologie cellulaire</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Coeff. 5 &middot; 80h</div>
              </div>

              {/* Row 2: 3 cards */}
              <div className="absolute bottom-12 left-[10px] w-[155px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-cyan-500/10 border border-cyan-100/50 p-4 ue-float ue-float-delay-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center mb-2.5">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                </div>
                <div className="text-sm font-bold text-gray-900">Biostatistiques</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Coeff. 4 &middot; 60h</div>
              </div>

              <div className="absolute bottom-6 left-[185px] w-[155px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-100/50 p-4 ue-float ue-float-delay-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-2.5">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
                </div>
                <div className="text-sm font-bold text-gray-900">Biophysique</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Coeff. 4 &middot; 60h</div>
              </div>

              <div className="absolute bottom-14 right-[5px] w-[155px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-rose-500/10 border border-rose-100/50 p-4 ue-float ue-float-delay-5">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mb-2.5">
                  <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                </div>
                <div className="text-sm font-bold text-gray-900">SSH / &Eacute;thique</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Coeff. 4 &middot; 60h</div>
              </div>

              {/* Decorative center element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-100/30 rounded-3xl rotate-12 blur-[3px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* UE List */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {PROGRAMME_DATA.map((ue, i) => (
            <div key={ue.id} className={`mb-12 ${i > 0 ? 'pt-12 border-t border-gray-200' : ''}`} id={`ue-${ue.id}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className={`w-16 h-16 ${UE_ICON_STYLES[ue.color] || 'bg-indigo-50 text-indigo-600'} rounded-2xl flex items-center justify-center shrink-0`}
                  dangerouslySetInnerHTML={{ __html: ue.icon }}
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-2xl font-black text-gray-900">{ue.name}</h2>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">Coeff. {ue.coeff}</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{ue.hours}h de cours</span>
                  </div>
                  <p className="text-gray-600 mb-5 leading-relaxed">{ue.description}</p>
                  <UeTopics topics={ue.topics} />
                  <Link href="/qcm" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                    S&apos;entra&icirc;ner en {ue.name}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Pr&ecirc;t &agrave; tester vos connaissances ?</h2>
          <p className="text-primary-200 text-lg mb-8">Entra&icirc;nez-vous sur chaque mati&egrave;re avec nos QCM illimit&eacute;s.</p>
          <Link href="/qcm" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-400 transition-colors shadow-xl">
            Commencer un QCM
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
