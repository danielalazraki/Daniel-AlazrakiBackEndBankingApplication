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
  private_key_id: "001511bc6e254a365b3dd473c629e44f24ab6e74",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/BXXQri03R6Lu\nofWgS3DwQsG3OHLqP8qB6m7cOGzUOZ5I9TzIwdK4rTKNWREkO53sIPIvvpxImH30\nruo8TcTfwpITc8sSu7CWEqKWykHuqzqOmVsIcpXvXZ/R1YCN1FOFzcTpWkeKRXZx\nqHN3nVt98m183w2OG9LNbiVTot2jKyNI2Vmvp3Jo+OMnBXHWR63YOetIFhM5LVBe\nDPDgVttg2nycnJXPAfUT9o1NiOMtQvuz76ZPUjfxx8ENmrcKHUqs8jE/kUU3OHoD\nV9auliMI+kSmCxUpHnPdM8qVrUX+Bqk52An9Bs3zOZbwFUW7H81L+T2mxhvmq3SO\nwk3ZToSFAgMBAAECggEADdOfmkYNRE/VYZgMDzj+uQlf+7rkiIOrDRnSwfJ8oCT2\nidnkdzSeY9s3ikcs6DY/gVjGJwIRTmjpTxV9I3XOnxK2n51VUOsQhmBdb/Q+bv/q\naml7zyH6K9wXRilB16JLlGcXTnvIK2BJSUNT7k/P0E9EsRH1KXjmmpOTNJlYmSeV\nYPmBH8QTKqo3jkhyBhVD1L9lIY8MIMe+tirITZ46Sk6PWGVsNWUfr/pa8VqOnbqN\njuYBwWNfWRw+zL1nqvLAd+/6WfvyiNSM4aAKPrxIdauLHr/jGocZkJ7igVbriWiu\n9mnsi4N2iygy3V68ap2N89DAY+ZqMZ+TObY1O0TZgQKBgQDq9ntsTc4jSWE403yn\n28TZ7f6uvqxaYX7HTc2NEmKMYqt9xzJ8xyIo6pyUBqj84Y1z0KQkSCwaqWxwvFyf\nqVYlLpZBOMqq8tv0uhT+oZmE4jRAZqXqnYtAoFIl+MUaWdAXxffGNsZj+uGarZL4\nRBIBuaKt78hctVYZMD3a/VE0BQKBgQDQH86rfSv5iMcoIkpf4V/ZYNlxj4PU1UKa\ntwrlcvdnLmIQ2NqR+lMJcpgbJ/PGK7LDWOVzTQqGb5I+AqFhOX7E9zRuvXXvsX0y\n8D+1G0XP0OMI1RiECdt7dYVsGULykYQAoVyeFucqPlnmZmQKEeIXwFU6ZnipiXHp\ntyH6TRV2gQKBgCnh2cpKbC46DEx21keNkx9NnxJDBrHtow2fvr4gwtRHWk5HTaaU\nUHB+sX5pWYIKKo60aC3Xd5UhEiVeThxfsO1byojBuM6UD8Ulzkw9PgJD2BCKu5SA\nlKvmZ/5Aw9GYpNE4Bpyccuyrcb+CpSn/6D3Ke0cJ8Osln71Jrhz0/p6JAoGBALh1\niHG7dg8q6ACtK6gBEzeRvAcHQLuQ7AA9/R1RoO7FUEtIN6gr6g60jxV6eneIYV77\n2hkwDgUKu93T7P5DvBSMWN9Rckan06QjBQPaESzYIXDBlYHpTqsEhOVDGm/tAsag\nPXssJ2PscTdgRogaQ33zjFY/XfA9DkYrdqTmTwCBAoGAWUqLAGD0HYd2nUH7VTYz\nhTCdUIywtYjZxf9fcLlXaF05jtcFyEZ3JItxl72fP9Oh/lelmGe/CLMio17hi3uk\nfP1tOrlPYjBvNgLiMrnKudWLCZu3CSCmI336k/XPHvoBIk2HKeZyTknD2DktC4bf\nhE1xrZ0LtyWjYPSPZ98KcR8=\n-----END PRIVATE KEY-----\n",
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
