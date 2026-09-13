import { NextResponse } from 'next/server';
import { facStats } from '@/lib/facStats';
import { facById } from '@/data/facs';

export const dynamic = 'force-dynamic';

/* Inscrits et confirmations de barème pour une faculté (agrégat anonyme, cache 1 h). */
export async function GET(request) {
  const fac = new URL(request.url).searchParams.get('fac');
  if (!fac || !facById(fac)) return NextResponse.json({ error: 'Faculté inconnue' }, { status: 400 });
  try {
    const st = await facStats(fac);
    return NextResponse.json({ fac, ...st }, { headers: { 'Cache-Control': 'public, max-age=600' } });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
