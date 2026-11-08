import {readFile,writeFile} from 'node:fs/promises';
const envPath=new URL('../../secret/env/android.env',import.meta.url);
let source='';
try{source=await readFile(envPath,'utf8');}catch{}
const value=source.split(/\r?\n/).map(line=>line.trim()).find(line=>line.startsWith('MOBILE_API_URL='))?.split('=').slice(1).join('=').trim().replace(/^['"]|['"]$/g,'');
const url=value||'http://10.0.2.2:5000/api/v1';
await writeFile(new URL('../src/lib/api-config.ts',import.meta.url),`// Generated from secret/env/android.env. Do not edit.\nexport const MOBILE_API_URL = ${JSON.stringify(url)};\n`);
