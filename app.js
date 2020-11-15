require("dotenv").config();
const chalk = require("chalk");

const { readCommandLineArguments } = require("./lib/commandLine");
const { connect, close } = require("./lib/database");
const {
  //readPasswordSafe,
  getPassword,
  setPassword,
  findPasswordByName,
} = require("./lib/passwords");
const { askForMasterPassword } = require("./lib/questions");
const { isMasterPasswordCorrect } = require("./lib/validation");

async function run() {
  console.log(chalk.yellow("Connecting to database..."));
  await connect(process.env.DB_USER_PASSWORD, "swordfish-manager");
  console.log(chalk.green("Connected to database 🎉"));
  console.log(chalk.inverse("Swordfish-Manager"));
  const [passwordName, newPasswordValue] = readCommandLineArguments();

  const masterPassword = await askForMasterPassword();

  if (!(await isMasterPasswordCorrect(masterPassword))) {
    console.error(chalk.red("Beep, that's wrong! 😱"));
    return run();
  }

  if (!passwordName) {
    console.error(chalk.red("Missing password name! 😬"));
    return process.exit(9);
  }

  if (newPasswordValue) {
    await setPassword(passwordName, newPasswordValue);
    console.log(`Password ${chalk.green(passwordName)} set 🎉`);
  } else {
    const passwordValue = await getPassword(passwordName);
    console.log(`Your password is ${chalk.green(passwordValue)} 🎉`);
  }
  await close();
}

run();
