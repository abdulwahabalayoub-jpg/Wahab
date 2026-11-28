/* =========================================================================
   Social Media Intelligence Dashboard V2 — prototype app (synthetic data)
   Part 1: helpers, charts, grading engine
   ========================================================================= */
const $=id=>document.getElementById(id);
const $g=$;
const fmt=x=>x==null||isNaN(x)?"—":Math.round(x).toLocaleString("en-US");
const usd=x=>"$"+Number(x).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const usd0=x=>"$"+Math.round(x).toLocaleString("en-US");
const pct=(x,d=1)=>x==null||isNaN(x)?"—":x.toFixed(d)+"%";
const compact=x=>x>=1e6?(x/1e6).toFixed(1)+"M":x>=1e4?Math.round(x/1e3)+"k":x>=1e3?(x/1e3).toFixed(1)+"k":fmt(x);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
const sum=a=>a.reduce((s,x)=>s+(x||0),0);
const clone=o=>JSON.parse(JSON.stringify(o));
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};

const BRANDS=Object.keys(ACCOUNTS);
const ALL="All brands";
const STATE={brand:ALL,period:MONTHS.at(-1),page:"overview"};
const pIdx=p=>MONTHS.indexOf(p);
const prevP=p=>MONTHS[pIdx(p)-1]||null;
const short=p=>p?p.slice(0,3):"";
const acct=(b,p)=>ACCOUNTS[b][p];
const POSTS_BY={};DATA.forEach(p=>{(POSTS_BY[p.brand+"|"+p.period]??=[]).push(p)});
const postsOf=(b,p)=>b===ALL?BRANDS.flatMap(x=>POSTS_BY[x+"|"+p]||[]):(POSTS_BY[b+"|"+p]||[]);
const campsOf=(b,p)=>CAMPAIGNS.filter(c=>(b===ALL||c.brand===b)&&(!p||c.period===p));
const postById=id=>DATA.find(p=>p.id===id);
const paidShare=p=>p.organic_reach+p.paid_reach?Math.round(p.paid_reach/(p.organic_reach+p.paid_reach)*100):0;
const organicER=p=>{const o=p.organic;return (o.likes+o.comments+o.saves+o.shares)/p.organic_reach*100};
const acctPaidShare=(b,p)=>{const a=acct(b,p);return a.paid_reach/(a.organic_reach+a.paid_reach)*100};
function orgStats(b,p){const ps=postsOf(b,p),reels=ps.filter(x=>x.avg_watch_sec!=null);return{n:ps.length,avgReach:avg(ps.map(x=>x.organic_reach)),er:avg(ps.map(organicER)),saves:sum(ps.map(x=>x.organic.saves)),shares:sum(ps.map(x=>x.organic.shares)),watch:avg(reels.map(x=>x.avg_watch_sec)),completion:avg(reels.map(x=>x.completion_pct)),reels:reels.length}}
function paidStats(b,p){const cs=campsOf(b,p),sp=sum(cs.map(c=>c.spend_USD)),bu=sum(cs.map(c=>c.budget_USD)),imp=sum(cs.map(c=>c.impressions)),cl=sum(cs.map(c=>c.link_clicks)),tracked=cs.filter(c=>c.purchases!=null);return{n:cs.length,spend:sp,budget:bu,impressions:imp,reach:sum(cs.map(c=>c.reach)),clicks:cl,lpv:sum(cs.map(c=>c.landing_page_views)),cpm:imp?sp/imp*1000:null,ctr:imp?cl/imp*100:null,cpc:cl?sp/cl:null,purchases:tracked.length?sum(tracked.map(c=>c.purchases)):null,revenue:tracked.length?sum(tracked.map(c=>c.revenue_USD)):null,trackedSpend:sum(tracked.map(c=>c.spend_USD))}}
const followerGrowth=(b,p)=>{const a=acct(b,p);return a.followers_prev?(a.followers-a.followers_prev)/a.followers_prev*100:null};

