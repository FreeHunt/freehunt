import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  private cache: Record<string, string> = {};

  constructor() {
    // Preload secrets directory if exists
    const secretsDir = '/run/secrets';
    if (fs.existsSync(secretsDir)) {
      const secretFiles = fs.readdirSync(secretsDir);
      for (const file of secretFiles) {
        const path = `${secretsDir}/${file}`;
        this.cache[file] = fs.readFileSync(path, 'utf8').trim();
      }
    }
  }

  get(key: string, fallback?: string): string {
    // Check for env key in upper case and secret in lower case
    const envKey = key.toUpperCase();
    const secretKey = key.toLowerCase();

    // 1. Check env
    if (process.env[envKey]) {
      return process.env[envKey] as string;
    }

    // 2. Check Swarm secret cache
    if (this.cache[secretKey]) {
      return this.cache[secretKey];
    }

    // 3. Fallback or throw
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(`Missing environment variable or secret for key: ${key}`);
  }
}
