/* =========================================================================
   Part 3: Content Analysis, Targets & Grading, navigation
   ========================================================================= */
let selected=null,openCampaign=null;

/* ---------- Content analysis ---------- */
$("type").innerHTML=`<option value="All">All formats</option>`+[...new Set(DATA.map(p=>p.format))].map(f=>`<option>${f}</option>`).join("");
$("pillar").innerHTML=`<option value="All">All content pillars</option>`+Object.keys(PILLAR_COLORS).map(f=>`<option>${f}</option>`).join("");
function filtered(){
 const q=$("search").value.toLowerCase(),mode=$("paid").value,s=$("sort").value;
 let a=postsOf(STATE.brand,STATE.period).filter(p=>($("type").value==="All"||p.format===$("type").value)&&($("pillar").value==="All"||p.pillar===$("pillar").value)&&(p.title+" "+p.brand+" "+p.id+" "+p.pillar).toLowerCase().includes(q));
 if(mode==="Organic only")a=a.filter(p=>!p.paid_reach);
 if(mode==="Organic + Paid")a=a.filter(p=>p.paid_reach>0&&p.organic_reach>0);
 if(mode==="Paid only")a=a.filter(p=>p.paid_reach>0&&!p.organic_reach);
 const g=p=>gradePost(p).score??-1;
 a.sort((x,y)=>s==="paid"?paidShare(y)-paidShare(x):s==="watch"?(y.avg_watch_sec??-1)-(x.avg_watch_sec??-1):s==="organic"?y.organic_reach-x.organic_reach:s==="grade"?g(y)-g(x):s==="date"?y.id.localeCompare(x.id):(y.organic_reach+y.paid_reach)-(x.organic_reach+x.paid_reach));
 return a;
}
function render(){
 const list=filtered(),mode=$("paid").value;
 $("postCount").textContent=`${list.length} posts · ${STATE.brand} · ${STATE.period}`;
 $("rows").innerHTML=list.length?list.map(p=>{const share=paidShare(p),r=gradePost(p);return `<tr data-id="${p.id}"><td><span class="thumb">${p.format==="Reel"?"▶":"▤"}</span><b>${esc(p.title)}</b><br><span class="muted">${esc(p.brand)} · ${p.id} · ${p.pillar}</span></td><td>${p.date}</td><td>${p.format}</td><td>${fmt(p.organic_reach)}</td><td>${p.paid_reach?fmt(p.paid_reach):"—"}</td><td><div class="bar"><i style="width:${100-share}%"></i><i style="width:${share}%"></i></div></td><td>${share}%</td><td>${p.avg_watch_sec!=null?p.avg_watch_sec+" sec":"N/A"}</td><td>${p.completion_pct!=null?p.completion_pct+"%":"N/A"}</td><td>${p.ad_spend_USD?usd(p.ad_spend_USD):"—"}</td><td>${chip(r)}</td></tr>`}).join(""):`<tr><td colspan="11" class="empty">${mode==="Paid only"?"No ads-only media in this demo dataset. In production, ads that never appear on the profile (dark posts) are listed here, with paid metrics only.":"No posts match these filters."}</td></tr>`;
}
$("rows").onclick=e=>{const tr=e.target.closest("tr[data-id]");if(tr)openPost(tr.dataset.id)};
function metric(l,v,sub){return `<div class="metric"><small>${l}</small><b>${v}</b>${sub?`<span class="grade-help">${sub}</span>`:""}</div>`}
function openPost(id){
 selected=postById(id);if(!selected)return;
 const p=selected,s=paidShare(p),isVideo=p.avg_watch_sec!=null,o=p.organic,pd=p.paid,oi=sum(Object.values(o)),pi=sum(Object.values(pd));
 const camp=CAMPAIGNS.find(c=>c.id===p.campaign_id),gr=gradePost(p),v=versionFor(p.period);
 let warning=p.paid_reach&&s>=60?`<div class="warning"><b>High paid dependency:</b> ${s}% of the reported reach is paid. Do not treat total reach as proof of strong organic performance.</div>`:"";
 if(isVideo&&p.completion_pct<25)warning+=`<div class="warning"><b>Retention warning:</b> Completion proxy is low. Inspect the retention curve and opening seconds.</div>`;
 const irow=(k,l)=>`<tr><td>${l}</td><td>${fmt(o[k])}</td><td>${p.paid_reach?fmt(pd[k]):"—"}</td><td>${fmt(o[k]+pd[k])}</td></tr>`;
 $("detailView").innerHTML=`<div class="detailhead"><div><span class="pill">${esc(p.brand)} · ${p.format} · ${p.pillar}</span><h2>${esc(p.title)}</h2><span class="muted">${p.date} · ${p.id}</span></div><button id="back">← Back to posts</button></div>
 <div class="grid">${metric("Organic reach",fmt(p.organic_reach))}${metric("Paid reach",p.paid_reach?fmt(p.paid_reach):"0")}${metric("Paid share of reported reach",s+"%","Not a share of unique people")}${metric("Ad spend",p.ad_spend_USD?usd(p.ad_spend_USD):"—",camp?`Campaign ${camp.id}: ${esc(camp.name)}`:"Not promoted")}</div>
 <div class="split"><div class="card"><b>Reach distribution</b><div class="reachbar"><div class="org" style="width:${100-s}%"></div><div class="paid" style="width:${s}%"></div></div><div class="legend"><span>Organic ${100-s}%</span><span>Paid ${s}%</span></div><p class="note">Illustrative split only. Live unique reach may overlap; use source-reported values and overlap caveats.</p></div>
 <div class="card"><b>Video attention</b>${isVideo?`<div class="metric">${p.avg_watch_sec} sec</div><div class="muted">Average watch time</div><div class="metric">${p.completion_pct}%</div><div class="muted">Demo completion proxy (avg watch ÷ length)</div><div class="metric">${p.skip_rate_pct}%</div><div class="muted">Skip rate</div><div class="muted" style="margin-top:6px">Video length: ${p.video_length_sec} sec</div>`:`<div class="metric">Not applicable</div><div class="muted">${p.format} posts have no watch-time or retention metrics.</div>`}</div></div>
 <div class="grid">${metric("Organic views",fmt(p.organic_views),"Times the post was seen organically")}${metric("Paid impressions",fmt(p.paid_impressions),"Times the ad was shown")}${metric("Organic interactions",fmt(oi))}${metric("Ad-driven interactions",p.paid_reach?fmt(pi):"—")}</div>
 <div class="split"><div class="card tablewrap"><b>Engagement actions: organic vs paid</b><table class="compact" style="margin-top:8px;min-width:0"><thead><tr><th>Action</th><th>Organic</th><th>From the ad</th><th>Total</th></tr></thead><tbody>${irow("likes","Likes")}${irow("comments","Comments")}${irow("saves","Saves")}${irow("shares","Shares")}</tbody></table><p class="note">Ad-driven actions come from the promoted ad's reported results. Organic = post total − ad-driven.</p></div>
 <div class="card"><b>Profile activity from this post</b><div class="grid" style="grid-template-columns:1fr 1fr;margin-top:8px">${metric("Profile visits",fmt(p.profile_visits))}${metric("Follows",fmt(p.follows))}</div><p class="note">Instagram reports these for the post as a whole, so organic and paid viewers can't be separated. ${p.paid_reach?"Because this post was boosted, the profile visit rate is not calculated: organic reach would be the wrong denominator.":`Profile visit rate: ${(p.profile_visits/p.organic_reach*100).toFixed(2)}% of organic reach.`}</p></div></div>
 <div class="card"><div class="detailhead"><b>Post grade (organic post formula · v${v.version} in effect for ${p.period})</b>${chip(gr,true)}</div><p class="explain">${explain(gr,"This post")}</p><div class="tablewrap">${breakdownTable(gr)}</div></div>
 <div class="card"><b>What happened?</b><p>Organic reach: ${fmt(p.organic_reach)}. Paid reach: ${fmt(p.paid_reach)}. ${p.paid_reach?`Advertising contributed ${s}% of the reported reach and ${Math.round(pi/(oi+pi)*100)}% of interactions.`:"No paid reach is recorded for this post."}</p><p class="note">Production AI should compare this post against similar posts, its own historical baseline, ad delivery dates and objectives. It should not claim the ad caused organic lift without a suitable experiment or evidence.</p></div>${warning}`;
 $("listView").classList.add("hidden");$("detailView").classList.remove("hidden");$("listTab").classList.remove("active");$("detailTab").classList.add("active");$("detailTab").disabled=false;$("back").onclick=back;window.scrollTo(0,0);
}
function back(){$("detailView").classList.add("hidden");$("listView").classList.remove("hidden");$("detailTab").classList.remove("active");$("listTab").classList.add("active");$("detailTab").disabled=true;selected=null}
["type","pillar","paid","sort","search"].forEach(id=>$(id).addEventListener("input",render));

