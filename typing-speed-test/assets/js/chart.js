/**
 * Typing Speed Test - Pure Canvas & SVG Chart Renderer (Zero External Dependencies)
 * Draws smooth WPM progression charts, error markers, and exports shareable result cards to PNG.
 * Namespace: window.TypeApp.Chart
 */

window.TypeApp = window.TypeApp || {};

(function() {
  const Chart = {
    /**
     * Render WPM progression chart onto an HTML5 <canvas> element
     */
    renderWpmChart(canvas, timeline = []) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle high-DPI retina displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 800;
      const height = rect.height || 220;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      if (!timeline || timeline.length === 0) {
        ctx.fillStyle = '#888';
        ctx.font = '14px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No timeline data available for this run', width / 2, height / 2);
        return;
      }

      const padding = { top: 25, right: 30, bottom: 35, left: 45 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      // Compute data ranges
      const wpms = timeline.map(t => t.wpm);
      const rawWpms = timeline.map(t => t.rawWpm || t.wpm);
      const maxWpmData = Math.max(...wpms, ...rawWpms, 30);
      const maxY = Math.ceil(maxWpmData / 20) * 20; // Round up to nearest 20
      const minY = 0;
      const totalSeconds = Math.max(timeline.length, 1);

      const getX = (sec) => padding.left + ((sec - 1) / Math.max(1, totalSeconds - 1)) * chartW;
      const getY = (val) => padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;

      // Detect theme colors
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';
      const textColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#bb9af7';
      const errorColor = '#f7768e';

      // 1. Draw Horizontal Gridlines & Y-Axis Labels
      ctx.font = '11px ui-monospace, Consolas, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const yStep = maxY <= 60 ? 15 : maxY <= 120 ? 30 : 40;

      for (let yVal = minY; yVal <= maxY; yVal += yStep) {
        const yPos = getY(yVal);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, yPos);
        ctx.lineTo(padding.left + chartW, yPos);
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.fillText(yVal + ' wpm', padding.left - 8, yPos);
      }

      // 2. Draw X-Axis Labels (Time)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const xStep = Math.max(1, Math.ceil(totalSeconds / 6));
      for (let i = 1; i <= totalSeconds; i += xStep) {
        const xPos = getX(i);
        ctx.fillStyle = textColor;
        ctx.fillText(i + 's', xPos, padding.top + chartH + 8);
      }

      // 3. Draw Average WPM dashed line
      const avgWpm = Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length);
      const avgY = getY(avgWpm);
      ctx.save();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(padding.left, avgY);
      ctx.lineTo(padding.left + chartW, avgY);
      ctx.stroke();
      ctx.restore();

      // 4. Draw Raw WPM (Lighter, subtle line)
      if (rawWpms.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        timeline.forEach((pt, idx) => {
          const x = getX(pt.second);
          const y = getY(pt.rawWpm || pt.wpm);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // 5. Draw Filled Gradient Area under Net WPM
      if (timeline.length > 1) {
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, primaryColor + '55'); // 33% opacity
        grad.addColorStop(1, primaryColor + '00'); // 0% opacity

        ctx.beginPath();
        timeline.forEach((pt, idx) => {
          const x = getX(pt.second);
          const y = getY(pt.wpm);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.lineTo(getX(timeline[timeline.length - 1].second), padding.top + chartH);
        ctx.lineTo(getX(1), padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // 6. Draw Net WPM Main Solid Line
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      timeline.forEach((pt, idx) => {
        const x = getX(pt.second);
        const y = getY(pt.wpm);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // 7. Draw Error markers (Red dots)
      timeline.forEach(pt => {
        if (pt.errors && pt.errors > 0) {
          const x = getX(pt.second);
          const y = getY(pt.wpm);
          
          // Outer error pulse
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(247, 118, 142, 0.35)';
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = errorColor;
          ctx.fill();

          // Cross mark or indicator
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    },

    /**
     * Generate and download a high-resolution PNG result card
     */
    downloadResultCard(result) {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 480;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background Card
      ctx.fillStyle = '#16161e';
      ctx.fillRect(0, 0, width, height);

      // Border and card styling
      ctx.strokeStyle = '#24283b';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Accent gradient header strip
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, '#bb9af7');
      grad.addColorStop(1, '#7aa2f7');
      ctx.fillStyle = grad;
      ctx.fillRect(10, 10, width - 20, 6);

      // Logo and Title
      ctx.fillStyle = '#c0caf5';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('TYPEPULSE SPEED TEST', 45, 55);

      ctx.fillStyle = '#565f89';
      ctx.font = '14px ui-monospace, Consolas, monospace';
      const dateStr = new Date(result.timestamp || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      ctx.fillText(`Date: ${dateStr} | Mode: ${result.mode} ${result.subMode || ''}`, 45, 80);

      // Big Net WPM
      ctx.fillStyle = '#bb9af7';
      ctx.font = 'bold 78px ui-monospace, Consolas, monospace';
      ctx.fillText(`${result.netWpm}`, 45, 175);

      ctx.fillStyle = '#7aa2f7';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('NET WPM', 45, 202);

      // Skill Label Badge
      ctx.fillStyle = 'rgba(187, 154, 247, 0.18)';
      ctx.beginPath();
      ctx.roundRect(45, 222, 140, 32, 6);
      ctx.fill();
      ctx.strokeStyle = '#bb9af7';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#bb9af7';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((result.skill || 'INTERMEDIATE').toUpperCase(), 115, 243);

      // Metrics Table on the Right
      ctx.textAlign = 'left';
      const metrics = [
        { label: 'Accuracy', val: `${result.accuracy}%` },
        { label: 'Raw WPM', val: `${result.rawWpm}` },
        { label: 'Consistency', val: `${result.consistency}%` },
        { label: 'Characters', val: `${result.characters ? `${result.characters.correct}/${result.characters.incorrect}/${result.characters.extra}` : '-'}` },
        { label: 'Test Time', val: `${result.durationSeconds}s` }
      ];

      const startX = 250;
      const startY = 130;
      const colW = 160;

      metrics.forEach((m, idx) => {
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        const x = startX + col * colW;
        const y = startY + row * 60;

        ctx.fillStyle = '#c0caf5';
        ctx.font = 'bold 24px ui-monospace, Consolas, monospace';
        ctx.fillText(m.val, x, y);

        ctx.fillStyle = '#565f89';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(m.label.toUpperCase(), x, y + 20);
      });

      // Chart Snapshot in Lower Half
      const miniChart = {
        x: 45,
        y: 290,
        w: width - 90,
        h: 130
      };

      ctx.fillStyle = '#1a1b26';
      ctx.fillRect(miniChart.x, miniChart.y, miniChart.w, miniChart.h);
      ctx.strokeStyle = '#24283b';
      ctx.strokeRect(miniChart.x, miniChart.y, miniChart.w, miniChart.h);

      if (result.timeline && result.timeline.length > 1) {
        const tLen = result.timeline.length;
        const maxVal = Math.max(...result.timeline.map(t => t.wpm), 30);
        
        ctx.strokeStyle = '#bb9af7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        result.timeline.forEach((pt, i) => {
          const px = miniChart.x + 10 + (i / (tLen - 1)) * (miniChart.w - 20);
          const py = miniChart.y + miniChart.h - 10 - (pt.wpm / maxVal) * (miniChart.h - 25);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      // Footer Watermark
      ctx.fillStyle = '#565f89';
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('100% Offline Typing Speed Test', width - 45, 455);

      // Download
      const link = document.createElement('a');
      link.download = `typing-result-${result.netWpm}wpm.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  window.TypeApp.Chart = Chart;
})();
