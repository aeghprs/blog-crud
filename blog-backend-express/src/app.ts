import express from "express";
import cors from "cors";

import authRoutes from "@/routes/auth.routes";
import categoryRoutes from "@/routes/cat.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: `Backend server running successfully on ${PORT}`,
  });
});

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;