/* ---------- Targets & Grading ---------- */
const basis=()=>$("gradeBasis").value==="locked"?official(STATE.period):S;
const laneList=lane=>lane==="organic"?S.organic[S.scope]:S.paid[S.objective];
function rebalance(arr,fixedName){
 const sel=arr.filter(m=>m.selected);if(!sel.length)return;
 const fixed=sel.find(m=>m.name===fixedName),others=sel.filter(m=>m!==fixed),room=100-(fixed?fixed.weight:0),os=sum(others.map(m=>m.weight));
 let left=room;others.forEach((m,i)=>{const w=i===others.length-1?left:Math.round(os?m.weight*room/os:room/others.length);m.weight=Math.max(0,w);left-=m.weight});
 if(!others.length&&fixed)fixed.weight=100;
 arr.filter(m=>!m.selected).forEach(m=>m.weight=0);
}
function renderLane(lane){
 const arr=laneList(lane),el=$(lane+"MetricList"),defs=lane==="organic"?ORGANIC_DEFS:PAID_DEFS;
 let html=arr.map(m=>{const d=defs[m.name];return `<div class="mrow"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-check="${m.name}" ${m.selected?"checked":""}><span style="font-weight:700" title="${esc(d.def)}">${m.name}</span><span class="grade-help" style="margin-left:auto">${d.dir==="down"?"Lower is better":"Higher is better"}</span></label><div class="grade-help" style="margin:3px 0 0 25px">${esc(d.def)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:7px 0 0 25px"><label class="grade-help">Weight %<input type="number" min="0" max="100" data-weight="${m.name}" value="${m.weight}" ${m.selected?"":"disabled"} style="display:block;width:100%;margin-top:3px"></label><label class="grade-help">${d.perCampaign?"Default target":"Target"}${d.unit?` (${d.unit.trim()})`:""}<input type="number" min="0" step="any" data-target="${m.name}" value="${m.target}" ${m.selected?"":"disabled"} style="display:block;width:100%;margin-top:3px"></label></div></div>`}).join("");
 if(lane==="organic"&&S.scope==="post")html+=Object.entries(ORGANIC_DEFS).filter(([,d])=>d.accountOnly).map(([n])=>`<div class="mrow" style="opacity:.55"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" disabled><span style="font-weight:700">${n}</span><span class="grade-help" style="margin-left:auto">Account-level only</span></label><div class="grade-help" style="margin:3px 0 0 25px">Not offered in a post formula: it can't be attributed to a single post.</div></div>`).join("");
 el.innerHTML=html;weightTotal(lane);
}
function weightTotal(lane){const t=sum(laneList(lane).filter(m=>m.selected).map(m=>m.weight)),el=$(lane+"WeightTotal");el.textContent=t+"%";el.style.color=t===100?"var(--green)":"var(--red)";$(lane+"WeightBar").style.width=Math.min(t,100)+"%"}
function setMetric(lane,name,patch){const m=laneList(lane).find(x=>x.name===name);if(m)Object.assign(m,patch)}
["organicMetricList","paidMetricList"].forEach(id=>{
 const lane=id.startsWith("organic")?"organic":"paid";
 $(id).addEventListener("change",e=>{const el=e.target,arr=laneList(lane);
  if(el.dataset.check){const n=arr.filter(m=>m.selected).length+(el.checked?1:0);setMetric(lane,el.dataset.check,{selected:el.checked,weight:el.checked?Math.round(100/Math.max(n,1)):0});if(S.weightMode==="auto")rebalance(arr,el.checked?el.dataset.check:null)}
  if(el.dataset.weight){setMetric(lane,el.dataset.weight,{weight:Math.max(0,Math.min(100,Math.round(Number(el.value)||0)))});if(S.weightMode==="auto")rebalance(arr,el.dataset.weight)}
  if(el.dataset.target)setMetric(lane,el.dataset.target,{target:Math.max(0,Number(el.value)||0)});
  gradeRender()});
 $(id).addEventListener("input",e=>{if(e.target.dataset.weight){setMetric(lane,e.target.dataset.weight,{weight:Math.max(0,Math.min(100,Number(e.target.value)||0))});weightTotal(lane)}});
});
function renderScale(){
 const p=prof(S),custom=S.profile==="custom";
 $("gradeScale").innerHTML=LETTERS.map((l,i)=>`<label class="scale-item"><span class="gchip g-${tone(l)}">${l}</span><span class="grade-help">from</span><input type="number" min="0" max="100" data-cut="${i}" value="${p.cut[i]}"></label>`).join("")+`<label class="scale-item"><span class="gchip g-d">F</span><span class="grade-help">below ${p.cut[6]}</span></label><label class="scale-item wide"><span class="grade-help">Max credit per metric</span><input type="number" min="100" max="200" data-cap value="${p.cap}"><span class="grade-help">%</span></label>`;
 $("scaleHint").textContent=custom?"Custom profile: cutoffs must step down from A+ to D.":"Edit any cutoff to switch to a Custom profile.";
}
$("gradeScale").addEventListener("change",e=>{const el=e.target;if(S.profile!=="custom"){S.custom=clone(prof(S));S.profile="custom";$("gradeProfile").value="custom"}
 if(el.dataset.cut!=null){S.custom.cut[+el.dataset.cut]=Math.max(0,Math.min(100,Number(el.value)||0));for(let i=1;i<7;i++)if(S.custom.cut[i]>S.custom.cut[i-1])S.custom.cut[i]=S.custom.cut[i-1]}
 if(el.dataset.cap!=null)S.custom.cap=Math.max(100,Math.min(200,Number(el.value)||100));
 gradeRender()});

