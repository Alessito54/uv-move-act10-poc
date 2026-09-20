import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ReservaDetail({ session }: { session: any }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/vehiculos/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        setData(response.data)
        
        // Sets default times (now to +1 hour)
        const now = new Date()
        const end = new Date(now.getTime() + 60 * 60 * 1000)
        
        // Format to datetime-local string
        const toLocalISO = (d: Date) => {
          const tzOffset = d.getTimezoneOffset() * 60000; 
          return new Date(d.getTime() - tzOffset).toISOString().slice(0,16);
        }
        
        setInicio(toLocalISO(now))
        setFin(toLocalISO(end))
      } catch (error) {
        console.error("Error", error)
        alert("Error cargando detalles del vehículo")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, session])

  if (loading) return <div className="text-center mt-10">Cargando detalles...</div>
  if (!data) return <div className="text-center mt-10">Vehículo no encontrado</div>

  const handleNext = () => {
    const inicioDate = new Date(inicio)
    const finDate = new Date(fin)
    if (inicioDate >= finDate) {
      alert("La fecha de fin debe ser posterior a la de inicio")
      return
    }
    navigate('/confirmar', { state: { vehiculoId: id, data, inicio, fin } })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Detalle y Reserva</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded border">
        <h3 className="text-lg font-semibold mb-2">Información del Vehículo</h3>
        <p><strong>Tipo:</strong> {data.vehiculo.TIPONOMBRE || data.vehiculo.tipoNombre}</p>
        <p><strong>Código:</strong> {data.vehiculo.CODIGO || data.vehiculo.codigo}</p>
        
        <h3 className="text-lg font-semibold mt-4 mb-2">Política Aplicable</h3>
        <p><strong>Tarifa por hora:</strong> ${data.politica.tarifaHora}</p>
        <p><strong>Tiempo máximo:</strong> {data.politica.tiempoMaxMin} minutos</p>
        <p><strong>Restricciones:</strong> {data.politica.restricciones}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Seleccionar Periodo</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Inicio</label>
            <input 
              type="datetime-local" 
              className="mt-1 p-2 w-full border rounded"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Fin</label>
            <input 
              type="datetime-local" 
              className="mt-1 p-2 w-full border rounded"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Cancelar
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Siguiente
        </button>
      </div>
    </div>
  )
}
