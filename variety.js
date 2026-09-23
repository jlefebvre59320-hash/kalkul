// Pure, deterministic generators. Daily draws never consult a player's history.
const Variety=(()=>{
 const choose=(n,k)=>{let v=1;for(let i=1;i<=k;i++)v=v*(n-i+1)/i;return Math.round(v);};
 const sizes=[0,1,2,3].map(k=>choose(4,k)*choose(20,6-k));
 const space=sizes.reduce((a,b)=>a+b,0);
 function combination(pool,k,rank){const out=[];for(let i=0;k&&i<pool.length;i++){const count=choose(pool.length-i-1,k-1);if(rank<count){out.push(pool[i]);k--;}else rank-=count;}return out;}
 function numbers(index){
  // A coprime multiplier permutes all 134406 combinations before cycling.
  let rank=((index%space+space)%space*104729+1729)%space,k=0;
  while(rank>=sizes[k])rank-=sizes[k++];
  const smallCount=choose(20,6-k);
  return [...combination(Array.from({length:20},(_,i)=>i+1),6-k,rank%smallCount),...combination([25,50,75,100],k,Math.floor(rank/smallCount))];
 }
 const recentNumbers=[];
 function randomNumbers(rnd){let n;for(let i=0;i<40;i++){n=numbers(Math.floor(rnd()*space));if(!recentNumbers.includes(n.join(',')))break;}recentNumbers.push(n.join(','));if(recentNumbers.length>200)recentNumbers.shift();return n;}
 const signature=a=>Array.from(a).sort().join('');
 function overlap(a,b){let i=0,j=0,n=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){n++;i++;j++;}else if(a[i]<b[j])i++;else j++;}return n;}
 function letters(rnd,lang,history=[]){
  const bank=WORD_SEEDS[lang]||WORD_SEEDS.fr,seen=new Set(history),near=history.slice(-12);let best=null,bestScore=Infinity;
  const vowels='AAAAEEEEEEIIIOOOUUY',consonants=lang==='en'?'BCDDFFGHHLLMMNNNRRRSSSTTTTVW':'BCCDDFFGLLLMMNNNNPRRRRSSSSTTTTV';
  for(let attempt=0;attempt<80;attempt++){
   const length=6+Math.floor(rnd()*4),pool=bank[length],word=pool[Math.floor(rnd()*pool.length)],a=Array.from(word);
   while(a.length<9){const nv=a.filter(c=>'AEIOUY'.includes(c)).length;const bag=nv<3?vowels:nv>=5?consonants:rnd()<.42?vowels:consonants;let c=bag[Math.floor(rnd()*bag.length)];if(a.filter(x=>x===c).length>=3)c=consonants[Math.floor(rnd()*consonants.length)];a.push(c);}
   const key=signature(a),score=(seen.has(key)?100:0)+near.reduce((sum,s)=>sum+Math.max(0,overlap(key,s)-7),0);
   if(score<bestScore){best=a;bestScore=score;}if(score===0)break;
  }
  for(let i=best.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[best[i],best[j]]=[best[j],best[i]];}
  return best;
 }
 function wordIndex(words){const map=new Map();for(const w of words){if(w.length<3||w.length>9)continue;const key=signature(w);if(!map.has(key))map.set(key,[]);map.get(key).push(w);}return map;}
 function solutions(letters,index){
  // At most 512 subsets, instead of scanning the complete dictionary per hint.
  const a=Array.from(letters).sort(),keys=new Set(),found=new Set();
  for(let mask=1;mask<(1<<a.length);mask++){let key='';for(let i=0;i<a.length;i++)if(mask&(1<<i))key+=a[i];if(key.length<3||keys.has(key))continue;keys.add(key);for(const w of index.get(key)||[])found.add(w);}
  return [...found].sort((a,b)=>b.length-a.length||(a<b?-1:a>b?1:0));
 }
 return {space,numbers,randomNumbers,signature,letters,wordIndex,solutions};
})();