function gradeRender(){
 const G=basis(),locked=G!==S,b=STATE.brand,per=STATE.period,v=versionFor(per);
 renderLane("organic");renderLane("paid");renderScale();
 $("organicScopeHelp").textContent=S.scope==="post"?"Editing the post formula: grades every post in Content Analysis":"Editing the account formula: grades each brand's account for the month";
 $("organicMixLabel").textContent=S.organicMix;$("paidMixLabel").textContent=100-S.organicMix;
 $("gradeBasis").options[1].textContent=`Saved version in effect for ${per} (v${v.version})`;
 const ni=pIdx(per)+1,next=MONTHS[ni]||"Sep 2026",ef=$("effectiveFrom"),keep=ef.value;
 ef.innerHTML=`<option value="${next}">${next} onward (keep ${per} and earlier as graded)</option><option value="${per}">${per} onward (re-grade ${per}${ni<MONTHS.length?" and later":""})</option><option value="${MONTHS[0]}">${MONTHS[0]} onward (re-grade all six months)</option>`;
 if([...ef.options].some(o=>o.value===keep))ef.value=keep;
 $("previewBasis").innerHTML=locked?`<b>Locked view:</b> ${per} graded with v${v.version} “${esc(v.name)}”. Your unsaved edits are not applied.`:`Calculated from synthetic ${per} data using your current settings (live preview).`;
 $("portfolioPeriod").textContent=per;
 const one=b!==ALL;$("gradeBrandCards").classList.toggle("hidden",!one);
 $("previewBrand").textContent=one?b:"choose a brand";
 if(!one){$("previewBody").innerHTML=`<p class="grade-help" style="margin-top:14px">Choose a brand in the top bar, or click one in Portfolio grades below, to see its scorecards.</p>`;$("organicGrade").textContent="—";$("paidGrade").textContent="—"}
 else{
  if(!$("gradeLetter"))$("previewBody").innerHTML=`<div style="display:flex;align-items:center;gap:15px;margin:18px 0"><div class="grade-score" id="gradeLetter">—</div><div style="flex:1"><b id="gradePoints">—</b><div class="grade-bar" style="margin-top:7px"><i id="gradePreviewBar" style="width:0%"></i></div><div class="grade-help" id="gradeProfileText"></div></div></div><div class="detailhead"><b>Overall grade</b><b id="overallGrade">—</b></div><div class="mini-grades" id="previewParts"></div><div class="grade-help" id="overallNote" style="margin-top:8px"></div>`;
  const ov=gradeOverall(b,per,G),o=ov.o,p=ov.p;
  $("organicGrade").innerHTML=o.letter||`<span class="grade-na">${o.status==="weights"?"Fix weights":"No data"}</span>`;
  $("paidGrade").innerHTML=p.letter||`<span class="grade-na">${p.status==="unavailable"?"No campaigns":"No data"}</span>`;
  $("gradeLetter").textContent=ov.letter||"—";$("overallGrade").textContent=ov.letter||"—";
  $("gradePoints").textContent=ov.score!=null?ov.score+" / 100":"No grade";$("gradePreviewBar").style.width=(ov.score||0)+"%";
  $("gradeProfileText").textContent=({lenient:"Lenient",standard:"Standard",strict:"Strict",custom:"Custom"})[G.profile]+` scale · A from ${prof(G).cut[1]} · max credit ${prof(G).cap}% per metric`;
  $("previewParts").innerHTML=`<div class="subgrade"><small class="grade-help">Organic · ${G.organicMix}%</small>${chip(o,true)}</div><div class="subgrade"><small class="grade-help">Paid · ${100-G.organicMix}%</small>${chip(p.score!=null?p:{status:p.status==="unavailable"?"unavailable":"insufficient"},true)}</div>`;
  $("overallNote").textContent=ov.note;
  if(S.scope==="post"){
   const posts=postsOf(b,per);$("organicBreakdownTitle").textContent=`Post grades · ${b} · ${per}`;$("organicCoverage").textContent=`${posts.length} posts · post formula`;
   $("organicExplain").innerHTML="Each post is graded with the post formula. Account-only metrics (follower growth, profile-to-follow) are excluded. Boosted posts are graded on their organic results only.";
   $("organicBreakdown").innerHTML=`<table class="compact"><thead><tr><th>Post</th><th>Format</th><th>Grade</th><th>Avg target achievement</th><th>Coverage</th><th>Why</th></tr></thead><tbody>${posts.map(pp=>{const r=gradePost(pp,G),ok=r.rows.filter(x=>x.ach!=null).sort((a,c)=>c.ach-a.ach);return `<tr data-post="${pp.id}" style="cursor:pointer"><td><b>${esc(pp.title)}</b><br><span class="grade-help">${pp.id}${pp.paid_reach?" · boosted":""}</span></td><td>${pp.format}</td><td>${chip(r)}</td><td>${r.avgAch!=null?Math.round(r.avgAch)+"%":"—"}</td><td>${r.coverage!=null?Math.round(r.coverage)+"%":"—"}</td><td class="grade-help" style="white-space:normal">${ok.length?`Best: ${ok[0].name} ${Math.round(ok[0].ach)}% · Weakest: ${ok.at(-1).name} ${Math.round(ok.at(-1).ach)}%`:""}</td></tr>`}).join("")}</tbody></table>`;
  }else{
   $("organicBreakdownTitle").textContent=`Organic scorecard · ${b} · ${per}`;$("organicCoverage").textContent=o.coverage!=null?`Data coverage ${Math.round(o.coverage)}%`:"";
   $("organicExplain").innerHTML=explain(o,`${b}'s organic account`);$("organicBreakdown").innerHTML=breakdownTable(o);
  }
  $("paidBrandLabel").textContent=`${b} · ${per}`;
  $("paidSummary").textContent=p.score!=null?`Paid account ${p.letter} · ${p.score} · ${p.graded} of ${p.campaigns.length} campaigns graded`:p.reason||"";
  $("campaignTable").innerHTML=p.campaigns.length?`<table class="compact"><thead><tr><th>Campaign</th><th>Objective</th><th>Grade</th><th>Avg target achievement</th><th>Coverage</th><th>Spend / budget (context)</th><th>Tracking</th></tr></thead><tbody>${p.campaigns.map(({c,r})=>`<tr data-camp="${c.id}" class="${openCampaign===c.id?"open":""}" style="cursor:pointer"><td><b>${esc(c.name)}</b><br><span class="grade-help">${c.id}${c.linked_posts.length?` · boosts ${c.linked_posts.length} posts`:""}</span></td><td>${c.objective[0].toUpperCase()+c.objective.slice(1)}</td><td>${chip(r)}</td><td>${r.avgAch!=null?Math.round(r.avgAch)+"%":"—"}</td><td>${r.coverage!=null?Math.round(r.coverage)+"%":"—"}</td><td>${usd(c.spend_USD)} / ${usd0(c.budget_USD)}<div class="achbar"><i class="near" style="width:${Math.min(100,c.spend_USD/c.budget_USD*100)}%"></i></div></td><td>${c.objective==="sales"?esc(c.conversion_tracking):"Not required"}</td></tr>${openCampaign===c.id?`<tr class="drill"><td colspan="7"><p class="explain">${explain(r,"This campaign")}</p>${breakdownTable(r,locked?null:c.id)}<p class="grade-help">${c.objective==="sales"?"Attribution: 7-day click, 1-day view (demo). Meta-reported results are not incremental business impact.":"Results as reported by Meta for the campaign period."}${locked?"":" Edit a target above to change it for this campaign only."}</p></td></tr>`:""}`).join("")}</tbody></table>`:`<p class="grade-help">No paid campaigns for ${esc(b)} in ${per}. The paid scorecard is unavailable and the overall grade uses organic only.</p>`;
  $("paidExplain").innerHTML=p.score!=null?`Paid account grade = ${G.paidAgg==="spend"?"spend-weighted":"simple"} average of the ${p.graded} graded campaign${p.graded>1?"s":""}${p.graded<p.campaigns.length?". Campaigns with insufficient data are left out, not counted as zero":""}.`:"";
  const ps=paidStats(b,per);
  $("spendContext").innerHTML=metric("Planned budget",usd(ps.budget))+metric("Actual spend",usd(ps.spend))+metric("Remaining",usd(ps.budget-ps.spend))+metric("Budget used",ps.budget?Math.round(ps.spend/ps.budget*100)+"%":"—",per+" · "+ps.n+" campaigns");
 }
 $("portfolioGrades").innerHTML=`<table class="compact"><thead><tr><th>Brand</th><th>Organic</th><th>Paid</th><th>Overall</th><th>Notes</th><th>Spend / budget</th></tr></thead><tbody>${BRANDS.map(br=>{const x=gradeOverall(br,per,G),ps=paidStats(br,per);const flags=[];if(x.p.campaigns)x.p.campaigns.filter(y=>y.r.score==null).forEach(y=>flags.push(`${y.c.id}: insufficient data`));if(x.o.coverage!=null&&x.o.coverage<100)flags.push(`Organic coverage ${Math.round(x.o.coverage)}%`);return `<tr data-setbrand="${esc(br)}" class="${br===b?"open":""}" style="cursor:pointer"><td><b>${esc(br)}</b></td><td>${chip(x.o)}</td><td>${x.p.score!=null?chip(x.p):chip({status:"insufficient"})}</td><td>${x.letter?chip({letter:x.letter,score:x.score},true):chip({status:"insufficient"})}</td><td class="grade-help" style="white-space:normal">${flags.join(" · ")||"Full coverage"}</td><td>${usd0(ps.spend)} / ${usd0(ps.budget)}</td></tr>`}).join("")}</tbody></table>`;
 renderHistory();
}
function renderHistory(){
 const gov=h=>MONTHS.filter(m=>versionFor(m)===h);
 $("historyTable").innerHTML=`<table class="compact"><thead><tr><th>Version</th><th>Name</th><th>Saved</th><th>Effective from</th><th>Grades these months</th><th>Profile</th><th></th></tr></thead><tbody>${[...history].reverse().map(h=>{const g=gov(h);return `<tr><td>v${h.version}</td><td>${esc(h.name)}</td><td>${h.savedAt}</td><td>${h.effectiveFrom}</td><td>${g.length?g.map(short).join(", "):'<span class="grade-help">None yet (future months)</span>'}</td><td>${h.settings.profile}</td><td><button class="small" data-load="${h.version}">Load into editor</button></td></tr>`}).join("")}</tbody></table>`;
}
$("historyTable").addEventListener("click",e=>{const bt=e.target.closest("[data-load]");if(!bt)return;const h=history.find(x=>x.version==bt.dataset.load);if(h){S=clone(h.settings);syncControls();$("gradeBasis").value="draft";gradeRender();$("saveStatus").textContent=`Loaded v${h.version} into the editor. Saving creates a new version.`}});
$("campaignTable").addEventListener("click",e=>{if(e.target.closest("input"))return;const tr=e.target.closest("tr[data-camp]");if(tr){openCampaign=openCampaign===tr.dataset.camp?null:tr.dataset.camp;gradeRender()}});
$("campaignTable").addEventListener("change",e=>{const el=e.target;if(!el.classList.contains("tgt"))return;(S.campaignTargets[el.dataset.camp]??={})[el.dataset.metric]=Math.max(0,Number(el.value)||0);gradeRender()});
function syncControls(){$("formulaName").value=S.name;$("gradeScope").value=S.scope;$("gradeProfile").value=S.profile;$("weightMode").value=S.weightMode;$("organicMix").value=S.organicMix;$("paidAgg").value=S.paidAgg;$("campaignObjective").value=S.objective}
$("gradeScope").onchange=()=>{S.scope=$("gradeScope").value;gradeRender()};
$("gradeProfile").onchange=()=>{if($("gradeProfile").value==="custom"&&S.profile!=="custom")S.custom=clone(prof(S));S.profile=$("gradeProfile").value;gradeRender()};
$("weightMode").onchange=()=>{S.weightMode=$("weightMode").value;if(S.weightMode==="auto"){rebalance(S.organic.account);rebalance(S.organic.post);Object.values(S.paid).forEach(a=>rebalance(a))}gradeRender()};
$("organicMix").oninput=()=>{S.organicMix=Number($("organicMix").value);gradeRender()};
$("paidAgg").onchange=()=>{S.paidAgg=$("paidAgg").value;gradeRender()};
$("campaignObjective").onchange=()=>{S.objective=$("campaignObjective").value;gradeRender()};
$("formulaName").oninput=()=>{S.name=$("formulaName").value};
$("gradeBasis").onchange=gradeRender;
$("gradePreset").onchange=()=>{const v=$("gradePreset").value,sets={awareness:["Organic reach","Profile visit rate","Follower growth","Shares"],engagement:["Shares","Saves","Organic engagement rate","Profile visit rate","Profile-to-follow conversion rate"],video:["Organic watch time","Average retention","Skip rate","Shares"]};
 if(sets[v]){const arr=S.organic[S.scope],pick=arr.filter(m=>sets[v].includes(m.name));arr.forEach(m=>{m.selected=sets[v].includes(m.name);m.weight=m.selected?Math.round(100/pick.length):0});rebalance(arr)}
 if(v==="paid"){S.objective="sales";$("campaignObjective").value="sales"}
 gradeRender()};
