document.addEventListener('DOMContentLoaded', () => {
  const overview = document.getElementById('tab-overview');
  if (!overview) return;
  const wrap = overview.querySelector('.chart-wrap');
  if (!wrap) return;

  const byCanvas = id => document.getElementById(id)?.closest('.chart-box');
  const timeline = byCanvas('c-timeline');
  const daily = byCanvas('c-daily');
  const distrib = byCanvas('c-distrib');
  const hourly = byCanvas('c-hourly');
  const exceed = byCanvas('c-exceed');
  const minmax = byCanvas('c-minmax');
  if (!timeline || !daily || !distrib || !hourly || !exceed || !minmax) return;

  wrap.innerHTML = '';

  const makeSection = (title, sub, className='') => {
    const section = document.createElement('section');
    section.className = `evidence-section ${className}`.trim();
    const head = document.createElement('div');
    head.className = 'evidence-section-head';
    head.innerHTML = `<div><div class="evidence-kicker">${title}</div><div class="evidence-sub">${sub}</div></div>`;
    section.appendChild(head);
    return section;
  };

  const history = makeSection('Humidity History', 'Severity and persistence across the full monitoring period', 'evidence-primary');
  const hero = document.createElement('div');
  hero.className = 'evidence-hero-chart';
  hero.appendChild(timeline);
  history.appendChild(hero);

  const exposure = document.createElement('div');
  exposure.className = 'evidence-two-col';
  exposure.appendChild(daily);
  exposure.appendChild(exceed);
  history.appendChild(exposure);
  wrap.appendChild(history);

  const pattern = makeSection('Exposure Pattern', 'Supporting views showing daily range, time-of-day pattern, and risk distribution');
  const wide = document.createElement('div');
  wide.className = 'evidence-wide-chart';
  wide.appendChild(minmax);
  pattern.appendChild(wide);
  const supporting = document.createElement('div');
  supporting.className = 'evidence-two-col evidence-supporting';
  supporting.appendChild(hourly);
  supporting.appendChild(distrib);
  pattern.appendChild(supporting);
  wrap.appendChild(pattern);

  // Make chart titles more evidence-oriented without changing chart data.
  const rename = (box, title, note) => {
    const t = box.querySelector('.chart-title');
    const n = box.querySelector('.chart-note');
    if (t) t.textContent = title;
    if (n && note) n.textContent = note;
  };
  rename(timeline, 'Humidity Exposure Over Time', '60% safe threshold shown as reference');
  rename(daily, 'Daily Average Humidity', 'Shows whether elevated moisture persisted day to day');
  rename(exceed, 'Time Above Risk Thresholds', 'Share of readings at or above each humidity threshold');
  rename(minmax, 'Daily Humidity Range', 'Minimum, average, and maximum by day');
  rename(hourly, 'Humidity by Time of Day', 'Average 24-hour exposure pattern');
  rename(distrib, 'Readings by Risk Zone', 'Distribution of all recorded readings');
});
