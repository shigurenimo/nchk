// Cache utility for storing check results

import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import type { CheckResult } from "@/types/check-result.js"

const CACHE_DIR = path.join(os.homedir(), ".config", "nchk")
const CACHE_FILE = path.join(CACHE_DIR, "cache.json")
const LOCK_FILE = path.join(CACHE_DIR, "cache.lock")
const CACHE_TTL = 8 * 60 * 60 * 1000 // 8 hours
const CLEANUP_TTL = 2 * 24 * 60 * 60 * 1000 // 2 days

type CacheEntry = {
  result: CheckResult
  timestamp: number
}

type CacheData = Record<string, CacheEntry>

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

// In-memory copy: getCached runs per item per render, so hitting the
// filesystem every call is too slow
let memo: CacheData | null = null

function loadCache(): CacheData {
  if (memo) return memo
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8")
      memo = JSON.parse(data)
      return memo ?? {}
    }
  } catch {
    // Ignore errors, return empty cache
  }
  memo = {}
  return memo
}

function saveCache(data: CacheData): void {
  memo = data
  ensureCacheDir()
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2))
}

function getCacheKey(platform: string, name: string): string {
  return `${platform}:${name}`
}

export type CachedResult = {
  result: CheckResult
  timestamp: number
}

export function getCached(platform: string, name: string): CachedResult | null {
  const cache = loadCache()
  const key = getCacheKey(platform, name)
  const entry = cache[key]

  if (!entry) return null

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL
  if (isExpired) return null

  return entry
}

export function setCache(result: CheckResult): void {
  const cache = loadCache()
  const key = getCacheKey(result.platform, result.name)

  cache[key] = {
    result,
    timestamp: Date.now(),
  }

  saveCache(cache)
}

export function clearCache(): void {
  memo = null
  if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE)
  }
}

// Lock mechanism using exclusive file creation
function acquireLock(): boolean {
  ensureCacheDir()
  try {
    fs.writeFileSync(LOCK_FILE, String(process.pid), { flag: "wx" })
    return true
  } catch {
    // Lock file exists, check if stale (older than 1 minute)
    try {
      const stat = fs.statSync(LOCK_FILE)
      const age = Date.now() - stat.mtimeMs
      if (age > 60 * 1000) {
        // Stale lock, remove and retry
        fs.unlinkSync(LOCK_FILE)
        fs.writeFileSync(LOCK_FILE, String(process.pid), { flag: "wx" })
        return true
      }
    } catch {
      // Ignore errors
    }
    return false
  }
}

function releaseLock(): void {
  try {
    fs.unlinkSync(LOCK_FILE)
  } catch {
    // Ignore errors
  }
}

export function cleanupOldEntriesAsync(): void {
  // Run cleanup in background without blocking
  setImmediate(() => {
    if (!acquireLock()) {
      return // Another process is doing cleanup
    }

    try {
      const cache = loadCache()
      const now = Date.now()
      let changed = false

      for (const key of Object.keys(cache)) {
        const entry = cache[key]
        if (entry && now - entry.timestamp > CLEANUP_TTL) {
          delete cache[key]
          changed = true
        }
      }

      if (changed) {
        saveCache(cache)
      }
    } finally {
      releaseLock()
    }
  })
}
