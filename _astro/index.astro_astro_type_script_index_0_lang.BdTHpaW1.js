import{t as e}from"./site-config.BegNMtY8.js";import{t}from"./draft-format.CLABUIXs.js";var n=document.getElementById(`board`),r={current:`🟡`,waiting:`⚪`,approved:`✅`,rejected:`⛔`,notified:`📨`,skipped:`⏭️`};function i(e,t){let n=(t?new Date(t).getTime():Date.now())-new Date(e).getTime(),r=Math.floor(n/6e4);return r<60?`${r} 分`:`${Math.floor(r/60)} 時 ${r%60} 分`}async function a(){try{let{cases:a}=await(await fetch(`${e.workerBase}/approval/board`)).json();if(!a?.length){n.innerHTML=`<p class="muted">（還沒有送簽案件——到公關智慧助手把版本送簽）</p>`;return}let o=new Set([...n.querySelectorAll(`details[open]`)].map(e=>e.dataset.id));n.innerHTML=a.map(e=>{let n=e.cpc_case_steps.filter(e=>e.kind===`sign`).sort((e,t)=>e.step_no-t.step_no),a=e.cpc_case_steps.filter(e=>e.kind===`notify`),s=``;if(e.status===`approved`&&e.cpc_versions.content){let n=t(e.cpc_versions.content),r=n.structured?[n.title&&`<h3 class="doc-title">${n.title}</h3>`,...n.body.map(e=>`<p>${e}</p>`),n.quote&&`<blockquote>${n.quote}</blockquote>`,n.signature&&`<p class="doc-sign">${n.signature}</p>`].filter(Boolean).join(``):e.cpc_versions.content.split(/\n+/).map(e=>`<p>${e.trim()}</p>`).join(``);s=`<details data-id="${e.id}" ${o.has(e.id)?`open`:``}>
              <summary>📄 查看決行全文</summary>
              <div class="doc">${r}</div>
            </details>`}return`<article class="case ${e.status}">
            <header>
              <strong>${e.cpc_versions.title}</strong> <span class="muted">v${e.cpc_versions.version_no}｜${e.cpc_templates.name}</span>
              <span class="stay">${e.status===`in_progress`?`⏱ 在流程 ${i(e.created_at)}`:e.status===`approved`?`✅ 已決行`:`⛔ 已退回`}</span>
            </header>
            <div class="chain">${n.map(e=>`<span class="node ${e.status}" title="${e.comment||``}">${r[e.status]||``} ${e.cpc_positions.title}</span>`).join(`<span class="arrow">→</span>`)}</div>
            ${a.length?`<div class="notifies muted">知會：${a.map(e=>`📨 ${e.cpc_positions.title}`).join(`、`)}</div>`:``}
            ${s}
          </article>`}).join(``)}catch{n.innerHTML=`<p class="muted">戰情表載入失敗（後端未設定或網路問題）</p>`}}a(),setInterval(a,1e4);