import { Router } from "express";

import { InscripcionMeetController } from "../controllers/InscripcionMeetController.js";

import { PrismaInscripcionMeetRepository } from "../../infrastructure/repositories/PrismaInscripcionMeetRepository.js";

import { ListarInscripcionesMeet } from "../../application/use-cases/ListarInscripcionesMeet.js";
import { ObtenerInscripcionMeet } from "../../application/use-cases/ObtenerInscripcionMeet.js";
import { CrearInscripcionMeet } from "../../application/use-cases/CrearInscripcionMeet.js";
import { ActualizarInscripcionMeet } from "../../application/use-cases/ActualizarInscripcionMeet.js";
import { EliminarInscripcionMeet } from "../../application/use-cases/EliminarInscripcionMeet.js";
import { ObtenerInscripcionesPorShow } from "../../application/use-cases/ObtenerInscripcionesPorShow.js";

const router = Router();

const repository =
  new PrismaInscripcionMeetRepository();

const controller = new InscripcionMeetController(
  new ListarInscripcionesMeet(repository),
  new ObtenerInscripcionMeet(repository),
  new CrearInscripcionMeet(repository),
  new ActualizarInscripcionMeet(repository),
  new EliminarInscripcionMeet(repository),
  new ObtenerInscripcionesPorShow(repository)
);

router.get("/", controller.listarHandler);

router.get(
  "/show/:showId",
  controller.porShowHandler
);

router.get(
  "/:id",
  controller.obtenerHandler
);

router.post(
  "/",
  controller.crearHandler
);

router.patch(
  "/:id",
  controller.actualizarHandler
);

router.delete(
  "/:id",
  controller.eliminarHandler
);

export default router;