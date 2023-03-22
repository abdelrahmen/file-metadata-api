import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("upfile");

const app = express();

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.json({
        success: false,
        message: err,
      });
    } else {
      if (req.file == undefined) {
        res.json({
          success: false,
          message: "Error: No file selected!",
        });
      } else {
        res.json({
          name: req.file.originalname,
          type: req.file.mimetype,
          size: req.file.size,
        });
        fs.unlinkSync(`./public/uploads/${req.file.filename}`);
      }
    }
  });
});

const port = 3000 || process.env.PORT;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
