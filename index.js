import express from "express";
var app = express();
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import admin from "firebase-admin";
import { createTransaction, updateBalance } from "./firebase-helper.js";

export const adminKey = {
  type: "service_account",
  project_id: "bank-app-1315f",
  private_key_id: "",
  private_key:
    "-----BEGIN PRIVATE KEY--\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-9wbrc@bank-app-1315f.iam.gserviceaccount.com",
  client_id: "110234234527154825824",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9wbrc%40bank-app-1315f.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(adminKey),
  databaseURL:
    "https://bank-app-1315f-default-rtdb.europe-west1.firebasedatabase.app",
});

const __dirname = path.resolve();
// used to serve static files from public directory
app.use(express.static(path.join(__dirname, "../../build")));
app.use(cors());
app.use(bodyParser.json());

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;
  console.log("idToken:", idToken);

  if (idToken) {
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(function (decodedToken) {
        console.log("DecodedToken:", decodedToken);
        console.log("Decoded token success!");
        return next();
      })
      .catch(function (error) {
        console.log("Decoded token fail!");
        return res.status(401).send("You are not authorized");
      });
  } else {
    console.log("Token not found!");
    return res.status(401).send("You are not authorized");
  }
}
app.use("/auth", verifyToken);

app.get("/auth", (req, res) => res.send("Authentication succes"));

app.get("/", function (req, res) {
  res.send("Hello World");
});

// create user account
app.get("/account/create/", function (req, res) {
  console.log(res.body);
});

app.post("/:type/:uid/:amount", async function (req, res) {
  var amount = Number(req.params.amount);
  var type = req.params.type.toUpperCase();
  var uid = req.params.uid;
  try {
    const trx = await updateBalance(uid, type, amount);
    return res.json({
      status: "success",
      data: { trx },
    });
  } catch (error) {
    console.log("unable to update db: ", error);
    return res.json({
      status: "fail",
      data: {
        error,
        message: "unable to update db",
      },
    });
  }
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Running on port: " + port);
