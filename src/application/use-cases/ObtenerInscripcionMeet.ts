import { AppError } from "../AppError.js";
import { InscripcionMeetRepository } from "../../domain/repositories/InscripcionMeetRepository.js";

export class ObtenerInscripcionMeet {
  constructor(
    private readonly repository: InscripcionMeetRepository
  ) {}

  async execute(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "El id debe ser un entero positivo");
    }

    const inscription = await this.repository.obtenerPorId(id);

    if (!inscription) {
      throw new AppError(404, "Inscripción no encontrada");
    }

    return inscription;
  }
}