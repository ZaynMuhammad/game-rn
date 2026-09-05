#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const godotPackagePath = require.resolve('@borndotcom/react-native-godot/package.json');
const godotPackageRoot = path.dirname(godotPackagePath);
const godotPackage = JSON.parse(fs.readFileSync(godotPackagePath, 'utf8'));
const iosPrebuilts = godotPackage.prebuiltFiles.filter(
  ({ destination_base_dir: destination }) => destination.split(/[\\/]/)[0] === 'ios'
);

function isNonEmptyDirectory(directory) {
  try {
    return fs.statSync(directory).isDirectory() && fs.readdirSync(directory).length > 0;
  } catch {
    return false;
  }
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
}

function sha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

async function installPrebuilt(entry, temporaryDirectory) {
  const destinationBase = path.resolve(godotPackageRoot, entry.destination_base_dir);
  const parentDirectory = path.join(destinationBase, entry.name);
  const destination = path.join(parentDirectory, entry.version);

  if (isNonEmptyDirectory(destination) && process.env.REPLACE_EXISTING !== 'true') {
    console.log(`${entry.name} ${entry.version} is already installed for iOS.`);
    return;
  }

  fs.rmSync(parentDirectory, { recursive: true, force: true });

  const archive = path.join(temporaryDirectory, entry.filename);
  const localArchive = entry.env && process.env[entry.env];
  if (localArchive) {
    fs.copyFileSync(localArchive, archive);
  } else {
    const url = `${entry.base_url}${entry.version}/${entry.filename}`;
    console.log(`Downloading ${entry.name} ${entry.version} for iOS...`);
    run('curl', ['--fail', '--location', '--silent', '--show-error', '--output', archive, url]);
  }

  if (process.env.SHASUM_CHECK !== 'false') {
    const actualHash = await sha256(archive);
    if (actualHash !== entry.shasum.toLowerCase()) {
      throw new Error(`Checksum mismatch for ${entry.name}.`);
    }
  }

  fs.mkdirSync(destination, { recursive: true });
  if (entry.no_unpack === 'false') {
    run('unzip', ['-q', '-o', archive, '-d', destination]);
  } else {
    fs.copyFileSync(archive, path.join(destination, entry.filename));
  }
}

async function main() {
  if (iosPrebuilts.length === 0) {
    throw new Error('No iOS Godot prebuilts are defined by the installed package.');
  }

  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'godot-ios-'));
  try {
    for (const entry of iosPrebuilts) {
      await installPrebuilt(entry, temporaryDirectory);
    }
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`Unable to install iOS Godot prebuilts: ${error.message}`);
  process.exitCode = 1;
});
