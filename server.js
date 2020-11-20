require("dotenv").config();

const express = require("express");
const { getPassword, setPassword, deletePassword } = require("./lib/passwords");
const { connect } = require("./lib/database");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3600;

app.get("/api/passwords/:name", async (request, response) => {
  const { name } = request.params;
  try {
    const passwordValue = await getPassword(name);
    if (!passwordValue) {
      response
        .status(404)
        .send("Could not find the password you have specified.");
      return;
    }
    response.send(passwordValue);
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal error occured");
  }
});

app.post("/api/passwords", async (request, response) => {
  const password = request.body;

  try {
    await setPassword(password.name, password.value);
    response.send(`Successfully set ${password.name}`);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send("An unexpected error occured. Please try again later!");
  }
});

app.delete("/api/passwords/:passwordName", async (request, response) => {
  try {
    const { passwordName } = request.params;
    const result = await deletePassword(passwordName);
    if (result.deletedCount === 0) {
      return response.status(404).send("Couldn't find password");
    }
    response.status(200).send("Password deleted");
  } catch (error) {
    console.error(error);
    response.status(500).send("Unexpected error. Please try again later.");
  }
});

async function run() {
  console.log("Connecting to database");
  await connect(process.env.DB_USER_PASSWORD, process.env.DB_NAME);
  console.log("Connected to database");

  app.listen(port, () => {
    console.log(`PW4U API listening at http://localhost:${port}`);
  });
}

run();
