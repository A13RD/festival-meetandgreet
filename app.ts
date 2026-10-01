import express from "express";
import cors from "cors";

import inscripcionesMeetRoutes from "./src/interface/routes/inscripcionesMeet.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/inscripciones-meet",
  inscripcionesMeetRoutes
);

export default app;