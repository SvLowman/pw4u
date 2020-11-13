const fs = require("fs").promises;
const CryptoJS = require("crypto-js");
const { collection } = require("./database");
const { readMasterPassword } = require("./masterPassword");

async function readDocumentByName(passwordName) {
  const cursor = await collection("passwords").find({ name: passwordName });
  function iterateFunc(doc) {
    console.log(JSON.stringify(doc, null, 4));
  }
  function errorFunc(error) {
    console.log(error);
  }
  cursor.forEach(iterateFunc, errorFunc);
}

async function writePasswordSafe(passwordSafe) {
  await fs.writeFile("./db.json", JSON.stringify(passwordSafe, null, 2));
}

async function getPassword(passwordName) {
  const passwordSafe = await readDocumentByName(passwordName);
  const passwordValue = passwordSafe[value];
  return passwordValue;
}

// async function getPassword(passwordName) {
//   const passwordSafe = await readDocumentByName();

//   const passwordBytes = CryptoJS.AES.decrypt(
//     passwordSafe[passwordName],
//     await readMasterPassword()
//   );

//   return passwordBytes.toString(CryptoJS.enc.Utf8);
// }

async function setPassword(passwordName, newPasswordValue) {
  const encryptedValue = CryptoJS.AES.encrypt(
    newPasswordValue,
    await readMasterPassword()
  ).toString();

  await collection("passwords").insertOne({
    name: passwordName,
    value: encryptedValue,
  });
}

exports.readDocumentByName = readDocumentByName;
exports.getPassword = getPassword;
exports.setPassword = setPassword;
