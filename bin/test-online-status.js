const isReachable = require('is-reachable');
const { readFile, writeFile } = require('fs');
const { join, resolve } = require('path');

const config = require(resolve('config.json'));

const LOG_FILE = resolve(join('public', 'log.json'));

async function readLog() {
  const contents = await new Promise((res, rej) => {
    readFile(LOG_FILE, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
  return JSON.parse(contents);
}

async function writeLog(log) {
  const contents = JSON.stringify(log);
  await new Promise((res, rej) => {
    writeFile(LOG_FILE, contents, err => {
      if (err) rej(err);
      else res();
    });
  });
}

async function testStatus() {
  const { servers, timeout } = config;
  let result = false;
  let i = 0;
  while (i < servers.length && !result) {
    result = await isReachable(servers[i], { timeout });
    i++;
  }
  return result ? 1 : 0;
}

async function run() {
  const log = await readLog();
  const latestStatus = log.changes[0] && log.changes[0][0] ? 1 : 0;
  const currentStatus = await testStatus();
  const date = new Date().toISOString();
  log.lastCheck = date;
  if (latestStatus !== currentStatus) {
    log.changes.unshift([currentStatus, date]);
  }
  await writeLog(log);
}

run().catch(console.error);
