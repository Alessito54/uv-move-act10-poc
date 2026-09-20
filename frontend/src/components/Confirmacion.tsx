import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Confirmacion({ session }: { session: any }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  if (!location.state) {
    navigate('/vehiculos')
    return null
  }

  const { vehiculoId, data, inicio, fin } = location.state
  
  const inicioDate = new Date(inicio)
  const finDate = new Date(fin)
  const duracionMinutos = (finDate.getTime() - inicioDate.getTime()) / 60000
  const horas = duracionMinutos / 60
  const totalEstimado = (horas * data.politica.tarifaHora).toFixed(2)

  const confirmarReserva = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/reservaciones`, {
        vehiculoId,
        inicio: inicioDate.toISOString(),
        fin: finDate.toISOString()
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      
      navigate('/resultado', { state: { exito: true, data: response.data } })
    } catch (error: any) {
      console.error(error)
      const mensaje = error.response?.data?.error || "Error desconocido"
      navigate('/resultado', { state: { exito: false, mensaje } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Confirmar Reserva</h2>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2 text-blue-800">Resumen de la Operación</h3>
        <p><strong>Vehículo:</strong> {data.vehiculo.TIPONOMBRE || data.vehiculo.tipoNombre} ({data.vehiculo.CODIGO || data.vehiculo.codigo})</p>
        <p><strong>Inicio:</strong> {inicioDate.toLocaleString()}</p>
        <p><strong>Fin:</strong> {finDate.toLocaleString()}</p>
        <p><strong>Duración:</strong> {duracionMinutos.toFixed(0)} minutos</p>
        <hr className="my-2 border-blue-200" />
        <p className="text-xl font-bold text-blue-900">Total Estimado: ${totalEstimado}</p>
      </div>

      <div className="flex justify-end gap-2">
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={loading}
        >
          Volver
        </button>
        <button 
          onClick={confirmarReserva} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Confirmar y Reservar'}
        </button>
      </div>
    </div>
  )
}
