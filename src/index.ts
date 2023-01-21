import http from "http";
import Express from "express";
import cors from "cors";
import { Server } from "socket.io";
import multer from "multer";
import rimraf from "rimraf";

import { upload as uploadToS3 } from "./utils/UploadS3";
import { scanFile } from "./utils/OCRFile";
import createExel from "./utils/createExel";
const app = Express();
app.use(cors({
    origin: ["http://localhost:5173", "https://pdf2attend.xyz","https://www.pdf2attend.xyz"],
}));
app.use(Express.json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://pdf2attend.xyz","https://www.pdf2attend.xyz"],
    }
});

const upload = multer({ dest: "uploads/" });

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("init",async (data) => {
        const { name } = data;
        console.log("init", name);
        if (!name) return socket.emit("error", "No URL provided");
        const result = await scanFile(name, socket);
       
        const filteredResult = result.filter((page) => page).map((page) => page.filter((row) => row));
        socket.emit("result", filteredResult);
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
 });
app.post("/upload", upload.single("file"),async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).send("No file uploaded.");
        return;
    }
    const url = await uploadToS3(file.path, file.filename);
    await rimraf(file.path)
    res.status(200).json({
        url,
        name: file.filename,
    });
 })
app.post("/create-xlsx", async (req, res) => {
    const { data } = req.body;
    if (!data) { 
        res.status(400).send("No data provided");
        return;
    }
    try { 
        const result =await createExel(data);
        res.status(200).json({
            s3: result,
        })
    }
    catch (err) { 
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})
app.get("/file/:fileName",async (req, res) => {
    const { fileName } = req.params;
    if (!fileName) {
        res.status(400).send("No file name provided");
        return;
    }
    res.download(`uploads/${fileName}`);
    await rimraf(`uploads/${fileName}`);
});
app.get("/", (req, res) => {
    res.send("Hello World");
});
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => { 
    console.log("Server is running on port", PORT);
})

