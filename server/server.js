import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import db from "./models/index.js";
import cors from "cors";
dotenv.config();

const app = express();

app.use((req, res, next) => {
  req.method = req.method.toUpperCase();
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
})

app.use(express.json());
app.use(cors());
cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
app.use("/api/v1", router)


app.get("/", (req, res) => {
  res.send("Server is running");
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.message || 500).json({ sucess: false, message: err.message || "Internal Server Error" });
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
})

// Start server
const server = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully");

    await db.sequelize.sync({ alter: true });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

server();