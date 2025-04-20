import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import setupSwagger from "./swagger.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app); // Enable Swagger UI

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
