const fs = require("fs").promises;

async function readMasterPassword() {
  return process.env.MASTER_PASSWORD;
}

exports.readMasterPassword = readMasterPassword;
