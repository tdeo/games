'use strict;';

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

const expired = (game) => {
  if (game.resuts) {
    return game.lastAction < Date.now() - 3 * 60 * 1000;
  } else if (game.lastAction) {
    return game.lastAction < Date.now() - 10 * 60 * 1000;
  } else if (game.createdAt) {
    return game.createdAt < Date.now() - 10 * 60 * 1000;
  } else {
    return false;
  }
};

class RedisHouseKeeper {
  constructor(namespace, Klass) {
    this.namespace = namespace;
    this.Klass = Klass;
  }

  async loadGames() {
    const games = [];
    const keys = await hkeys(this.namespace);
    for (const key of keys) {
      const json = await hget(this.namespace, key);
      const game = new this.Klass();
      game.deserialize(json);
      if (!expired(game)) {
        games.push(game);
      }
    }
    return games;
  }

  async saveGame(game) {
    if (expired(game)) {
      return true;
    }
    await hset(this.namespace, game.uuid, game.serialize());
  }
}

class FileHouseKeeper {
  constructor(namespace, Klass) {
    this.namespace = namespace;
    this.Klass = Klass;
    this.dir = `${__dirname}/../tmp/${namespace}`;
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
  }

  async loadGames() {
    const games = [];
    const keys = fs.readdirSync(this.dir);
    for (const key of keys) {
      const json = fs.readFileSync(`${this.dir}/${key}`);
      const game = new this.Klass();
      game.deserialize(json);
      if (!expired(game)) {
        games.push(game);
      }
    }
    return games;
  }

  async saveGame(game) {
    if (expired(game)) {
      return true;
    }
    fs.writeFileSync(`${this.dir}/${game.uuid}.json`, game.serialize());
  }
}

export default process.env.REDIS_URL ? RedisHouseKeeper : FileHouseKeeper;
