/* eslint-disable no-restricted-globals */
/* global print, db */
print('Start #################################################################');

const speedtestDb = db.getSiblingDB('speedtest');
speedtestDb.createUser(
  {
    user: 'speedtest',
    pwd: 'speedtest',
    roles: [{
      role: 'readWrite',
      db: 'speedtest',
    }],
  },
);
speedtestDb.createCollection('speedtest');

print('END #################################################################');
