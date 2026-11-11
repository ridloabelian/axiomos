import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(rootDir, 'dist');

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

cpSync(resolve(rootDir, 'index.html'), resolve(distDir, 'index.html'));
cpSync(resolve(rootDir, 'src'), resolve(distDir, 'src'), { recursive: true });

// Cloudflare Pages security & caching headers
const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`;
writeFileSync(resolve(distDir, '_headers'), headersContent, 'utf8');

console.log('Build selesai: seluruh aset statis AxiomOS telah disiapkan di ./dist');
