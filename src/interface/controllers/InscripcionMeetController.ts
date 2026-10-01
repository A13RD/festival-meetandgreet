import { Request, Response } from "express";
import { AppError } from "../../application/AppError.js";

import { ListarInscripcionesMeet } from "../../application/use-cases/ListarInscripcionesMeet.js";
import { ObtenerInscripcionMeet } from "../../application/use-cases/ObtenerInscripcionMeet.js";
import { CrearInscripcionMeet } from "../../application/use-cases/CrearInscripcionMeet.js";
import { ActualizarInscripcionMeet } from "../../application/use-cases/ActualizarInscripcionMeet.js";
import { EliminarInscripcionMeet } from "../../application/use-cases/EliminarInscripcionMeet.js";
import { ObtenerInscripcionesPorShow } from "../../application/use-cases/ObtenerInscripcionesPorShow.js";

export class InscripcionMeetController {
  constructor(
    private readonly listar: ListarInscripcionesMeet,
    private readonly obtener: ObtenerInscripcionMeet,
    private readonly crear: CrearInscripcionMeet,
    private readonly actualizar: ActualizarInscripcionMeet,
    private readonly eliminar: EliminarInscripcionMeet,
    private readonly porShow: ObtenerInscripcionesPorShow
  ) {}

  private error(res: Response, error: unknown) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }

  listarHandler = async (req: Request, res: Response) => {
    try {
      const page = req.query.page
        ? Number(req.query.page)
        : 1;

      const limit = req.query.limit
        ? Number(req.query.limit)
        : 10;

      const showId = req.query.show_id !== undefined
        ? Number(req.query.show_id)
        : undefined;

      const asistenteId = req.query.asistente_id !== undefined
        ? Number(req.query.asistente_id)
        : undefined;

      if (
        showId !== undefined &&
        (!Number.isInteger(showId) || showId <= 0)
      ) {
        throw new AppError(400, "show_id debe ser un entero positivo");
      }

      if (
        asistenteId !== undefined &&
        (!Number.isInteger(asistenteId) || asistenteId <= 0)
      ) {
        throw new AppError(
          400,
          "asistente_id debe ser un entero positivo"
        );
      }

      const result = await this.listar.execute(
        page,
        limit,
        showId,
        asistenteId
      );

      return res.status(200).json(result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  obtenerHandler = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const result = await this.obtener.execute(id);

      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      return this.error(res, error);
    }
  };

  crearHandler = async (req: Request, res: Response) => {
    try {
      const result = await this.crear.execute(
        req.body?.asistente_id,
        req.body?.show_id
      );

      return res.status(201).json({
        data: result,
      });
    } catch (error) {
      return this.error(res, error);
    }
  };

  actualizarHandler = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const result = await this.actualizar.execute(
        id,
        req.body ?? {}
      );

      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      return this.error(res, error);
    }
  };

  eliminarHandler = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const result = await this.eliminar.execute(id);

      return res.status(200).json(result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  porShowHandler = async (req: Request, res: Response) => {
    try {
      const showId = Number(req.params.showId);

      const result = await this.porShow.execute(showId);

      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      return this.error(res, error);
    }
  };
}