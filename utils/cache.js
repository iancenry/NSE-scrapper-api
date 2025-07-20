const NodeCache = require('node-cache');
const config = require('../config');
const logger = require('./logger');

class CacheManager {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttlSeconds,
      checkperiod: config.cache.checkPeriodSeconds,
      useClones: false
    });

    this.cache.on('set', (key, _value) => {
      logger.info(`Cache set: ${key}`);
    });

    this.cache.on('del', (key, _value) => {
      logger.info(`Cache deleted: ${key}`);
    });

    this.cache.on('expired', (key, _value) => {
      logger.info(`Cache expired: ${key}`);
    });
  }

  get(key) {
    try {
      const value = this.cache.get(key);
      if (value !== undefined) {
        logger.info(`Cache hit: ${key}`);
        return value;
      }
      logger.info(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  set(key, value, ttl) {
    try {
      const success = this.cache.set(key, value, ttl);
      if (success) {
        logger.info(`Cache set successful: ${key}`);
      } else {
        logger.warn(`Cache set failed: ${key}`);
      }
      return success;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  del(key) {
    try {
      const count = this.cache.del(key);
      logger.info(`Cache deleted ${count} keys: ${key}`);
      return count;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return 0;
    }
  }

  flush() {
    try {
      this.cache.flushAll();
      logger.info('Cache flushed');
    } catch (error) {
      logger.error('Cache flush error:', error);
    }
  }

  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheManager();