/* ---------- small UI helpers ---------- */
function delta(cur,prev,o={}){
 const pv=prevP(STATE.period);
 if(cur==null||prev==null||!isFinite(cur)||!isFinite(prev)||(!o.pts&&prev===0))return `<span class="delta">No ${pv?short(pv)+" data":"previous month"}</span>`;
 const d=o.pts?cur-prev:(cur-prev)/Math.abs(prev)*100,flat=Math.abs(d)<(o.pts?0.05:0.5),good=o.down?d<0:d>0;
 return `<span class="delta ${flat||o.neutral?"":good?"up":"down"}">${flat?"■":d>0?"▲":"▼"} ${Math.abs(d).toFixed(1)}${o.pts?" pts":"%"} vs ${short(pv)}</span>`;
}
function spark(vals,color="#7654c8"){const v=vals.map(x=>x??null),ok=v.filter(x=>x!=null);if(ok.length<2)return"";const mn=Math.min(...ok),mx=Math.max(...ok),W=120,H=26,y=x=>H-3-(mx===mn?.5:(x-mn)/(mx-mn))*(H-6),pts=v.map((x,i)=>x==null?null:`${(i/(v.length-1)*(W-6)+3).toFixed(1)},${y(x).toFixed(1)}`).filter(Boolean);const li=pIdx(STATE.period);return `<svg class="spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${v[li]!=null?`<circle cx="${(li/(v.length-1)*(W-6)+3).toFixed(1)}" cy="${y(v[li]).toFixed(1)}" r="3.5" fill="${color}" stroke="#fff" stroke-width="1.5"/>`:""}</svg>`}
function kpi(label,value,d,sparkVals,title){return `<div class="kpi" title="${esc(title||"")}"><small>${label}</small><b>${value}</b>${d||""}${sparkVals?spark(sparkVals):""}</div>`}
function card(title,sub,body,extra=""){return `<div class="card"${extra}>${title?`<h3>${title}</h3>`:""}${sub?`<div class="sub">${sub}</div>`:""}${body}</div>`}
function hbars(obj,fmtv=v=>v+"%",max){const mx=max||Math.max(...Object.values(obj));return `<div class="hbars">${Object.entries(obj).map(([k,v])=>`<div class="hbar"><span>${esc(k)}</span><div class="track"><i style="width:${v/mx*100}%"></i></div><span>${fmtv(v)}</span></div>`).join("")}</div>`}
const SEV_ICON={critical:"✕ Critical",serious:"! Serious",warning:"⚠ Warning",good:"✓ Good",info:"i Info"};
const sev=s=>`<span class="sev ${s}">${SEV_ICON[s]}</span>`;