$("saveFormula").onclick=()=>{
 const bad=[[S.organic.account,"account"],[S.organic.post,"post"],...Object.entries(S.paid).map(([k,a])=>[a,k])].filter(([a])=>{const s=a.filter(m=>m.selected);return s.length&&sum(s.map(m=>m.weight))!==100}).map(x=>x[1]);
 if(bad.length){$("saveStatus").textContent="Balance each selected scorecard to 100% before saving: "+bad.join(", ")+" formula.";return}
 const v={version:Math.max(...history.map(h=>h.version))+1,name:S.name,savedAt:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),effectiveFrom:$("effectiveFrom").value,settings:clone(S)};
 history.push(v);const ok=store.set(HKEY,history),g=MONTHS.filter(m=>versionFor(m)===v);
 $("saveStatus").textContent=`Saved as v${v.version}, effective from ${v.effectiveFrom}. `+(g.length?`It now grades ${g.map(short).join(", ")} across every page.`:"No reported month uses it yet, so past grades are unchanged.")+(ok?"":" (Browser storage is blocked, so the history lasts until you close the page.)");
 gradeRender()};
$("loadFormula").onclick=()=>{const h=history.at(-1);S=clone(h.settings);syncControls();$("gradeBasis").value="draft";gradeRender();$("saveStatus").textContent=`Loaded the latest saved version (v${h.version}).`};
$("resetFormula").onclick=()=>{S=defaultSettings();syncControls();gradeRender();$("saveStatus").textContent="Editor reset to the demo default. Saved versions are unchanged."};

