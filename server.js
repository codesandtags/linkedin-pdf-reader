const express = require("express");
const multer = require("multer");

const pdfjsLib = require("pdfjs-dist/build/pdf");
const { parsePdfContent } = require("./src/parser-linkedin-profile.js");
const { exportResume } = require("./src/resume.js");

const app = express();

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define a route for uploading files
app.post("/upload", upload.single("pdf"), (req, res) => {
  console.log({
    file: req.file,
  });
  const pdfPath = req.file.path;

  const loadingTask = pdfjsLib.getDocument(pdfPath);
  loadingTask.promise.then(async function (pdf) {
    // console.log('PDF Loaded');

    const numPages = pdf.numPages;
    console.log("# Document:", numPages, "page(s).");

    let content = "";
    let promises = [];

    // Reading the first page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      textContent.items.forEach(function (textItem) {
        // Skip the line if it is empty
        if (textItem.str.trim() === "") return;

        content += textItem.str + "\n";
      });
    }

    console.log(content);
    const profileContent = parsePdfContent(content);
    exportResume(profileContent);
    console.log(profileContent);
  });

  res.send("PDF uploaded and content read!");
});

// Start the server
app.listen(3000, () => console.log("Server started on port 3000"));
