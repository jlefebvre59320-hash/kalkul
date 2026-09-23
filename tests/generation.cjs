const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('index.html','utf8');
const slice=(text,a,b)=>text.slice(text.indexOf(a),text.indexOf(b,text.indexOf(a)));
const base=`const store={get:()=>[],set:()=>{}};const OPS=[{k:'+'},{k:'-'},{k:'*'},{k:'/'}];const SERIES_LEN=10;const dayIndex=d=>Math.floor((Date.parse(d)-Date.parse('2026-09-14'))/86400000);const isBoss=l=>l%5===0;`;
const context=vm.createContext({console,Math,Date});
vm.runInContext(fs.readFileSync('word-seeds.js','utf8')+fs.readFileSync('variety.js','utf8')+base+slice(src,'function hash(','// Son'),context);
vm.runInContext(`
 const signatures=new Set();
 for(let i=0;i<Variety.space;i++){const nums=Variety.numbers(i);if(nums.length!==6||new Set(nums).size!==6)throw Error('invalid numbers');signatures.add(nums.join(','));}
 if(signatures.size!==Variety.space)throw Error('number cycle repeats');
 console.log('Number space:',signatures.size,'unique combinations');
`,context);
for(const L of ['fr','en']){
 const words=fs.readFileSync(L==='fr'?'mots-fr.txt':'words-en.txt','utf8').trim().split(/\r?\n/);context.words=words;context.L=L;
 vm.runInContext(`{
 const set=new Set(words),index=Variety.wordIndex(words),history=[],rnd=mulberry32(935);
 for(const pool of Object.values(WORD_SEEDS[L]))for(const word of pool)if(!set.has(word))throw Error('unknown seed');
 for(let i=0;i<500;i++){
 const letters=Variety.letters(rnd,L,history),key=Variety.signature(letters);
 if(history.includes(key))throw Error('duplicate letters');
 history.push(key);const solutions=Variety.solutions(letters,index);
 if(!solutions.length||solutions[0].length<6)throw Error('no guaranteed word');
 if(i<20){const counts={};letters.forEach(c=>counts[c]=(counts[c]||0)+1);const brute=words.filter(w=>{if(w.length<3||w.length>9)return false;const c={...counts};return [...w].every(l=>c[l]-->0);}).sort((a,b)=>b.length-a.length||(a<b?-1:a>b?1:0));if(JSON.stringify(brute)!==JSON.stringify(solutions))throw Error('inexact solver');}
 }
 console.log(L,': 500 draws with a 6+ letter word, no repeated anagram; exact solutions match dictionary scan');
}`,context);
}
vm.runInContext(`for(const day of ['2026-09-23','2026-09-24','2026-10-15']){const a=seriesForDay(day);for(const p of a)if(!solve(p.nums,p.target))throw Error('unreachable');const saved=JSON.stringify(a);delete seriesCache[day];if(saved!==JSON.stringify(seriesForDay(day)))throw Error('not deterministic');}console.log('Daily targets solvable and deterministic');`,context);
const old=require('node:child_process').execFileSync('git',['show','fa4f841:index.html'],{encoding:'utf8'});
const legacy=vm.createContext({Math,Date});vm.runInContext(base+slice(old,'function hash(','// Son'),legacy);
assert.equal(vm.runInContext(`JSON.stringify(seriesForDay('2026-09-22'))`,context),vm.runInContext(`JSON.stringify(seriesForDay('2026-09-22'))`,legacy));
console.log('Existing daily preserved');
vm.runInContext(slice(src,'const LET_ROUNDS','const Dict ='),context);
vm.runInContext(slice(old,'const LET_ROUNDS','const Dict ='),legacy);
assert.equal(vm.runInContext(`JSON.stringify(lseriesFor('2026-09-22','fr'))`,context),vm.runInContext(`JSON.stringify(lseriesFor('2026-09-22','fr'))`,legacy));
vm.runInContext(`for(const L of ['fr','en']){const a=lseriesFor('2026-09-23',L),key='2026-09-23|'+L;if(new Set(a.map(Variety.signature)).size!==10)throw Error('daily repeated');const saved=JSON.stringify(a);delete lseriesCache[key];if(saved!==JSON.stringify(lseriesFor('2026-09-23',L)))throw Error('letter nondeterminism');}console.log('Letter daily preserved; next daily distinct and deterministic');`,context);
