const fs = require("fs").promises;
const CryptoJS = require("crypto-js");
const { collection } = require("./database");
const { readMasterPassword } = require("./masterPassword");

async function findPasswordByName(passwordName) {
  const passwordObject = await collection("passwords").findOne({
    name: passwordName,
  });
  return passwordObject;
}

async function writePasswordSafe(passwordSafe) {
  await fs.writeFile("./db.json", JSON.stringify(passwordSafe, null, 2));
}

async function getPassword(passwordName) {
  const passwordObject = await findPasswordByName(passwordName);
  const passwordValue = passwordObject.value;
  const passwordBytes = CryptoJS.AES.decrypt(
    passwordValue,
    await readMasterPassword()
  );
  return passwordBytes.toString(CryptoJS.enc.Utf8);
}

// async function getPassword(passwordName) {
//   const passwordSafe = await findPasswordByName();

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

exports.findPasswordByName = findPasswordByName;
exports.getPassword = getPassword;
exports.setPassword = setPassword;
