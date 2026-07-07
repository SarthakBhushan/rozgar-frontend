import { createContext, useState, useContext, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({children}){
    const [user, setUser] = useState(()=>{
        try{
            const stored = localStorage.getItem('rozgar_user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })

    const login = useCallback((userData, token) =>{
        localStorage.setItem('rozgar_token',token)
        localStorage.setItem('rozgar_user', JSON.stringify(userData))
        setUser(userData)
    }, [])

    const logout = useCallback(() =>{
        localStorage.removeItem('rozgar_token')
        localStorage.removeItem('rozgar_user')
        setUser(null)
    }, [])

    const isAuthenticated = Boolean(user && localStorage.getItem('rozgar_token'))

    return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