/* ---------- navigation & global controls ---------- */
const PAGES={
 overview:{title:"Portfolio Overview",sub:"A consolidated view across all brands: KPIs, comparison, ranking and management alerts.",render:pageOverview},
 brand:{title:"Brand Overview",sub:"One brand at a glance: KPIs, reach, grades over time, best and weakest content.",render:pageBrand},
 organic:{title:"Organic Performance",sub:"What the account earns without paid distribution.",render:pageOrganic},
 paid:{title:"Paid Performance",sub:"Paid delivery, cost and campaign results in USD, graded by objective.",render:pagePaid},
 content:{title:"Individual Post Performance",eyebrow:"CONTENT ANALYSIS / POST DIAGNOSIS",sub:"Understand what each post earned organically and what advertising added."},
 audience:{title:"Audience Analysis",sub:"Growth, profile conversion and aggregated audience insights.",render:pageAudience},
 campaigns:{title:"Content & Campaigns",sub:"Publishing calendar, plan adherence, content pillars and campaigns.",render:pageCampaigns},
 competitors:{title:"Competitor Intelligence",sub:"Public benchmarks only. Private competitor spend, reach and conversions are not assumed.",render:pageCompetitors},
 ai:{title:"AI Intelligence",sub:"Evidence-linked findings and recommendations you can accept, assign and evaluate.",render:pageAI},
 management:{title:"Management & Reports",sub:"Budget pacing, objectives, tasks and reports.",render:pageManagement},
 grading:{title:"Targets & Grading",eyebrow:"PERFORMANCE EVALUATION",sub:"Configure account and post formulas, targets and grading profiles."}
};
$("gBrand").innerHTML=[ALL,...BRANDS].map(b=>`<option>${esc(b)}</option>`).join("");
$("gPeriod").innerHTML=[...MONTHS].reverse().map(m=>`<option>${m}</option>`).join("");
function syncGlobal(){$("gBrand").value=STATE.brand;$("gPeriod").value=STATE.period}
function activateMainPage(page){
 STATE.page=page;CHARTS=[];$("tip").classList.add("hidden");
 document.querySelectorAll("#mainNav button").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 const isContent=page==="content",isGrade=page==="grading",meta=PAGES[page];
 ["postFilters","listView","detailView","gradeView","moduleView","pageView"].forEach(id=>$(id).classList.add("hidden"));
 $("contentTabs").classList.toggle("hidden",!(isContent||isGrade));
 $("gradeTab").classList.toggle("active",isGrade);$("listTab").classList.toggle("active",isContent);$("detailTab").classList.remove("active");$("detailTab").disabled=true;
 if(isContent){$("postFilters").classList.remove("hidden");$("listView").classList.remove("hidden");render()}
 else if(isGrade){$("gradeView").classList.remove("hidden");gradeRender()}
 else{$("pageView").innerHTML=meta.render();$("pageView").classList.remove("hidden")}
 const top=document.querySelector(".top");top.querySelector(".muted").textContent=meta.eyebrow||"MARKETING INTELLIGENCE";top.querySelector(".title").textContent=meta.title;top.querySelector(".muted:not([style])").textContent=meta.sub;
 $("gbNote").textContent=`${STATE.brand===ALL?"All brands":STATE.brand} · ${STATE.period} · compared with ${prevP(STATE.period)?short(prevP(STATE.period)):"no previous month"} · synthetic data`;
 syncGlobal();
}
$("mainNav").addEventListener("click",e=>{const b=e.target.closest("button[data-page]");if(b){activateMainPage(b.dataset.page);window.scrollTo(0,0)}});
$("gBrand").onchange=()=>{STATE.brand=$("gBrand").value;openCampaign=null;activateMainPage(STATE.page==="overview"&&STATE.brand!==ALL?"brand":STATE.page)};
$("gPeriod").onchange=()=>{STATE.period=$("gPeriod").value;openCampaign=null;activateMainPage(STATE.page)};
$("gradeTab").onclick=()=>activateMainPage("grading");
$("listTab").onclick=()=>activateMainPage("content");
document.addEventListener("click",e=>{
 const t=e.target.closest("[data-setbrand],[data-gobrand],[data-go],[data-post],[data-campgo],[data-rec]");if(!t)return;
 if(t.closest("#rows"))return;
 if(t.dataset.rec){setRec(t.dataset.rec,t.dataset.to);activateMainPage(STATE.page);return}
 if(t.dataset.post){const p=postById(t.dataset.post);if(!p)return;STATE.period=p.period;if(STATE.brand!==ALL)STATE.brand=p.brand;activateMainPage("content");openPost(p.id);return}
 if(t.dataset.campgo){const c=CAMPAIGNS.find(x=>x.id===t.dataset.campgo);STATE.brand=c.brand;STATE.period=c.period;openCampaign=c.id;activateMainPage("grading");setTimeout(()=>document.querySelector(`#campaignTable tr[data-camp="${c.id}"]`)?.scrollIntoView({block:"center"}),0);return}
 if(t.dataset.setbrand){STATE.brand=t.dataset.setbrand;openCampaign=null;activateMainPage(STATE.page);if(STATE.page==="grading")window.scrollTo(0,0);return}
 if(t.dataset.gobrand){STATE.brand=t.dataset.gobrand;activateMainPage("brand");window.scrollTo(0,0);return}
 if(t.dataset.go){if(t.dataset.brand)STATE.brand=t.dataset.brand;activateMainPage(t.dataset.go);window.scrollTo(0,0)}
});
syncControls();
activateMainPage("overview");
