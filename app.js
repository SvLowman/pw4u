const { readCommandLineArguments } = require("./lib/commandLine");
const { connect, close } = require("./lib/database");
const { getPassword, setPassword } = require("./lib/passwords");
const { askForMasterPassword } = require("./lib/questions");
const { isMasterPasswordCorrect } = require("./lib/validation");

async function run() {
  console.log("Connecting to database...");
  await connect(
    "mongodb+srv://leon:9MkwXXRt3qB3vCxN@cluster0.912k3.mongodb.net/pw4u?retryWrites=true&w=majority",
    "pw4u"
  );
  console.log("Connected to database 🎉");

  const masterPassword = await askForMasterPassword();

  if (!(await isMasterPasswordCorrect(masterPassword))) {
    console.error("You are not welcome here! 👿 Try again!");
    return run();
  }

  const [passwordName, newPasswordValue] = readCommandLineArguments();
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
