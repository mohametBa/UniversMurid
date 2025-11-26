'use client';

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>
  signInWithGoogle: () => Promise<{ data: any; error: any }>
  signOut: (manual?: boolean) => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ data: any; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Récupérer la session initiale avec nettoyage si nécessaire
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error)
          // Nettoyer les cookies en cas d'erreur
          await supabase.auth.signOut()
          setUser(null)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error)
        setUser(null)
      }
      setLoading(false)
    }

    getSession()

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Changement d\'état d\'authentification:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Créer une session utilisateur dans la base de données
        if (session?.user && event === 'SIGNED_IN') {
          await createUserSession(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          await endUserSession(session?.user?.id)
        } else if (event === 'TOKEN_REFRESHED') {
          // Refresh du token - rien à faire, la session est déjà mise à jour
        } else if (event === 'USER_UPDATED') {
          // Mise à jour de l'utilisateur - rien à faire
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createUserSession = async (userId: string) => {
    try {
      const supabase = createClient()
      await supabase.from('user_sessions').insert({
        user_id: userId,
        session_start: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error)
    }
  }

  const endUserSession = async (userId?: string) => {
    if (!userId) return
    
    try {
      const supabase = createClient()
      // Marquer la session comme terminée
      await supabase
        .from('user_sessions')
        .update({ session_end: new Date().toISOString() })
        .eq('user_id', userId)
        .is('session_end', null)
        .order('session_start', { ascending: false })
        .limit(1)
    } catch (error) {
      console.error('Erreur lors de la fin de la session:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (result.data?.user) {
      await createUserSession(result.data.user.id)
    }
    
    return result
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabase = createClient()
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return result
  }

  const signInWithGoogle = async () => {
    const supabase = createClient()
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return result
  }

  // Fonction de nettoyage forcé de toutes les données de session
  const forceCleanupSession = () => {
    if (typeof window !== 'undefined') {
      // Nettoyer le localStorage (toutes les clés Supabase)
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Nettoyer le sessionStorage
      sessionStorage.clear()
      
      // Nettoyer tous les cookies liés à Supabase
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/;domain=." + window.location.hostname)
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/")
      })
      
      console.log('Nettoyage forcé de la session effectué')
    }
  }

  const signOut = async (manual = false) => {
    try {
      const supabase = createClient()
      
      // Nettoyer l'état utilisateur local immédiatement
      setUser(null)
      
      // Nettoyage forcé des données de session
      forceCleanupSession()
      
      // Déconnecter de Supabase avec nettoyage complet
      const result = await supabase.auth.signOut({
        scope: 'global' // S'assurer que toutes les sessions sont fermées
      })
      
      if (manual) {
        console.log('Déconnexion manuelle réussie:', result)
      }
      
      // Attendre un peu pour s'assurer que tout est nettoyé
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Redirection vers la page d'accueil
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      
      return result
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      
      // Même en cas d'erreur, forcer le nettoyage local
      setUser(null)
      forceCleanupSession()
      
      // Redirection forcée en cas d'erreur
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/'
        }, 100)
      }
      
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    const supabase = createClient()
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}