/* ---------- charts (SVG, hover crosshair + tooltip, data table) ---------- */
let CHARTS=[];
function niceMax(v){if(!(v>0))return 1;const e=Math.pow(10,Math.floor(Math.log10(v))),f=v/e;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*e}
function barPath(x,y,w,h,r){if(h<=0)return"";r=Math.min(r,h,w/2);return `M${x},${y+h}V${y+r}Q${x},${y} ${x+r},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y+r}V${y+h}Z`}
function chart(o){
 const id=CHARTS.push(o)-1,W=640,H=o.height||220,L=54,R=14,T=12,B=26,iw=W-L-R,ih=H-T-B,n=o.labels.length,f=o.fmt||(v=>compact(v));
 const vals=o.stacked?o.labels.map((_,i)=>sum(o.series.map(s=>s.values[i]))):o.series.flatMap(s=>s.values.filter(v=>v!=null));
 const max=o.max||niceMax(Math.max(...vals,0)*1.06/4)*4,y=v=>T+ih-(v/max)*ih,band=iw/n,xc=i=>L+band*i+band/2;
 Object.assign(o,{W,H,L,band});
 let g="";for(let k=0;k<=4;k++){const v=max*k/4;g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L-8}" y="${y(v)+4}" class="ax" text-anchor="end">${f(v,true)}</text>`}
 if(o.highlight!=null&&o.highlight>=0)g=`<rect x="${L+band*o.highlight}" y="${T}" width="${band}" height="${ih}" class="hl" rx="6"/>`+g;
 o.labels.forEach((l,i)=>{g+=`<text x="${xc(i)}" y="${H-8}" class="ax" text-anchor="middle"${i===o.highlight?' style="font-weight:800;fill:#211934"':""}>${esc(l)}</text>`});
 if(o.type==="bar"){
  const ns=o.series.length;
  if(o.stacked){const bw=Math.min(40,band*.55);o.labels.forEach((_,i)=>{let acc=0;const segs=o.series.map(s=>s.values[i]||0),top=segs.reduce((t,v,k)=>v>0?k:t,-1);segs.forEach((v,k)=>{if(v<=0)return;const y0=y(acc+v),h=y(acc)-y0-(acc>0?2:0);g+=k===top?`<path d="${barPath(xc(i)-bw/2,y0,bw,h,4)}" fill="${o.series[k].color}"/>`:`<rect x="${xc(i)-bw/2}" y="${y0}" width="${bw}" height="${Math.max(0,h)}" fill="${o.series[k].color}"/>`;acc+=v})})}
  else{const gw=Math.min(band*.72,ns*30),bw=(gw-(ns-1)*2)/ns;o.labels.forEach((_,i)=>o.series.forEach((s,k)=>{const v=s.values[i];if(v==null)return;const x=xc(i)-gw/2+k*(bw+2);g+=`<path d="${barPath(x,y(v),bw,y(0)-y(v),4)}" fill="${s.color}"${s.opacity?` opacity="${s.opacity}"`:""}/>`}))}
 }else{
  o.series.forEach(s=>{let d="",pen=false;s.values.forEach((v,i)=>{if(v==null){pen=false;return}d+=(pen?"L":"M")+xc(i)+","+y(v);pen=true});g+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"${s.dash?' stroke-dasharray="5 4"':""}/>`;s.values.forEach((v,i)=>{if(v!=null)g+=`<circle cx="${xc(i)}" cy="${y(v)}" r="4" fill="${s.color}" stroke="#fff" stroke-width="2"/>`})});
  if(o.series.length<=2&&o.highlight!=null)o.series.forEach(s=>{const v=s.values[o.highlight];if(v!=null)g+=`<text x="${xc(o.highlight)}" y="${y(v)-10}" class="vlabel" text-anchor="middle">${f(v)}</text>`});
 }
 g+=`<line class="xhair" x1="0" x2="0" y1="${T}" y2="${T+ih}" visibility="hidden"/><rect class="hit" x="${L}" y="${T}" width="${iw}" height="${ih}" fill="transparent"/>`;
 const legend=o.series.length>=2?`<div class="legend2">${o.series.map(s=>`<span><i class="${s.dash?"dash":""}" style="background:${s.color}"></i>${esc(s.name)}</span>`).join("")}</div>`:"";
 const table=`<details><summary>Show data table</summary><div class="tablewrap"><table class="compact" style="min-width:0"><thead><tr><th></th>${o.labels.map(l=>`<th>${esc(l)}</th>`).join("")}</tr></thead><tbody>${o.series.map(s=>`<tr><td>${esc(s.name)}</td>${s.values.map(v=>`<td>${v==null?"—":f(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`;
 return `<div class="chart" data-chart="${id}">${legend}<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.title||"Chart")}">${g}</svg>${table}</div>`;
}
document.addEventListener("mousemove",e=>{
 const tip=$("tip"),svg=e.target.closest&&e.target.closest(".chart svg");
 document.querySelectorAll(".chart .xhair[visibility=visible]").forEach(l=>{if(!svg||!svg.contains(l))l.setAttribute("visibility","hidden")});
 if(!svg){tip.classList.add("hidden");return}
 const o=CHARTS[+svg.parentNode.dataset.chart];if(!o)return;
 const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)*o.W/r.width,i=Math.floor((x-o.L)/o.band);
 if(i<0||i>=o.labels.length){tip.classList.add("hidden");return}
 const xh=svg.querySelector(".xhair"),cx=o.L+o.band*i+o.band/2;xh.setAttribute("x1",cx);xh.setAttribute("x2",cx);xh.setAttribute("visibility","visible");
 const f=o.fmt||(v=>compact(v));
 tip.innerHTML=`<b>${esc(o.tipLabel?o.tipLabel(i):o.labels[i])}</b>${o.series.map(s=>`<div><i style="background:${s.color}"></i>${esc(s.name)}: ${s.values[i]==null?"No data":f(s.values[i])}</div>`).join("")}${o.tipNote?`<div style="opacity:.75;margin-top:3px">${esc(o.tipNote)}</div>`:""}`;
 tip.classList.remove("hidden");const tw=tip.offsetWidth;tip.style.left=Math.min(window.innerWidth-tw-8,e.clientX+14)+"px";tip.style.top=(e.clientY+14)+"px";
});
const C={organic:"#7654c8",paid:"#d99c42",ink:"#211934",ref:"#c4bdd3",s1:"#257de0",s2:"#f47230",s3:"#00b894",s4:"#f2a600",s5:"#ee7fac"};
const PILLAR_COLORS={"Product":C.s1,"Behind the scenes":C.s2,"Offers":C.s3,"Community":C.s4,"Atmosphere":C.s5};
const mlabels=()=>MONTHS.map(short);

/* ---------- metric definitions (grading) ---------- */
const OK=v=>({v}),NA=r=>({status:"na",reason:r}),UN=r=>({status:"unavailable",reason:r});
const avgOf=(ps,fn,why)=>{const v=ps.map(fn).filter(x=>x!=null);return v.length?OK(avg(v)):NA(why||"No data")};
const ORGANIC_DEFS={
 "Shares":{unit:"",dir:"up",def:"Shares from organic distribution. Account: average per post.",post:p=>OK(p.organic.shares),account:(b,per)=>avgOf(postsOf(b,per),p=>p.organic.shares)},
 "Saves":{unit:"",dir:"up",def:"Saves from organic distribution. Account: average per post.",post:p=>OK(p.organic.saves),account:(b,per)=>avgOf(postsOf(b,per),p=>p.organic.saves)},
 "Organic engagement rate":{unit:"%",dir:"up",def:"(Likes + comments + saves + shares from organic distribution) ÷ organic reach × 100. Account: average of post rates.",post:p=>OK(organicER(p)),account:(b,per)=>avgOf(postsOf(b,per),organicER)},
 "Organic reach":{unit:"",dir:"up",def:"Accounts reached without paid distribution. Account: average per post (post reach is not deduplicated across posts).",post:p=>OK(p.organic_reach),account:(b,per)=>avgOf(postsOf(b,per),p=>p.organic_reach)},
 "Organic watch time":{unit:" sec",dir:"up",def:"Average watch time per view. Reels only.",post:p=>p.avg_watch_sec==null?NA("Not a video"):OK(p.avg_watch_sec),account:(b,per)=>avgOf(postsOf(b,per),p=>p.avg_watch_sec,"No Reels this period")},
 "Average retention":{unit:"%",dir:"up",def:"Average watch time ÷ video length × 100 (demo proxy for the retention curve). Reels only.",post:p=>p.completion_pct==null?NA("Not a video"):OK(p.completion_pct),account:(b,per)=>avgOf(postsOf(b,per),p=>p.completion_pct,"No Reels this period")},
 "Skip rate":{unit:"%",dir:"down",def:"Share of views that swiped away in the first seconds. Reels only. Optional.",post:p=>p.skip_rate_pct==null?NA("Not a video"):OK(p.skip_rate_pct),account:(b,per)=>avgOf(postsOf(b,per),p=>p.skip_rate_pct,"No Reels this period")},
 "Profile visit rate":{unit:"%",dir:"up",def:"Profile visits from the post ÷ organic reach × 100. Only for posts with no paid distribution, because post-level profile visits include paid viewers.",post:p=>p.paid_reach?UN("Boosted post: profile visits include paid viewers, so organic reach is not a compatible denominator"):OK(p.profile_visits/p.organic_reach*100),account:(b,per)=>{const o=postsOf(b,per).filter(p=>!p.paid_reach);return o.length?OK(sum(o.map(p=>p.profile_visits))/sum(o.map(p=>p.organic_reach))*100):UN("Every post was boosted, so there is no compatible organic denominator")}},
 "Profile-to-follow conversion rate":{unit:"%",dir:"up",accountOnly:true,def:"New follows ÷ profile visits × 100, account level. Not attributed to individual posts.",account:(b,per)=>{const a=acct(b,per);return a&&a.profile_visits?OK(a.new_follows/a.profile_visits*100):UN("Account insights not available")}},
 "Follower growth":{unit:"%",dir:"up",accountOnly:true,def:"(Followers at end of month − start) ÷ start × 100. Account level only.",account:(b,per)=>{const g=followerGrowth(b,per);return g==null?UN("No previous month in the demo data"):OK(g)}}
};
const noTrack="Conversion tracking is not set up for this campaign";
const PAID_DEFS={
 "ROAS":{unit:"x",dir:"up",def:"Attributed purchase revenue ÷ spend.",get:c=>c.revenue_USD==null?UN(noTrack):OK(c.revenue_USD/c.spend_USD)},
 "Cost per purchase":{unit:"$",dir:"down",def:"Spend ÷ attributed purchases.",get:c=>c.purchases==null?UN(noTrack):c.purchases?OK(c.spend_USD/c.purchases):UN("No purchases recorded")},
 "Purchases":{unit:"",dir:"up",perCampaign:true,def:"Attributed purchases (attribution window shown in the campaign).",get:c=>c.purchases==null?UN(noTrack):OK(c.purchases)},
 "Revenue":{unit:"$",dir:"up",perCampaign:true,def:"Attributed purchase revenue in USD.",get:c=>c.revenue_USD==null?UN(noTrack):OK(c.revenue_USD)},
 "Conversion rate":{unit:"%",dir:"up",def:"Purchases ÷ landing page views × 100.",get:c=>c.purchases==null?UN(noTrack):OK(c.purchases/c.landing_page_views*100)},
 "Paid reach":{unit:"",dir:"up",perCampaign:true,def:"Accounts reached by the campaign.",get:c=>OK(c.reach)},
 "Cost per engagement":{unit:"$",dir:"down",def:"Spend ÷ engagement actions on the ad.",get:c=>c.engagements?OK(c.spend_USD/c.engagements):UN("No engagement results")},
 "Engagement actions":{unit:"",dir:"up",perCampaign:true,def:"Likes, comments, saves and shares from the ad.",get:c=>c.engagements==null?UN("No engagement results"):OK(c.engagements)},
 "Cost per landing page view":{unit:"$",dir:"down",def:"Spend ÷ landing page views.",get:c=>c.landing_page_views?OK(c.spend_USD/c.landing_page_views):UN("No landing page views")},
 "Landing page views":{unit:"",dir:"up",perCampaign:true,def:"Landing page loads after a link click.",get:c=>OK(c.landing_page_views)},
 "Link clicks":{unit:"",dir:"up",perCampaign:true,def:"Clicks on the ad's link.",get:c=>OK(c.link_clicks)},
 "Click-through rate":{unit:"%",dir:"up",def:"Link clicks ÷ impressions × 100.",get:c=>OK(c.link_clicks/c.impressions*100)},
 "CPC":{unit:"$",dir:"down",def:"Spend ÷ link clicks (link clicks only, not all clicks).",get:c=>c.link_clicks?OK(c.spend_USD/c.link_clicks):UN("No link clicks")}
};

/* ---------- formula state & versions ---------- */
const PROFILES={lenient:{cap:120,cut:[88,82,76,70,64,58,50]},standard:{cap:110,cut:[95,90,85,80,75,70,60]},strict:{cap:100,cut:[98,95,92,88,84,80,70]}};
const LETTERS=["A+","A","B+","B","C+","C","D"];
const ORG=[["Shares",15,18,150],["Saves",15,18,200],["Organic engagement rate",15,18,4],["Organic reach",10,12,30000],["Organic watch time",10,12,8],["Average retention",10,11,35],["Skip rate",0,0,30],["Profile visit rate",10,11,2],["Profile-to-follow conversion rate",10,null,15],["Follower growth",5,null,3]];
const PAID={sales:[["ROAS",35,4],["Cost per purchase",25,2],["Purchases",15,100],["Revenue",10,400],["Conversion rate",15,3],["Paid reach",0,20000]],engagement:[["Cost per engagement",55,0.15],["Engagement actions",45,1000],["Paid reach",0,20000]],traffic:[["Cost per landing page view",30,0.25],["Landing page views",25,2000],["Link clicks",20,2500],["Click-through rate",15,1.5],["CPC",10,0.2]]};
function defaultSettings(){return{
 name:"My performance formula",scope:"account",profile:"standard",custom:clone(PROFILES.standard),weightMode:"auto",organicMix:70,paidAgg:"equal",objective:"sales",
 organic:{account:ORG.map(([n,w,,t])=>({name:n,weight:w,target:t,selected:w>0})),post:ORG.filter(r=>r[2]!==null).map(([n,,w,t])=>({name:n,weight:w,target:t,selected:w>0}))},
 paid:Object.fromEntries(Object.entries(PAID).map(([k,a])=>[k,a.map(([n,w,t])=>({name:n,weight:w,target:t,selected:w>0}))])),
 campaignTargets:{}}}
let S=defaultSettings();
const HKEY="socialIntelligenceGradeHistoryV2";
let history=store.get(HKEY)||[{version:1,name:"Demo default",savedAt:"01 Mar 2026",effectiveFrom:MONTHS[0],settings:defaultSettings()}];
const effIdx=h=>{const i=MONTHS.indexOf(h.effectiveFrom);return i<0?MONTHS.length:i};
function versionFor(p){const i=pIdx(p),c=history.filter(h=>effIdx(h)<=i);if(!c.length)return history[0];return c.reduce((a,h)=>effIdx(h)>effIdx(a)||(effIdx(h)===effIdx(a)&&h.version>a.version)?h:a)}
const official=p=>versionFor(p).settings;
const prof=G=>G.profile==="custom"?G.custom:PROFILES[G.profile];
function letterFor(score,G){const c=prof(G).cut;for(let i=0;i<c.length;i++)if(score>=c[i])return LETTERS[i];return "F"}

/* ---------- scoring engine ---------- */
function scoreSet(list,valueOf,targetOf,G){
 const sel=list.filter(m=>m.selected&&m.weight>0),totalW=sum(sel.map(m=>m.weight)),cap=prof(G).cap;
 if(!sel.length)return{status:"none",rows:[]};
 const rows=sel.map(m=>{const r=valueOf(m.name),t=targetOf(m),row={name:m.name,weight:m.weight,target:t.value,targetSource:t.source,unit:m.unit,dir:m.dir,def:m.def};if(r.status)return{...row,status:r.status,reason:r.reason};const ach=m.dir==="down"?(r.v>0?t.value/r.v*100:cap):(t.value>0?r.v/t.value*100:100);return{...row,actual:r.v,ach,pts:Math.min(ach,cap)}});
 const ok=rows.filter(r=>r.ach!=null),aw=sum(ok.map(r=>r.weight)),coverage=totalW?aw/totalW*100:0;
 ok.forEach(r=>r.eff=r.weight/aw*100);
 const out={rows,coverage,totalW};
 if(G.weightMode==="manual"&&totalW!==100)return{...out,status:"weights"};
 if(coverage<60)return{...out,status:"insufficient"};
 const raw=sum(ok.map(r=>r.pts*r.weight))/aw;out.avgAch=sum(ok.map(r=>r.ach*r.weight))/aw;out.score=Math.min(100,Math.round(raw));out.letter=letterFor(out.score,G);return out;
}
const withDefs=(list,defs)=>list.map(m=>({...m,...defs[m.name]}));
const CACHE=new WeakMap();
function memo(G,key,fn){if(G===S)return fn();let m=CACHE.get(G);if(!m)CACHE.set(G,m=new Map());if(!m.has(key))m.set(key,fn());return m.get(key)}
function gradeOrganicAccount(b,per,G){return memo(G,"o|"+b+"|"+per,()=>scoreSet(withDefs(G.organic.account,ORGANIC_DEFS),n=>ORGANIC_DEFS[n].account(b,per),m=>({value:m.target,source:"formula"}),G))}
function gradePost(p,G){G=G||official(p.period);return memo(G,"p|"+p.id,()=>scoreSet(withDefs(G.organic.post,ORGANIC_DEFS),n=>ORGANIC_DEFS[n].post(p),m=>({value:m.target,source:"formula"}),G))}
function campaignTarget(c,m,G){const o=G.campaignTargets[c.id]?.[m.name];if(o!=null)return{value:o,source:"campaign (edited)"};if(c.targets[m.name]!=null)return{value:c.targets[m.name],source:"campaign"};return{value:m.target,source:"formula default"}}
function gradeCampaign(c,G){G=G||official(c.period);return memo(G,"c|"+c.id,()=>scoreSet(withDefs(G.paid[c.objective],PAID_DEFS),n=>PAID_DEFS[n].get(c),m=>campaignTarget(c,m,G),G))}
function gradePaidAccount(b,per,G){return memo(G,"pa|"+b+"|"+per,()=>{
 const cs=campsOf(b,per).map(c=>({c,r:gradeCampaign(c,G)})),ok=cs.filter(x=>x.r.score!=null);
 if(!cs.length)return{status:"unavailable",reason:"No paid campaigns this period",campaigns:cs};
 if(!ok.length)return{status:"insufficient",reason:"No campaign has enough reliable data",campaigns:cs};
 const w=x=>G.paidAgg==="spend"?x.c.spend_USD:1,score=Math.round(sum(ok.map(x=>x.r.score*w(x)))/sum(ok.map(w)));
 return{score,letter:letterFor(score,G),campaigns:cs,graded:ok.length};})}
function gradeOverall(b,per,G){G=G||official(per);return memo(G,"ov|"+b+"|"+per,()=>{
 const o=gradeOrganicAccount(b,per,G),p=gradePaidAccount(b,per,G),om=G.organicMix,pm=100-om;let score=null,note="";
 if(o.score!=null&&p.score!=null){score=Math.round((o.score*om+p.score*pm)/100);note=`Organic ${o.score} × ${om}% + Paid ${p.score} × ${pm}%.`}
 else if(o.score!=null){score=o.score;note=`Paid scorecard ${p.status==="unavailable"?"unavailable":"has insufficient data"}: overall uses organic only.`}
 else if(p.score!=null){score=p.score;note="Organic scorecard has insufficient data: overall uses paid only."}
 else note="Neither scorecard has enough data for an overall grade.";
 return{o,p,score,letter:score!=null?letterFor(score,G):null,note};})}

/* ---------- grade display helpers ---------- */
function fmtVal(v,u){if(v==null)return"—";if(u==="$")return v>=100?usd0(v):usd(v);if(u==="%")return v.toFixed(v<10?2:1)+"%";if(u==="x")return v.toFixed(2)+"x";if(u===" sec")return v.toFixed(1)+" sec";return v<100&&v%1?v.toFixed(1):fmt(v)}
const tone=l=>!l?"none":l[0]==="A"?"a":l[0]==="B"?"b":l[0]==="C"?"c":"d";
function chip(r,big){if(r&&r.score!=null)return `<span class="gchip g-${tone(r.letter)}${big?" big":""}" title="${r.score} / 100">${r.letter}${big?` · ${r.score}`:""}</span>`;const t={none:"No metrics",weights:"Weights ≠ 100%",insufficient:"Insufficient data",unavailable:"Unavailable"}[r&&r.status]||"—";return `<span class="gchip g-none${big?" big":""}">${t}</span>`}
function explain(r,who){
 if(r.status==="none")return"No metrics are selected in this formula.";
 if(r.status==="weights")return`The selected weights total ${r.totalW}%, not 100%. Balance them, or switch to automatic rebalancing, to see a grade.`;
 const ok=r.rows.filter(x=>x.ach!=null).sort((a,b)=>b.ach-a.ach),miss=r.rows.filter(x=>x.ach==null);
 let t=r.score!=null?`${who} scores <b>${r.score}/100 (${r.letter})</b>, with average target achievement of ${Math.round(r.avgAch)}%. `:`${who} has <b>insufficient data</b>: only ${Math.round(r.coverage)}% of the formula's weight could be measured (minimum 60%). `;
 if(ok.length){t+=`Strongest: <b>${ok[0].name}</b> at ${Math.round(ok[0].ach)}% of target. `;if(ok.length>1)t+=`Weakest: <b>${ok.at(-1).name}</b> at ${Math.round(ok.at(-1).ach)}% of target. `}
 if(miss.length)t+=`Left out (not scored as zero): ${miss.map(x=>`${x.name} (${x.reason.toLowerCase()})`).join("; ")}.`;
 return t;
}
function breakdownTable(r,editCampaign){
 if(!r.rows.length)return"";
 return `<table class="compact"><thead><tr><th>Metric</th><th>Actual</th><th>Target</th><th>Target achievement</th><th>Weight</th><th>Effective weight</th><th>Points</th></tr></thead><tbody>${r.rows.map(x=>{const ok=x.ach!=null,pc=ok?Math.round(x.ach):null;return `<tr${ok?"":' class="na"'}><td title="${esc(x.def||"")}"><b>${x.name}</b><br><span class="grade-help">${x.dir==="down"?"Lower is better":"Higher is better"}</span></td><td>${ok?fmtVal(x.actual,x.unit):`<span class="muted">${x.status==="na"?"Not applicable":"Unavailable"}</span>`}</td><td>${editCampaign?`<input type="number" step="any" min="0" class="tgt" data-camp="${editCampaign}" data-metric="${x.name}" value="${+x.target.toFixed(4)}">`:fmtVal(x.target,x.unit)}<br><span class="grade-help">${x.targetSource}</span></td><td>${ok?`<div class="achbar"><i class="${pc>=100?"hit":pc>=75?"near":"miss"}" style="width:${Math.min(pc,150)/1.5}%"></i></div>${pc}%`:`<span class="grade-help">${esc(x.reason)}</span>`}</td><td>${x.weight}%</td><td>${ok?x.eff.toFixed(0)+"%":"—"}</td><td>${ok?(x.pts*x.eff/100).toFixed(1):"—"}</td></tr>`}).join("")}</tbody></table>`;
}
const gradeSeries=(b,part)=>MONTHS.map(m=>{const ov=gradeOverall(b,m);const r=part==="o"?ov.o:part==="p"?ov.p:ov;return r.score??null});
