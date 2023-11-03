import express from "express";
import fs from "fs";

const app = express();
const ROOT_FOLDER = "./approutes/";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function handleRegularRoutes(fileUrl, req, res) {
  try {
    const module = await import(fileUrl);
    let data = null;
    data = module.handler(req, res);
    return data;
  } catch (error) {
    console.log(error);
    res.statusCode = 404;
    return false;
  }
}

app.all("/*", async (req, res) => {
  let fileUrl = (ROOT_FOLDER + req.url).replace("//", "/");
  let isFileExist = fs.existsSync(fileUrl + ".js");
  if (!isFileExist) {
    fileUrl += "/index.js";
  } else {
    fileUrl += ".js";
  }
  console.log(fileUrl);
  let result = await handleRegularRoutes(fileUrl, req, res);

  if (result === false) {
    return res.send("Not Found");
  } else {
    return res.send(result);
  }
});

app.listen(3000, () => {
  console.log("Server is On 3000");
});
