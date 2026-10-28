/**
 * Typing Speed Test - Statistics, Analytics & Heatmap Manager
 * Aggregates history, draws charts, calculates streaks & goal rings, renders keyboard heatmap.
 * Namespace: window.TypeApp.Stats
 */

window.TypeApp = window.TypeApp || {};

(function() {
  const Stats = {
    init() {
      this.renderOverview();
      this.renderStreakAndGoals();
      this.renderPersonalBests();
      this.renderCharts();
      this.renderKeyboardHeatmap();
      this.renderWeakAnalysis();
      this.bindDataActions();
    },

    renderOverview() {
      const history = window.TypeApp.Storage ? window.TypeApp.Storage.getHistory() : [];
      const totalTestsEl = document.getElementById('stat-total-tests');
      const totalTimeEl = document.getElementById('stat-total-time');
      const avgWpmAllEl = document.getElementById('stat-avg-wpm-all');
      const avgWpm10El = document.getElementById('stat-avg-wpm-10');
      const avgAccEl = document.getElementById('stat-avg-acc');

      if (!history || history.length === 0) {
        if (totalTestsEl) totalTestsEl.textContent = '0';
        if (totalTimeEl) totalTimeEl.textContent = '0m';
        if (avgWpmAllEl) avgWpmAllEl.textContent = '0';
        if (avgWpm10El) avgWpm10El.textContent = '0';
        if (avgAccEl) avgAccEl.textContent = '0%';
        return;
      }

      const totalTests = history.length;
      const totalSeconds = history.reduce((sum, h) => sum + (h.durationSeconds || 0), 0);
      const totalMinutes = Math.round(totalSeconds / 60);

      const allWpmSum = history.reduce((sum, h) => sum + (h.netWpm || 0), 0);
      const avgWpmAll = Math.round(allWpmSum / totalTests);

      const last10 = history.slice(0, 10);
      const avgWpm10 = Math.round(last10.reduce((sum, h) => sum + (h.netWpm || 0), 0) / last10.length);

      const allAccSum = history.reduce((sum, h) => sum + (h.accuracy || 0), 0);
      const avgAcc = Math.round(allAccSum / totalTests);

      if (totalTestsEl) totalTestsEl.textContent = totalTests;
      if (totalTimeEl) totalTimeEl.textContent = totalMinutes >= 60 ? `${(totalMinutes / 60).toFixed(1)}h` : `${totalMinutes}m`;
      if (avgWpmAllEl) avgWpmAllEl.textContent = avgWpmAll;
      if (avgWpm10El) avgWpm10El.textContent = avgWpm10;
      if (avgAccEl) avgAccEl.textContent = `${avgAcc}%`;
    },

    renderStreakAndGoals() {
      const streakData = window.TypeApp.Storage ? window.TypeApp.Storage.getStreakData() : {};
      const settings = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : {};

      const currentStreakEl = document.getElementById('streak-days');
      const bestStreakEl = document.getElementById('best-streak-days');
      const todayTimeEl = document.getElementById('goal-today-time');
      const todayTestsEl = document.getElementById('goal-today-tests');

      if (currentStreakEl) currentStreakEl.textContent = `${streakData.currentStreak || 0} Days`;
      if (bestStreakEl) bestStreakEl.textContent = `${streakData.bestStreak || 0} Days`;

      const targetMinutes = settings.dailyGoalMinutes || 10;
      const actualMinutes = Math.round((streakData.todaySeconds || 0) / 60);

      if (todayTimeEl) todayTimeEl.textContent = `${actualMinutes} / ${targetMinutes} mins`;
      if (todayTestsEl) todayTestsEl.textContent = `${streakData.todayTests || 0} / ${settings.dailyGoalTests || 5} tests`;

      // Progress Ring SVG calculation
      const circle = document.getElementById('goal-progress-circle');
      if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const percent = Math.min(100, Math.round((actualMinutes / targetMinutes) * 100));
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
        
        const pctEl = document.getElementById('goal-pct-text');
        if (pctEl) pctEl.textContent = `${percent}%`;
      }
    },

    renderPersonalBests() {
      const pbTableBody = document.getElementById('pb-table-body');
      if (!pbTableBody) return;

      const pbs = window.TypeApp.Storage ? window.TypeApp.Storage.getPersonalBests() : {};
      pbTableBody.innerHTML = '';

      const keys = Object.keys(pbs);
      if (keys.length === 0) {
        pbTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No test records yet. Complete your first test!</td></tr>`;
        return;
      }

      keys.forEach(k => {
        const item = pbs[k];
        const dateStr = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight: 600; text-transform: capitalize;">${k.replace('_', ' ')}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">${item.wpm} WPM</td>
          <td style="font-family: var(--font-mono);">${item.accuracy}%</td>
          <td style="color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
        `;
        pbTableBody.appendChild(tr);
      });
    },

    renderCharts() {
      const history = window.TypeApp.Storage ? window.TypeApp.Storage.getHistory() : [];
      const canvas = document.getElementById('stats-history-chart');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 800;
      const height = rect.height || 260;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      if (history.length === 0) {
        ctx.fillStyle = '#777';
        ctx.font = '14px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Complete typing tests to see your WPM trend graph', width / 2, height / 2);
        return;
      }

      // Display chronological order (earliest to latest), max 30 tests
      const dataPoints = [...history].reverse().slice(-30);
      const padding = { top: 30, right: 30, bottom: 40, left: 50 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      const maxWpm = Math.max(...dataPoints.map(d => d.netWpm || 0), 40);
      const maxY = Math.ceil(maxWpm / 20) * 20;

      const getX = (idx) => padding.left + (idx / Math.max(1, dataPoints.length - 1)) * chartW;
      const getY = (val) => padding.top + chartH - (val / maxY) * chartH;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
      const textColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#bb9af7';

      // Gridlines & Y-axis
      ctx.font = '11px ui-monospace, Consolas, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (let y = 0; y <= maxY; y += (maxY <= 60 ? 15 : 30)) {
        const yPos = getY(y);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, yPos);
        ctx.lineTo(padding.left + chartW, yPos);
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.fillText(`${y} wpm`, padding.left - 8, yPos);
      }

      // Fill gradient under WPM curve
      if (dataPoints.length > 1) {
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, primaryColor + '55');
        grad.addColorStop(1, primaryColor + '00');

        ctx.beginPath();
        dataPoints.forEach((d, i) => {
          const x = getX(i);
          const y = getY(d.netWpm);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.lineTo(getX(dataPoints.length - 1), padding.top + chartH);
        ctx.lineTo(getX(0), padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Line Stroke
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      dataPoints.forEach((d, i) => {
        const x = getX(i);
        const y = getY(d.netWpm);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Data dots
      dataPoints.forEach((d, i) => {
        const x = getX(i);
        const y = getY(d.netWpm);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    },

    renderKeyboardHeatmap() {
      const container = document.getElementById('keyboard-heatmap');
      if (!container) return;

      const history = window.TypeApp.Storage ? window.TypeApp.Storage.getHistory() : [];
      // Aggregate all mistyped keys across all historical tests
      const keyErrors = {};
      let maxErrorCount = 1;

      history.forEach(h => {
        if (h.mistypedKeys) {
          Object.entries(h.mistypedKeys).forEach(([key, count]) => {
            const k = key.toLowerCase();
            keyErrors[k] = (keyErrors[k] || 0) + count;
            if (keyErrors[k] > maxErrorCount) maxErrorCount = keyErrors[k];
          });
        }
      });

      const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
        ['space']
      ];

      container.innerHTML = '';

      rows.forEach(rowKeys => {
        const rowEl = document.createElement('div');
        rowEl.className = 'kb-heat-row';

        rowKeys.forEach(k => {
          const keyEl = document.createElement('div');
          keyEl.className = `kb-heat-key ${k === 'space' ? 'kb-heat-space' : ''}`;

          const errs = keyErrors[k] || 0;
          const heatRatio = errs > 0 ? (errs / maxErrorCount) : 0;

          // Color scale: 0 (subtle green/surface) -> amber -> vivid red
          let heatBg = 'var(--bg-surface)';
          let borderColor = 'var(--border-color)';
          if (errs > 0) {
            if (heatRatio < 0.3) {
              heatBg = 'rgba(234, 179, 8, 0.2)'; // amber subtle
              borderColor = '#eab308';
            } else if (heatRatio < 0.7) {
              heatBg = 'rgba(249, 115, 22, 0.35)'; // orange
              borderColor = '#f97316';
            } else {
              heatBg = 'rgba(239, 68, 68, 0.55)'; // intense red
              borderColor = '#ef4444';
            }
          }

          keyEl.style.backgroundColor = heatBg;
          keyEl.style.borderColor = borderColor;

          keyEl.innerHTML = `
            <span class="kb-key-label">${k === 'space' ? 'Space' : k.toUpperCase()}</span>
            <span class="kb-key-count">${errs > 0 ? errs : ''}</span>
          `;
          rowEl.appendChild(keyEl);
        });

        container.appendChild(rowEl);
      });
    },

    renderWeakAnalysis() {
      const history = window.TypeApp.Storage ? window.TypeApp.Storage.getHistory() : [];
      const keyErrors = {};
      const wordErrors = {};

      history.forEach(h => {
        if (h.mistypedKeys) {
          Object.entries(h.mistypedKeys).forEach(([k, c]) => {
            keyErrors[k] = (keyErrors[k] || 0) + c;
          });
        }
        if (h.mistypedWords) {
          Object.entries(h.mistypedWords).forEach(([w, c]) => {
            wordErrors[w] = (wordErrors[w] || 0) + c;
          });
        }
      });

      const weakKeysList = document.getElementById('stats-weak-keys');
      if (weakKeysList) {
        weakKeysList.innerHTML = '';
        const sortedKeys = Object.entries(keyErrors).sort((a, b) => b[1] - a[1]);
        if (sortedKeys.length === 0) {
          weakKeysList.innerHTML = '<span style="color:var(--text-muted); font-size:0.9rem;">No error keys recorded yet. Excellent accuracy!</span>';
        } else {
          sortedKeys.slice(0, 10).forEach(([k, count]) => {
            const tag = document.createElement('span');
            tag.className = 'error-tag';
            tag.innerHTML = `${k === ' ' ? 'Space' : k} <span class="error-tag-count">${count}</span>`;
            weakKeysList.appendChild(tag);
          });
        }
      }

      // Bind "Practice Weak Keys" button
      const practiceBtn = document.getElementById('btn-practice-weak-keys');
      if (practiceBtn) {
        practiceBtn.addEventListener('click', () => {
          const sortedKeys = Object.entries(keyErrors).sort((a, b) => b[1] - a[1]).map(e => e[0]);
          if (sortedKeys.length === 0) {
            alert('No error keys found to practice! Keep typing normally.');
            return;
          }

          // Generate words containing these weak keys
          const topKeys = sortedKeys.slice(0, 4);
          const allWords = window.TypeApp.Words ? window.TypeApp.Words.getWordList('medium', 'english') : [];
          const targetedWords = allWords.filter(w => topKeys.some(k => w.includes(k)));
          const practiceTokens = [];
          for (let i = 0; i < 30; i++) {
            practiceTokens.push(targetedWords[Math.floor(Math.random() * targetedWords.length)] || topKeys[0]);
          }

          // Save custom text and redirect to index.html
          sessionStorage.setItem('tst_practice_text', practiceTokens.join(' '));
          window.location.href = '../index.html?practice=weak';
        });
      }
    },

    bindDataActions() {
      // Export JSON
      const exportBtn = document.getElementById('btn-export-json');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const data = window.TypeApp.Storage.exportAllData();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `typepulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      // Import JSON
      const importInput = document.getElementById('import-json-file');
      if (importInput) {
        importInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const parsed = JSON.parse(event.target.result);
              window.TypeApp.Storage.importAllData(parsed);
              alert('Data successfully imported!');
              window.location.reload();
            } catch (err) {
              alert('Error importing JSON: ' + err.message);
            }
          };
          reader.readAsText(file);
        });
      }

      // Clear all data
      const clearBtn = document.getElementById('btn-clear-data');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete ALL test history, streaks, and personal bests? This cannot be undone.')) {
            window.TypeApp.Storage.clearAllData();
            alert('All data has been cleared.');
            window.location.reload();
          }
        });
      }
    }
  };

  window.TypeApp.Stats = Stats;
  document.addEventListener('DOMContentLoaded', () => Stats.init());
})();
