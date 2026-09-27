// Evidence-first presentation layer for Room Map sensor panels.
// Wraps the existing renderer so sensor data/calculations remain the source of truth.
(function(){
  const pct=(n,d)=>d?((n/d)*100).toFixed(1):'0.0';
  const risk=(h)=>h>=80?['Critical','#ef4444']:h>=70?['Danger','#f97316']:h>=60?['Caution','#f59e0b']:['Safe','#10b981'];
  const dateTime=(r)=>{
    if(!r)return '—';
    if(r.date&&r.time)return `${r.date} · ${r.time}`;
    if(r.datetime){const d=new Date(r.datetime);if(!isNaN(d))return d.toLocaleString();}
    return '—';
  };
  function recordsFor(key){
    if(key==='1a') return (typeof getActiveData==='function'?getActiveData():(typeof DATA!=='undefined'?DATA:[]))||[];
    return (window.GEEVON_DATA&&window.GEEVON_DATA[key])||[];
  }
  function evidenceMarkup(key,records){
    if(!records.length)return '';
    const hums=records.map(r=>Number(r.humidity)).filter(Number.isFinite);
    if(!hums.length)return '';
    const latest=records[records.length-1];
    const current=Number(latest.humidity);
    const avg=(hums.reduce((a,b)=>a+b,0)/hums.length).toFixed(1);
    const peak=Math.max(...hums).toFixed(0);
    const over70=hums.filter(h=>h>=70).length, over80=hums.filter(h=>h>=80).length;
    const [status,statusColor]=risk(current);
    const location=key==='1a'?'Entry / hallway near front door':key==='g1'?'Master Bedroom':key==='g2'?'Living / Dining Room':'Second Bedroom';
    const source=key==='1a'?'ThermoPro TP358S':'Geevon sensor';
    const temp=Number.isFinite(Number(latest.temp))?Number(latest.temp).toFixed(1)+'°F':'—';
    const safe=hums.filter(h=>h<60).length, caution=hums.filter(h=>h>=60&&h<70).length, danger=hums.filter(h=>h>=70&&h<80).length, critical=over80;
    const distribution=[['Safe <60%',safe,'#10b981'],['Caution 60–69%',caution,'#f59e0b'],['Danger 70–79%',danger,'#f97316'],['Critical ≥80%',critical,'#ef4444']];
    return `<div class="sensor-evidence-shell">
      <div class="sensor-evidence-head"><div><div class="sensor-kicker">ROOM SENSOR · ${source}</div><h2>${key==='1a'?'Main Sensor 1A':key.toUpperCase()}</h2><p>${location}</p></div><div class="sensor-status" style="--risk:${statusColor}"><span></span>${status}</div></div>
      <section class="sensor-current"><div class="sensor-current-main"><div class="sensor-label">Current humidity</div><div class="sensor-current-value" style="color:${statusColor}">${Number.isFinite(current)?current.toFixed(1):'—'}%</div><div class="sensor-time">Latest reading · ${dateTime(latest)}</div></div><div class="sensor-current-side"><div><span>Temperature</span><strong>${temp}</strong></div><div><span>Location</span><strong>${location}</strong></div><div><span>Data source</span><strong>${source}</strong></div></div></section>
      <section><div class="sensor-section-title">Historical exposure</div><div class="sensor-metrics"><div><span>Average RH</span><strong>${avg}%</strong></div><div><span>Peak RH</span><strong>${peak}%</strong></div><div><span>Readings ≥70%</span><strong>${pct(over70,hums.length)}%</strong><small>${over70.toLocaleString()} readings</small></div><div><span>Readings ≥80%</span><strong>${pct(over80,hums.length)}%</strong><small>${over80.toLocaleString()} readings</small></div></div></section>
      <section><div class="sensor-section-title">Humidity risk distribution</div><div class="risk-stack">${distribution.map(([label,count,color])=>`<div class="risk-row"><div class="risk-row-head"><span>${label}</span><strong>${pct(count,hums.length)}%</strong></div><div class="risk-track"><i style="width:${pct(count,hums.length)}%;background:${color}"></i></div></div>`).join('')}</div></section>
      ${key==='1a'?`<section class="sensor-location-note"><strong>Heat-map anchor:</strong> Sensor 1A represents the entry/hallway area near the front door. ThermoPro readings originate from this location and are not projected onto other rooms without sensor-specific data.</section>`:''}
    </div>`;
  }
  const prior=window.showSensorData;
  if(typeof prior!=='function')return;
  window.showSensorData=function(key){
    prior(key);
    const panel=document.getElementById('sensor-'+key); if(!panel)return;
    const records=recordsFor(key); if(!records.length)return;
    const existing=panel.querySelector('.sensor-evidence-shell'); if(existing)existing.remove();
    const html=evidenceMarkup(key,records); if(!html)return;
    panel.insertAdjacentHTML('afterbegin',html);
    // Keep the existing readings table intact as supporting evidence, but visually secondary.
    const legacy=panel.querySelector('.sensor-evidence-shell + div');
    if(legacy){legacy.classList.add('sensor-legacy-detail');}
  };
})();