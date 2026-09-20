import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import VehiculosList from './components/VehiculosList'
import ReservaDetail from './components/ReservaDetail'
import Confirmacion from './components/Confirmacion'
import Resultado from './components/Resultado'

function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <header className="w-full bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">UV Move - Actividad 10</h1>
          {session && (
            <button 
              onClick={() => supabase.auth.signOut()}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          )}
        </header>

        <main className="flex-1 w-full max-w-4xl p-4">
          <Routes>
            <Route 
              path="/" 
              element={!session ? <Login /> : <Navigate to="/vehiculos" />} 
            />
            <Route 
              path="/vehiculos" 
              element={session ? <VehiculosList session={session} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/vehiculos/:id" 
              element={session ? <ReservaDetail session={session} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/confirmar" 
              element={session ? <Confirmacion session={session} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/resultado" 
              element={session ? <Resultado /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
