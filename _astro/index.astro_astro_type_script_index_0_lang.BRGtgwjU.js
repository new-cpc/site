import{t as e}from"./site-config.BegNMtY8.js";import{t}from"./draft-format.CLABUIXs.js";var n=document.getElementById(`board`),r=new Map;function i(e){let n=t(e);return n.structured?[n.title,...n.body,n.quote&&`「${n.quote}」`,n.signature].filter(Boolean).join(`

`):e}n.addEventListener(`click`,async e=>{let t=e.target.closest(`button.copy-doc`);if(!t)return;let n=r.get(t.dataset.id)||``;try{await navigator.clipboard.writeText(n),t.textContent=`✅ 已複製`}catch{t.textContent=`複製失敗（請長按選取）`}setTimeout(()=>t.textContent=`📋 複製全文`,2e3)});var a={current:`🟡`,waiting:`⚪`,approved:`✅`,rejected:`⛔`,notified:`📨`,skipped:`⏭️`};function o(e,t){let n=(t?new Date(t).getTime():Date.now())-new Date(e).getTime(),r=Math.floor(n/6e4);return r<60?`${r} 分`:`${Math.floor(r/60)} 時 ${r%60} 分`}async function s(){try{let{cases:s}=await(await fetch(`${e.workerBase}/approval/board`)).json();if(!s?.length){n.innerHTML=`<p class="muted">（還沒有送簽案件——到公關智慧助手把版本送簽）</p>`;return}let c=new Set([...n.querySelectorAll(`details[open]`)].map(e=>e.dataset.id));n.innerHTML=s.map(e=>{let n=e.cpc_case_steps.filter(e=>e.kind===`sign`).sort((e,t)=>e.step_no-t.step_no),s=e.cpc_case_steps.filter(e=>e.kind===`notify`),l=``;if(e.status===`approved`&&e.cpc_versions.content){let n=t(e.cpc_versions.content),a=n.structured?[n.title&&`<h3 class="doc-title">${n.title}</h3>`,...n.body.map(e=>`<p>${e}</p>`),n.quote&&`<blockquote>${n.quote}</blockquote>`,n.signature&&`<p class="doc-sign">${n.signature}</p>`].filter(Boolean).join(``):e.cpc_versions.content.split(/\n+/).map(e=>`<p>${e.trim()}</p>`).join(``),o=i(e.cpc_versions.content);r.set(e.id,o),l=`<details data-id="${e.id}" ${c.has(e.id)?`open`:``}>
              <summary>📄 查看決行全文</summary>
              <div class="doc">${a}</div>
              <div class="doc-actions">
                <button type="button" class="copy-doc" data-id="${e.id}">📋 複製全文</button>
                <a class="share-line" target="_blank" rel="noopener" href="https://line.me/R/share?text=${encodeURIComponent(o)}">📤 LINE 傳送</a>
              </div>
            </details>`}return`<article class="case ${e.status}">
            <header>
              <strong>${e.cpc_versions.title}</strong> <span class="muted">v${e.cpc_versions.version_no}｜${e.cpc_templates.name}</span>
              <span class="stay">${e.status===`in_progress`?`⏱ 在流程 ${o(e.created_at)}`:e.status===`approved`?`✅ 已決行`:`⛔ 已退回`}</span>
            </header>
            <div class="chain">${n.map(e=>`<span class="node ${e.status}" title="${e.comment||``}">${a[e.status]||``} ${e.cpc_positions.title}</span>`).join(`<span class="arrow">→</span>`)}</div>
            ${s.length?`<div class="notifies muted">知會：${s.map(e=>`📨 ${e.cpc_positions.title}`).join(`、`)}</div>`:``}
            ${l}
          </article>`}).join(``)}catch{n.innerHTML=`<p class="muted">戰情表載入失敗（後端未設定或網路問題）</p>`}}s(),setInterval(s,1e4);