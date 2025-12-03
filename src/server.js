import "dotenv/config";
import express from "express";
import { PORT } from "./config.js";
import planesRoutes from "./routes/plan.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import subcriptionRoutes from "./routes/subscription.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorHandler from './middleware/error.middleware.js';

const app = express();
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/plans", planesRoutes);
app.use("/api/v1/subcriptions", subcriptionRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
