'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Alerte = { id: string; produit: string; prix_max: number; created_at: string }
type User = { email: string; nom?: string }

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [produit, setProduit] = useState('')
  const [prixMax, setPrixMax] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { window.location.href = '/login'; return }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', u.id).single()
      setUser({ email: u.email || '', nom: profile?.nom })
      const { data: a } = await supabase.from('alertes').select('*').eq('user_id', u.id).order('created_at', { ascending: false })
      setAlertes(a || [])
      setLoading(false)
    }
    load()
  }, [])

  async function addAlerte() {
    if (!produit) return
    setSaving(true)
    const { data: { user: u } } = await supabase.auth.getUser()
    const { data } = await supabase.from('alertes').insert({
      user_id: u?.id,
      produit,
      prix_max: prixMax ? parseFloat(prixMax) : null
    }).select().single()
    if (data) setAlertes(a => [data, ...a])
    setProduit('')
    setPrixMax('')
    setSaving(false)
  }

  async function deleteAlerte(id: string) {
    await supabase.from('alertes').delete().eq('id', id)
    setAlertes(a => a.filter(x => x.id !== id))
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 15, color: '#aaa' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb', padding: '0 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" style={{ width: 36, height: 36, background: '#e63946', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>🛒</Link>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Bonjour {user?.nom || ''} 👋</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/" style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 13, color: '#555', textDecoration: 'none' }}>Chercher</Link>
            <button onClick={logout} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 13, color: '#e63946', background: 'transparent', cursor: 'pointer' }}>Déconnexion</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, color: '#1a1a2e', marginBottom: '1.5rem' }}>Mes alertes de prix 🔔</h2>

        <div style={{ background: '#fff', border: '1.5px solid #ebebeb', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: '#1a1a2e' }}>Nouvelle alerte</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input placeholder="Produit (ex: lait, poulet...)" value={produit}
              onChange={e => setProduit(e.target.value)}
              style={{ flex: 2, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 14 }} />
            <input placeholder="Prix max ($)" value={prixMax} type="number"
              onChange={e => setPrixMax(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 14 }} />
            <button onClick={addAlerte} disabled={saving}
              style={{ padding: '10px 20px', background: '#e63946', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
              {saving ? '...' : '+ Ajouter'}
            </button>
          </div>
        </div>

        {alertes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
            <div style={{ fontSize: 15 }}>Aucune alerte encore. Ajoutes-en une !</div>
          </div>
        )}

        {alertes.map(a => (
          <div key={a.id} style={{ background: '#fff', border: '1.5px solid #ebebeb', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: '#fff8f8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔔</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>{a.produit}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>
                  {a.prix_max ? `Alerte si moins de $${a.prix_max.toFixed(2)}` : 'Alerte pour tout changement de prix'}
                </div>
              </div>
            </div>
            <button onClick={() => deleteAlerte(a.id)}
              style={{ padding: '6px 12px', background: '#fff0f0', color: '#e63946', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
