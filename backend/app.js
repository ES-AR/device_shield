import express from "express";
import cors from "cors";
import morgan from "morgan";
import deviceRoutes from "./routes/deviceRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "DeviceShield API" });
});

app.use("/api/devices", deviceRoutes);
app.use("/api/transfers", transferRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
