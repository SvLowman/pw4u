const { readCommandLineArguments } = require("./lib/commandLine");
const { connect, close } = require("./lib/database");
const {
  //readPasswordSafe,
  getPassword,
  setPassword,
} = require("./lib/passwords");
const { askForMasterPassword } = require("./lib/questions");
const { isMasterPasswordCorrect } = require("./lib/validation");

async function run() {
  console.log("Connecting to database...");
  await connect(
    "mongodb+srv://Sven:3zsJD1PTCYfpbPf1@cluster0.55ncs.mongodb.net/swordfish-manager?retryWrites=true&w=majority",
    "swordfish-manager"
  );
  console.log("Connected to database 🎉");
  const [passwordName, newPasswordValue] = readCommandLineArguments();

  console.log(await getPassword(passwordName));

  const masterPassword = await askForMasterPassword();

  if (!(await isMasterPasswordCorrect(masterPassword))) {
    console.error("You are not welcome here! 👿 Try again!");
    return run();
  }

  if (!passwordName) {
    console.error("Missing password name!");
    return process.exit(9);
  }

  if (newPasswordValue) {
    await setPassword(passwordName, newPasswordValue);
    console.log(`Password ${passwordName} set 🎉`);
  } else {
    const passwordValue = await getPassword(passwordName);
    console.log(`Your password is ${passwordValue} 🎉`);
  }
  await close();
}

run();
