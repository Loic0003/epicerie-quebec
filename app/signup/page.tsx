'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function signup() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, nom })
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f8fc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem', width: 380, textAlign: 'center', border: '1.5px solid #ebebeb' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📬</div>
        <h2 style={{ fontWeight: 700, color: '#1a1a2e' }}>Vérifie ton courriel !</h2>
        <p style={{ color: '#888', fontSize: 14, marginTop: 8 }}>On t&apos;a envoyé un lien de confirmation à <strong>{email}</strong></p>
        <Link href="/login" style={{ display: 'block', marginTop: 20, color: '#e63946', fontWeight: 600, fontSize: 14 }}>Retour à la connexion</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f8fc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem', width: 380, border: '1.5px solid #ebebeb' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, background: '#e63946', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 1rem' }}>🛒</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Créer un compte</h1>
          <p style={{ fontSize: 14, color: '#888', marginTop: 6 }}>Gratuit — Alertes de prix incluses</p>
        </div>
        <input type="text" placeholder="Ton prénom" value={nom}
          onChange={e => setNom(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #e0e0e0', marginBottom: 10, fontSize: 14, boxSizing: 'border-box' }} />
        <input type="email" placeholder="Courriel" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #e0e0e0', marginBottom: 10, fontSize: 14, boxSizing: 'border-box' }} />
        <input type="password" placeholder="Mot de passe" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && signup()}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #e0e0e0', marginBottom: 12, fontSize: 14, boxSizing: 'border-box' }} />
        {error && <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: '#c0392b' }}>{error}</div>}
        <button onClick={signup} disabled={loading}
          style={{ width: '100%', padding: 13, background: '#e63946', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontWeight: 600 }}>
          {loading ? 'Création...' : 'Créer mon compte →'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#888' }}>
          Déjà un compte ? <Link href="/login" style={{ color: '#e63946', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
