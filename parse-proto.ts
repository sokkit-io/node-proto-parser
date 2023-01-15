const cliProgress = require('cli-progress');
const fs = require('fs');
const rimraf = require('rimraf');
const glob = require("glob");
const pbjs = require("protobufjs-cli/pbjs");
const pbts = require("protobufjs-cli/pbts");
const dotenv = require("dotenv");
const dotenvExpand = require('dotenv-expand');

const ENV_FILE = '.env.example';

dotenvExpand.expand(dotenv.config({ cwd: __dirname, path: ENV_FILE }));
const APP_NAME              = process.env.APP_NAME;
const APP_VERSION           = process.env.APP_VERSION;
const PROTO_IN_DIR          = process.env.PROTO_IN_DIR;
const PROTO_OUT_DIR         = process.env.PROTO_OUT_DIR;
const PROTO_JS_BUNDLE       = process.env.PROTO_JS_BUNDLE;
const PROTO_TS_DEFINITIONS  = process.env.PROTO_TS_DEFINITIONS;

async function main() {
  const progress = new cliProgress.Bar({
    barCompleteChar: '#',
    barIncompleteChar: '_',
    format: '\u{20DF} Current Progress: {percentage}%' + ' - ' + '[{bar}]',
    fps: 5,
    stream: process.stdout,
    barsize: 30,
    forceRedraw: true,
  });
  progress.start(100, 0);

  function prepareProtoOutDir(): void {
    if (!fs.existsSync(PROTO_OUT_DIR)) {
      fs.mkdirSync(PROTO_OUT_DIR, { recursive: true });
    } else {
      rimraf.sync(PROTO_OUT_DIR);
      fs.mkdirSync(PROTO_OUT_DIR, { recursive: true });
    }
  }

  async function getProtoGlob(): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      await glob(`${PROTO_IN_DIR}/**/*.proto`, async (err: Error | null, files: string[]) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(files);
      });
    });
  }

  async function generateJsBundle(protoGlob: string[]): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      await pbjs.main([
        "-t", "static-module",
        "-w", "commonjs",
        "-o", PROTO_JS_BUNDLE,
        ...protoGlob,
      ], async (err: Error | null, output: string) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(output);
      });
    });
  }

  async function generateTsDefinitions(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      await pbts.main(["-o", PROTO_TS_DEFINITIONS, PROTO_JS_BUNDLE], async (err: Error | null, output: string) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(output);
      });
    });
  }

  prepareProtoOutDir();
  progress.update(25);

  let files = await getProtoGlob();
  progress.update(50);


  await generateJsBundle(files);
  progress.update(75);


  await generateTsDefinitions();
  progress.update(100);
  progress.stop();
}

main();
