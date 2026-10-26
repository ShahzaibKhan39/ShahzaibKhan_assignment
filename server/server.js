import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
app.use("/api/v1",router)




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})