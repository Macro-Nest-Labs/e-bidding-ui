import isEmpty from 'lodash/isEmpty';
import logger from '@/utils/logger';

/**
 * @class DriveCache
 * @info utility class to store persistent or non persistent data
 * @requirements Window global browser must be available for persistent data
 * @uses LocalStorage
 * @reason needed to build drive cache system that could be in memory or local storage persistent data cache
 * @param {Record<string, any>} cache  @optional initial cache
 * @param {TDriveCacheOptions} options    @optional
 * @param {TDriveCacheOptions['cacheKey']} option.cacheKey   @required cache key
 */
export class DriveCache implements IDriveCache {
  /**
   * @constructor
   */
  constructor(
    private cache: Record<string, any> = {},
    private options?: TDriveCacheOptions,
  ) {
    if (
      typeof window !== 'undefined' &&
      this.options?.persist &&
      this.options?.cacheKey
    ) {
      try {
        /* on load - retrieve stored cache from local storage if any
         * fall back to params initial cache
         */
        this.cache = JSON.parse(
          window.localStorage.getItem(this.options.cacheKey) ||
            `${JSON.stringify(cache)}`,
        );
      } catch (error) {
        logger.error(
          `Error - setting localstorage of ${this.options.cacheKey}`,
          JSON.stringify({ error }),
        );
        this.cache = cache;
      }
      this.initialiseCache();
    }
  }

  /**
   * @info    checks if cache is expired
   * @method  Private
   * @returns void
   */
  private isCacheExpired = (): boolean => {
    let hasExpired = false;
    const storedTimeStamp = this.cache?.timeStamp ?? 0;
    const persistTimeInSec = this.options?.persistTimeInSec
      ? this.options.persistTimeInSec * 1000
      : 0;
    if (storedTimeStamp > 0 && persistTimeInSec > 0) {
      hasExpired = persistTimeInSec < new Date().getTime() - storedTimeStamp;
    }
    return hasExpired;
  };

  /**
   * @info    initialises cache
   *          used when the cache needs to be persistent
   * @method  Private
   * @returns void
   */
  private initialiseCache = (): void => {
    if (!isEmpty(this.cache)) {
      /* check if persist for certain time */
      if (this.isCacheExpired()) {
        this.cache = {};
        this.options?.cacheKey &&
          window.localStorage.removeItem(this.options.cacheKey);
      } else {
        this.updateLocalStorage();
      }
    } else {
      this.updateLocalStorage();
    }
  };

  /**
   * @info    updates or sets new cache to localStorage
   * @method  Private
   * @returns void
   */
  private updateLocalStorage = (resetTimeStamp = false): void => {
    if (
      this.options?.persist &&
      typeof window !== 'undefined' &&
      this.options?.cacheKey
    ) {
      this.cache.timeStamp = resetTimeStamp
        ? new Date().getTime()
        : this.cache?.timeStamp ?? new Date().getTime();
      window.localStorage.setItem(
        this.options.cacheKey,
        JSON.stringify(this.get()),
      );
    }
  };

  /**
   * @info    gets current cache by key
   * @method  Public
   * @returns value by requested key. If key is not provided, it will give all the value by the cacheKey
   */
  public get = (key?: string | undefined) => {
    if (!isEmpty(key) && typeof key !== 'undefined') {
      return this.cache?.[key] ?? null;
    }
    return this.cache;
  };

  /**
   * @info    sets the current cache by key
   * @method  Public
   * @returns value of the key that has be just set
   */
  public set = (key: string, value: any, resetTimeStamp: boolean = false) => {
    this.cache[key] = value;
    this.updateLocalStorage(resetTimeStamp);
    return this.cache[key];
  };

  /**
   * @info    resets the cache with or without given data
   * @param { Record<string, any>} data @optional
   * @method  Private
   * @returns void
   */
  public reset = (data: Record<string, any> = {}) => {
    this.cache = data;
    this.updateLocalStorage(true);
    return this.cache;
  };

  /**
   * @info    remove the cache by key name if key exists
   * @reserved timeStamp is a reserved word and cannot be removed. If reseting please use reset or use set with reset flag
   * @param { string } key @required
   * @method  Public
   * @returns void
   */
  public remove = (key: string): boolean => {
    if (key === 'timeStamp') return false;
    delete this.cache?.[key];
    this.updateLocalStorage();
    return true;
  };
}

/**
 * @info    creates an instance of the DriveCache
 * @param { Record<string, any>} cache @optional
 * @param { TDriveCacheOptions} options @optional
 * @returns {IDriveCache}
 */
export const createDriveCache = (
  cache: Record<string, any>,
  options?: TDriveCacheOptions,
): IDriveCache => new DriveCache(cache, options);

/**
 * @info    retrives the instance of the DriveCache
 * @param { string } cacheKey @required
 * @returns {IDriveCache}
 */
export const getDriveCache = (cacheKey: string) =>
  createDriveCache({}, { persist: true, cacheKey: cacheKey });

export type TDriveCacheOptions = {
  persist: boolean;
  cacheKey: string;
  persistTimeInSec?: number;
};
export interface IDriveCache {
  get: (key?: string) => any;
  set: (key: string, value: any, resetTimeStamp?: boolean) => any | void;
  reset?: (data?: Record<string, any>) => Record<string, any>;
  remove?: (key: string) => boolean;
}
