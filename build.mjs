import { exec } from 'child_process';
const colours = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  
  fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      gray: "\x1b[90m",
      crimson: "\x1b[38m" // Scarlet
  },
  bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
      gray: "\x1b[100m",
      crimson: "\x1b[48m"
  }
};

function runCommand(command, successMsg) {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        if (stderr) {
          console.error(colours.bg.yellow, colours.fg.black, `stderr: ${stderr}`, colours.reset);
        }
        if (stdout) {
          console.log(colours.bg.cyan, colours.fg.black, stdout, colours.reset);
        }
        console.error(colours.bg.red, colours.fg.white, `Error: ${error.message}`, colours.reset);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(colours.bg.yellow, colours.fg.black, `stderr: ${stderr}`, colours.reset);
      }
      if (stdout) {
        console.log(colours.bg.cyan, colours.fg.black, stdout, colours.reset);
      }
      if (successMsg) {
        console.log(colours.bg.green, colours.fg.white, successMsg, colours.reset);
      }
      resolve();
    });
  });
}

await runCommand('tsc --project tsconfig.json', 'Success: Build Created Successfully');