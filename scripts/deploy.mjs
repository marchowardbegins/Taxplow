import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { config } from 'dotenv';
import { resolve } from 'node:path';

// Load .env.local file
config({ path: resolve('.env.local') });

const mode = process.argv[2]; // 'draft' or 'prod'
const siteId = process.env.NETLIFY_SITE_ID;

if (!siteId || siteId === 'PASTE_YOUR_SITE_ID_HERE') {
  console.error('❌ NETLIFY_SITE_ID not set in .env.local');
  console.error('Please add your Netlify Site ID to .env.local:');
  console.error('NETLIFY_SITE_ID=your-actual-site-id-here');
  process.exit(1);
}

const isDraft = mode === 'draft';
const deployArgs = ['deploy', '--build', '--json', '--site', siteId];

if (!isDraft) {
  deployArgs.push('--prod');
}

console.log(`🚀 Deploying ${isDraft ? 'draft' : 'production'} to site: ${siteId}`);

const netlify = spawn('netlify', deployArgs, {
  stdio: ['inherit', 'pipe', 'inherit']
});

const printUrl = spawn('node', ['scripts/print-netlify-url.mjs'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

try {
  await pipeline(netlify.stdout, printUrl.stdin);
  await new Promise((resolve, reject) => {
    netlify.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Netlify deploy failed with code ${code}`));
      }
    });
  });
} catch (error) {
  console.error('❌ Deploy failed:', error.message);
  process.exit(1);
}
