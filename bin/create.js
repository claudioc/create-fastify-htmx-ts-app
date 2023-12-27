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

  const appName = args[0];
  const root = path.resolve(appName);
  console.log(root);

  if (fs.existsSync(root)) {
    console.error('The application path already exists.');
    process.exit(1);
  }

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    );
    console.error('It is likely you do not have write permissions for this folder.');
    process.exit(1);
  }

  // Git clone might be safer than downloading a zip file which would require checking
  // for the presence of 'zip', 'curl' or 'wget'
  execSync(`git clone git@github.com:claudioc/fastify-htmx-ts-starter-kit.git ${appName}`, {
    stdio: 'ignore',
  });

  execSync('rm -rf .git', { cwd: appName, stdio: 'ignore' });
  execSync('rm -rf tasks', { cwd: appName, stdio: 'ignore' });

  const packageJsonPath = path.join(root, 'package.json');
  const packageJson = require(packageJsonPath);
  packageJson.name = path.basename(root);
  packageJson.version = '0.1.0';
  packageJson.description = '';
  packageJson.author = '';
  packageJson.license = 'ISC';
  delete packageJson.repository;
  delete packageJson.bugs;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`Success! Created ${appName} at ${appName}`);

  console.log(`
We didn't install any dependencies for you; use your favourite package manager to do so (i.e. "npm install").

Inside that directory, you can run several commands:
    npm run dev
      Starts the development server.

    npm run build
      Builds the app for production.

    npm start
      Runs the built app in production mode.
`);
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
