import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist');const html=await readFile(resolve(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate ids');
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=m[1];
 if(url.startsWith('#')&&url.length>1&&!ids.includes(url.slice(1)))throw Error('Missing anchor '+url);
 if(url.startsWith('/')&&!url.startsWith('//'))await access(resolve(root,'.'+url.split('?')[0]));
 if(url.startsWith('http'))new URL(url);
}
if(!html.includes('noindex,nofollow')||!html.includes('Демонстрационный концепт'))throw Error('Demo labels missing');

for(const m of html.matchAll(/href="tel:([^"]+)"/g))if(m[1]!=='+79955992363')throw Error('Unverified phone');
console.log('Production static validation passed: local files, anchors, URLs, phone, demo labels. No dependencies required.');
