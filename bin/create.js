#! /usr/bin/env node
const fs = require('fs');
// import { execSync } from 'child_process';
const path = require('path');
const { execSync } = require('child_process');

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Please enter the name of your new project');
    process.exit(1); //an error occurred
  }

  const appPath = args[0];
  const root = path.resolve(appPath);
  console.log(root);

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    );
    console.error('It is likely you do not have write permissions for the current folder.');
    process.exit(1);
  }

  // Git clone might be safer than downloading a zip file which would require checking
  // for the presence of 'zip', 'curl' or 'wget'
  execSync(`git clone git@github.com:claudioc/fastify-htmx-ts-starter-kit.git ${appPath}`, {
    stdio: 'ignore',
  });

  console.log('created');
};

async function isWriteable(directory) {
  try {
    await fs.promises.access(directory, (fs.constants || fs).W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

main().then(process.exit);
