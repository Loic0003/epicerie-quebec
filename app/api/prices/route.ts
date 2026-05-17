import { NextRequest, NextResponse } from 'next/server'
import { scrapeFlipp } from '@/lib/scraper'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || ''
  if (!query) return NextResponse.json({ error: 'Query manquante' }, { status: 400 })
  try {
    const products = await scrapeFlipp(query)
    return NextResponse.json({ products, query })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur scraping' }, { status: 500 })
  }
}
