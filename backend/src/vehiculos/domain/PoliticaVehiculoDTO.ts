export interface PoliticaVehiculoDTO {
    id: string;
    tipoId: string;
    tarifaHora: number;
    tiempoMaxMin: number;
    restricciones: string;
    vigente: boolean;
}
