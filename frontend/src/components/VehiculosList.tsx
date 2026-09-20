import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function VehiculosList({ session }: { session: any }) {
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await axios.get(`${API_URL}/vehiculos`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
        // Filtrar solo los disponibles para cumplir la regla
        const disponibles = response.data.filter((v: any) => v.ESTADO === 'DISPONIBLE' || v.estado === 'DISPONIBLE')
        setVehiculos(disponibles)
      } catch (error) {
        console.error("Error cargando vehículos", error)
        alert("Error cargando vehículos. Asegúrate de que el backend y Db2 estén corriendo.")
      } finally {
        setLoading(false)
      }
    }

    fetchVehiculos()
  }, [session])

  if (loading) return <div className="text-center mt-10">Cargando vehículos...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Vehículos Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehiculos.map((v) => (
          <div key={v.ID || v.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{v.TIPONOMBRE || v.tipoNombre}</h3>
              <p className="text-sm text-gray-500">Código: {v.CODIGO || v.codigo}</p>
              <p className="text-sm text-gray-500">{v.TIPODESCRIPCION || v.tipoDescripcion}</p>
            </div>
            <button
              onClick={() => navigate(`/vehiculos/${v.ID || v.id}`)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Reservar
            </button>
          </div>
        ))}
        {vehiculos.length === 0 && <p>No hay vehículos disponibles en este momento.</p>}
      </div>
    </div>
  )
}
