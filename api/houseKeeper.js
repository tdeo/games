'use strict;'

import fs from 'fs';
import { promisify } from 'util';

import redis from 'redis';

let redisClient = {
  hkeys: () => null,
  hget: () => null,
  hset: () => null,
};

if (process.env.REDIS_URL) {
  redisClient = redis.createClient(process.env.REDIS_URL);
}

const hkeys = promisify(redisClient.hkeys).bind(redisClient);
const hget = promisify(redisClient.hget).bind(redisClient);
const hset = promisify(redisClient.hset).bind(redisClient);

class RedisHouseKeeper {
  constructor(namespace, klass) {
    this.namespace = namespace;
    this.klass = klass;
  }

  async loadGames() {
    let games = [];
    const keys = await hkeys(this.namespace);
    for (let key of keys) {
      let json = await hget(this.namespace, key);
      let game = new this.klass();
      game.deserialize(json);
      games.push(game);
    }
    return games;
  }

  async saveGame(game) {
    await hset(this.namespace, game.uuid, game.serialize());
  }
}

class FileHouseKeeper {
  constructor(namespace, klass) {
    this.namespace = namespace;
    this.klass = klass;
    this.dir = `${__dirname}/../tmp/${namespace}`;
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
  }

  async loadGames() {
    let games = [];
    let keys = fs.readdirSync(this.dir);
    for (let key of keys) {
      let json = fs.readFileSync(`${this.dir}/${key}`);
      let game = new this.klass();
      game.deserialize(json);
      games.push(game)
    }
    return games;
  }

  async saveGame(game) {
    fs.writeFileSync(`${this.dir}/${game.uuid}.json`, game.serialize());
  }
}

export default process.env.REDIS_URL ? RedisHouseKeeper : FileHouseKeeper;
