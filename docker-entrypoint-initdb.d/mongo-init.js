print('Start #################################################################');

db = db.getSiblingDB('speedtest');
db.createUser(
  {
    user: 'speedtest',
    pwd: 'speedtest',
    roles: [{
      role: 'readWrite',
      db: 'speedtest',
    }],
  },
);
db.createCollection('speedtest');

print('END #################################################################');
