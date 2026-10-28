/**
 * WebDev Academy - Offline Interactive Try-It Editor Engine
 * Runs completely locally using sandboxed iframe srcdoc with console capturing.
 */
(function(window) {
  'use strict';

  const Editor = {
    init: function() {
      const editors = document.querySelectorAll('.try-editor-container');
      editors.forEach(function(container, index) {
        Editor.setupContainer(container, index);
      });
    },

    setupContainer: function(container, id) {
      const textarea = container.querySelector('.try-code-textarea');
      const iframe = container.querySelector('.try-preview-iframe');
      const runBtn = container.querySelector('.btn-run');
      const resetBtn = container.querySelector('.btn-reset');
      const consoleBar = container.querySelector('.try-console-bar');

      if (!textarea || !iframe) return;

      // Save initial code for Reset button
      const initialCode = textarea.value;

      // Tab key support in textarea
      textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 2;
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          Editor.runCode(textarea.value, iframe, consoleBar);
        }
      });

      if (runBtn) {
        runBtn.addEventListener('click', function() {
          Editor.runCode(textarea.value, iframe, consoleBar);
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          textarea.value = initialCode;
          Editor.runCode(initialCode, iframe, consoleBar);
        });
      }

      // Initial run on page load
      Editor.runCode(textarea.value, iframe, consoleBar);
    },

    runCode: function(userCode, iframe, consoleBar) {
      if (consoleBar) {
        consoleBar.innerHTML = '';
        consoleBar.classList.remove('has-logs');
      }

      // Console capturing harness injected into iframe
      const consoleScript = `
        <script>
          (function() {
            var oldLog = console.log;
            var oldErr = console.error;
            var oldWarn = console.warn;
            window.parentLogs = [];

            function send(type, args) {
              var str = Array.prototype.slice.call(args).map(function(item) {
                if (typeof item === 'object') {
                  try { return JSON.stringify(item); } catch(e) { return String(item); }
                }
                return String(item);
              }).join(' ');
              window.parent.postMessage({ type: 'CONSOLE_LOG', level: type, msg: str }, '*');
            }

            console.log = function() { send('log', arguments); if(oldLog) oldLog.apply(console, arguments); };
            console.error = function() { send('error', arguments); if(oldErr) oldErr.apply(console, arguments); };
            console.warn = function() { send('warn', arguments); if(oldWarn) oldWarn.apply(console, arguments); };

            window.onerror = function(msg, url, line) {
              send('error', ['Uncaught Error: ' + msg + ' (Line ' + line + ')']);
              return false;
            };
          })();
        <\/script>
      `;

      // Determine if code has HTML boilerplate, if not wrap with clean default styling
      let fullHtml = userCode;
      if (!/<html/i.test(userCode)) {
        fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 1rem;
      margin: 0;
      color: #1e293b;
      line-height: 1.5;
    }
  </style>
  ${consoleScript}
</head>
<body>
${userCode}
</body>
</html>`;
      } else {
        // Inject console harness into existing head
        if (fullHtml.includes('<head>')) {
          fullHtml = fullHtml.replace('<head>', '<head>' + consoleScript);
        } else {
          fullHtml = consoleScript + fullHtml;
        }
      }

      // Set srcdoc
      iframe.srcdoc = fullHtml;
    }
  };

  // Listen for console logs posted from child iframes
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'CONSOLE_LOG') {
      const activeConsoles = document.querySelectorAll('.try-console-bar');
      // If there's an active or corresponding console bar, append message
      activeConsoles.forEach(function(c) {
        const line = document.createElement('div');
        line.style.color = event.data.level === 'error' ? '#f87171' : event.data.level === 'warn' ? '#fbbf24' : '#67e8f9';
        line.textContent = `> [${event.data.level}] ${event.data.msg}`;
        c.appendChild(line);
        c.classList.add('has-logs');
      });
    }
  });

  window.Editor = Editor;
})(window);
