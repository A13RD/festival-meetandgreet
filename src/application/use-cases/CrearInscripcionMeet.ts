import { AppError } from "../AppError.js";
import { InscripcionMeetRepository } from "../../domain/repositories/InscripcionMeetRepository.js";

export class CrearInscripcionMeet {
  constructor(
    private readonly repository: InscripcionMeetRepository
  ) {}

  async execute(asistenteId: unknown, showId: unknown) {
    if (
      !Number.isInteger(asistenteId) ||
      !Number.isInteger(showId)
    ) {
      throw new AppError(
        400,
        "asistente_id y show_id son obligatorios y deben ser enteros"
      );
    }

    const asistenteIdNumber = Number(asistenteId);
    const showIdNumber = Number(showId);

    const asistenteExiste =
      await this.repository.existeAsistente(asistenteIdNumber);

    if (!asistenteExiste) {
      throw new AppError(404, "Asistente no encontrado");
    }

    const show = await this.repository.obtenerShow(showIdNumber);

    if (!show) {
      throw new AppError(404, "Show no encontrado");
    }

    const tieneBoleta =
      await this.repository.tieneBoletaVipOPlatino(
        asistenteIdNumber,
        show.dia_id
      );

    if (!tieneBoleta) {
      throw new AppError(
        409,
        "El asistente necesita una boleta activa VIP o PLATINO para el día del show"
      );
    }

    const yaExiste =
      await this.repository.existeInscripcionActiva(
        asistenteIdNumber,
        showIdNumber
      );

    if (yaExiste) {
      throw new AppError(
        409,
        "El asistente ya está inscrito en este show"
      );
    }

    const ocupados =
      await this.repository.contarInscripcionesActivas(showIdNumber);

    if (ocupados >= 3) {
      throw new AppError(
        409,
        "El show ya tiene el máximo de 3 inscritos"
      );
    }

    return this.repository.crear(asistenteIdNumber, showIdNumber);
  }
}