import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Resultado() {
  const location = useLocation()
  const navigate = useNavigate()

  if (!location.state) {
    navigate('/vehiculos')
    return null
  }

  const { exito, data, mensaje } = location.state

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-md mx-auto mt-10 text-center">
      {exito ? (
        <div>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">¡Reserva Exitosa!</h2>
          <p className="mb-4">Tu reservación ha sido confirmada.</p>
          <div className="bg-gray-50 p-4 rounded text-left mb-6">
            <p><strong>Código de Reserva:</strong> {data.codigoReserva}</p>
            <p><strong>Total Estimado:</strong> ${data.totalEstimado}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Reserva Rechazada</h2>
          <p className="mb-6">{mensaje}</p>
        </div>
      )}

      <Link 
        to="/vehiculos" 
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Volver al Inicio
      </Link>
    </div>
  )
}
