'use client'
import { useState } from 'react'

type Product = {
  name: string
  price: number
  store: string
  unit?: string
  image?: string
  validUntil?: string
}

const STORE_COLORS: Record<string, string> = {
  'Maxi': '#e63946',
  'Metro': '#2196F3',
  'IGA': '#e53935',
  'Super C': '#ff6f00',
}

const SUGGESTIONS = ['poulet', 'lait', 'beurre', 'pain', 'oeufs', 'fromage', 'boeuf haché', 'pommes']

export default function Home() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function search(q?: string) {
    const searchQuery = q || query
    if (!searchQuery.trim()) return
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const res = await fetch(`/api/prices?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setProducts(data.products || [])
    } catch (e: any) {
      setError('Erreur lors de la recherche. Réessaie.')
      setProducts([])
    }
    setLoading(false)
  }

  const best = products[0]

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb', padding: '0 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#e63946', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛒</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>ÉpiceriePrix.ca</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>Comparez les prix au Québec</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>IGA · Metro · Maxi · Super C</div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem 2rem' }}>
        {!searched && (
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a2e', marginBottom: 12 }}>
              Arrête de payer trop cher 🍁
            </h1>
            <p style={{ fontSize: 16, color: '#666', marginBottom: 0 }}>
              Compare les prix des épiceries du Québec en temps réel
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Ex: poulet, lait, beurre..."
            style={{ flex: 1, padding: '14px 18px', borderRadius: 12, border: '1.5px solid #e0e0e0', fontSize: 15, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = '#e63946'}
            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
          />
          <button
            onClick={() => search()}
            disabled={loading}
            style={{ padding: '14px 24px', background: '#e63946', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            {loading ? '...' : 'Chercher'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2rem' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setQuery(s); search(s) }}
              style={{ padding: '6px 14px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20, fontSize: 13, cursor: 'pointer', color: '#555' }}>
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#c0392b', fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15 }}>Recherche dans IGA, Metro, Maxi, Super C...</div>
          </div>
        )}

        {!loading && best && (
          <div style={{ background: 'linear-gradient(135deg, #fff8f8, #fff)', border: '2px solid #e63946', borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 32 }}>🏆</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e63946', marginBottom: 4 }}>MEILLEUR PRIX</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>{best.name}</div>
              <div style={{ fontSize: 14, color: '#666' }}>{best.store} — <strong style={{ color: '#e63946', fontSize: 20 }}>${best.price.toFixed(2)}</strong></div>
            </div>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div style={{ display: 'grid', gap: 10 }}>
            {products.map((p, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid #ebebeb', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 16 }}>
                {p.image && <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8 }} />}
                {!p.image && <div style={{ width: 60, height: 60, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛒</div>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>{p.name}</div>
                  {p.unit && <div style={{ fontSize: 12, color: '#aaa' }}>{p.unit}</div>}
                  {p.validUntil && <div style={{ fontSize: 11, color: '#bbb' }}>Valide jusqu'au {new Date(p.validUntil).toLocaleDateString('fr-CA')}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>${p.price.toFixed(2)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: STORE_COLORS[p.store] || '#888', padding: '2px 10px', borderRadius: 20, marginTop: 4 }}>{p.store}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && products.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
            <div style={{ fontSize: 15 }}>Aucun résultat trouvé. Essaie un autre terme.</div>
          </div>
        )}
      </div>
    </div>
  )
}
