import express from "express";
import cors from "cors";
import chatRoute from "./routes/chat.js";

console.log("✅ index.js started");

const app = express();

app.use(cors());
app.use(express.json());

console.log("✅ middleware loaded");

app.use("/api/chat", chatRoute);
console.log("✅ /api/chat route mounted");

app.get("/", (req, res) => {
  res.send("Suvidha Chatbot API Running...");
});

app.listen(5000, () => console.log("Server running on port 5000"));
