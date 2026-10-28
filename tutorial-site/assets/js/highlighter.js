/**
 * WebDev Academy - Lightweight Zero-Dependency Syntax Highlighter
 * Handcrafted pure vanilla JS tokenizer for HTML, CSS, and JavaScript.
 */
(function(window) {
  'use strict';

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const Highlighter = {
    highlightHtml: function(code) {
      // Step 1: Tokenize comments and doctype
      const placeholders = [];
      let temp = code.replace(/<!--[\s\S]*?-->/g, function(match) {
        placeholders.push('<span class="tok-comm">' + escapeHtml(match) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      temp = temp.replace(/<!DOCTYPE[^>]*>/gi, function(match) {
        placeholders.push('<span class="tok-tag">' + escapeHtml(match) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Step 2: Highlight HTML tags, attributes, and values
      temp = temp.replace(/(<\/?[a-zA-Z0-9\-]+)([^>]*?)(\/?>)/g, function(_, openTag, attrs, closeBracket) {
        const highlightedAttrs = attrs.replace(/([a-zA-Z\-:@]+)(?:=(["'][^"']*?["']|[^\s>]+))?/g, function(__, attrName, attrVal) {
          let res = '<span class="tok-attr">' + escapeHtml(attrName) + '</span>';
          if (attrVal) {
            res += '<span class="tok-punct">=</span><span class="tok-val">' + escapeHtml(attrVal) + '</span>';
          }
          return res;
        });
        return '<span class="tok-tag">' + escapeHtml(openTag) + '</span>' +
               highlightedAttrs +
               '<span class="tok-tag">' + escapeHtml(closeBracket) + '</span>';
      });

      // Step 3: Restore placeholders and escape regular text
      // Any text remaining outside tags must be escaped
      let out = '';
      const parts = temp.split(/(___TOK_\d+___)/);
      for (let i = 0; i < parts.length; i++) {
        const m = parts[i].match(/___TOK_(\d+)___/);
        if (m) {
          out += placeholders[parseInt(m[1], 10)];
        } else {
          // If part already contains span tokens, preserve them, otherwise escape
          out += parts[i];
        }
      }

      return out;
    },

    highlightCss: function(code) {
      const placeholders = [];
      // Comments
      let temp = code.replace(/\/\*[\s\S]*?\*\//g, function(m) {
        placeholders.push('<span class="tok-comm">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Strings
      temp = temp.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function(m) {
        placeholders.push('<span class="tok-str">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Rule blocks: selector { declarations }
      temp = temp.replace(/([^{}]+)\{([^}]+)\}/g, function(_, sel, body) {
        const styledSel = '<span class="tok-sel">' + escapeHtml(sel.trim()) + '</span>';
        const styledBody = body.replace(/([a-zA-Z\-]+)\s*:\s*([^;]+);?/g, function(__, prop, val) {
          // Highlight units / numbers / colors inside values
          const styledVal = escapeHtml(val).replace(/(#[0-9a-fA-F]{3,8}|\b\d+(\.\d+)?(px|rem|em|%|vh|vw|s|ms|deg|fr)?\b)/g, '<span class="tok-num">$1</span>');
          return '<span class="tok-prop">' + escapeHtml(prop) + '</span>: ' + styledVal + ';';
        });
        return styledSel + ' {\n  ' + styledBody.trim() + '\n}';
      });

      // Restore placeholders
      const parts = temp.split(/(___TOK_\d+___)/);
      let out = '';
      for (let i = 0; i < parts.length; i++) {
        const m = parts[i].match(/___TOK_(\d+)___/);
        if (m) {
          out += placeholders[parseInt(m[1], 10)];
        } else {
          out += parts[i];
        }
      }
      return out;
    },

    highlightJs: function(code) {
      const placeholders = [];

      // Strings (single, double, template literals)
      let temp = code.replace(/(`[\s\S]*?`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, function(m) {
        placeholders.push('<span class="tok-str">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Comments
      temp = temp.replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, function(m) {
        placeholders.push('<span class="tok-comm">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Escape raw text
      temp = escapeHtml(temp);

      // Keywords
      const kwRegex = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|class|extends|super|import|export|default|new|this|typeof|instanceof|async|await|yield|in|of)\b/g;
      temp = temp.replace(kwRegex, '<span class="tok-kw">$1</span>');

      // Booleans & Null
      temp = temp.replace(/\b(true|false|null|undefined|NaN)\b/g, '<span class="tok-bool">$1</span>');

      // Numbers
      temp = temp.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-num">$1</span>');

      // Function calls
      temp = temp.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, '<span class="tok-fn">$1</span>');

      // Restore placeholders
      const parts = temp.split(/(___TOK_\d+___)/);
      let out = '';
      for (let i = 0; i < parts.length; i++) {
        const m = parts[i].match(/___TOK_(\d+)___/);
        if (m) {
          out += placeholders[parseInt(m[1], 10)];
        } else {
          out += parts[i];
        }
      }
      return out;
    },

    highlightPython: function(code) {
      const placeholders = [];

      // Triple quoted strings
      let temp = code.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, function(m) {
        placeholders.push('<span class="tok-str">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Single/double quoted strings (with optional f/r prefix)
      temp = temp.replace(/\b[frFR]?("(\\.|[^"\\])*"|'(\\.|[^'\\])*')/g, function(m) {
        placeholders.push('<span class="tok-str">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Comments (#)
      temp = temp.replace(/(#.*$)/gm, function(m) {
        placeholders.push('<span class="tok-comm">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      temp = escapeHtml(temp);

      // Decorators (@something)
      temp = temp.replace(/(@[a-zA-Z_]\w*)/g, '<span class="tok-prop">$1</span>');

      // Keywords
      const kwRegex = /\b(def|class|return|if|elif|else|for|while|try|except|finally|raise|import|from|as|with|yield|lambda|pass|break|continue|global|nonlocal|async|await|match|case|in|is|not|and|or)\b/g;
      temp = temp.replace(kwRegex, '<span class="tok-kw">$1</span>');

      // Booleans & None
      temp = temp.replace(/\b(True|False|None)\b/g, '<span class="tok-bool">$1</span>');

      // Numbers
      temp = temp.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-num">$1</span>');

      // Function calls
      temp = temp.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="tok-fn">$1</span>');

      // Restore placeholders
      const parts = temp.split(/(___TOK_\d+___)/);
      let out = '';
      for (let i = 0; i < parts.length; i++) {
        const m = parts[i].match(/___TOK_(\d+)___/);
        if (m) {
          out += placeholders[parseInt(m[1], 10)];
        } else {
          out += parts[i];
        }
      }
      return out;
    },

    highlightJava: function(code) {
      const placeholders = [];

      // Strings & chars
      let temp = code.replace(/("(\\.|[^"\\])*"|'(\\.|[^'\\])*')/g, function(m) {
        placeholders.push('<span class="tok-str">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Comments
      temp = temp.replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, function(m) {
        placeholders.push('<span class="tok-comm">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      temp = escapeHtml(temp);

      // Annotations (@RestController, @Autowired, etc.)
      temp = temp.replace(/(@[a-zA-Z_]\w*)/g, '<span class="tok-prop">$1</span>');

      // Keywords & Types
      const kwRegex = /\b(public|private|protected|class|interface|enum|extends|implements|static|final|abstract|void|int|double|float|long|short|byte|char|boolean|var|new|return|if|else|switch|case|default|break|continue|for|while|do|try|catch|finally|throw|throws|package|import|this|super|synchronized|volatile|transient|instanceof|record|sealed|permits)\b/g;
      temp = temp.replace(kwRegex, '<span class="tok-kw">$1</span>');

      // Booleans & Null
      temp = temp.replace(/\b(true|false|null)\b/g, '<span class="tok-bool">$1</span>');

      // Numbers
      temp = temp.replace(/\b(\d+(\.\d+)?[fFdDlL]?)\b/g, '<span class="tok-num">$1</span>');

      // Method calls
      temp = temp.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, '<span class="tok-fn">$1</span>');

      // Restore placeholders
      const parts = temp.split(/(___TOK_\d+___)/);
      let out = '';
      for (let i = 0; i < parts.length; i++) {
        const m = parts[i].match(/___TOK_(\d+)___/);
        if (m) {
          out += placeholders[parseInt(m[1], 10)];
        } else {
          out += parts[i];
        }
      }
      return out;
    },

    highlightSql: function(code) {
      const placeholders = [];

      // Strings
      let temp = code.replace(/('(\\.|[^'\\])*'|"(\\.|[^"\\])*")/g, function(m) {
        placeholders.push('<span class="tok-str">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      // Comments
      temp = temp.replace(/(\/\*[\s\S]*?\*\/|--.*$)/gm, function(m) {
        placeholders.push('<span class="tok-comm">' + escapeHtml(m) + '</span>');
        return '___TOK_' + (placeholders.length - 1) + '___';
      });

      temp = escapeHtml(temp);

      // SQL Keywords
      const kwRegex = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|TRUNCATE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|ON|GROUP|BY|HAVING|ORDER|ASC|DESC|LIMIT|OFFSET|UNION|ALL|AS|DISTINCT|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|CHECK|UNIQUE|INDEX|VIEW|WITH|OVER|PARTITION|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|EXISTS|COMMIT|ROLLBACK|BEGIN|TRANSACTION|CONSTRAINT|CASCADE|DATABASE|SCHEMA|USE)\b/gi;
      temp = temp.replace(kwRegex, function(m) {
        return '<span class="tok-kw">' + m.toUpperCase() + '</span>';
      });

      // Aggregate / Math Functions
      temp = temp.replace(/\b(COUNT|SUM|AVG|MIN|MAX|COALESCE|CONCAT|NOW|CURRENT_DATE|ROUND|ABS|LENGTH|UPPER|LOWER)(?=\s*\()/gi, function(m) {
        return '<span class="tok-fn">' + m.toUpperCase() + '</span>';
      });

      // Numbers
      temp = temp.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-num">$1</span>');

      // Restore placeholders
      const parts = temp.split(/(___TOK_\d+___)/);
      let out = '';
      for (let i = 0; i < parts.length; i++) {
        const m = parts[i].match(/___TOK_(\d+)___/);
        if (m) {
          out += placeholders[parseInt(m[1], 10)];
        } else {
          out += parts[i];
        }
      }
      return out;
    },

    highlight: function(code, lang) {
      const l = (lang || '').toLowerCase();
      if (l === 'html' || l === 'markup') {
        return this.highlightHtml(code);
      } else if (l === 'css') {
        return this.highlightCss(code);
      } else if (l === 'js' || l === 'javascript') {
        return this.highlightJs(code);
      } else if (l === 'python' || l === 'py') {
        return this.highlightPython(code);
      } else if (l === 'java') {
        return this.highlightJava(code);
      } else if (l === 'sql') {
        return this.highlightSql(code);
      }
      return escapeHtml(code);
    },

    highlightAll: function() {
      const codeBlocks = document.querySelectorAll('pre code[data-lang]');
      codeBlocks.forEach(function(block) {
        const lang = block.getAttribute('data-lang');
        const raw = block.textContent;
        block.innerHTML = Highlighter.highlight(raw, lang);

        // Add copy button if parent code-header exists
        const wrapper = block.closest('.code-block-wrapper');
        if (wrapper && !wrapper.querySelector('.copy-btn')) {
          const header = wrapper.querySelector('.code-header');
          if (header) {
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.type = 'button';
            btn.textContent = 'Copy Code';
            btn.onclick = function() {
              navigator.clipboard.writeText(raw).then(function() {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(function() {
                  btn.textContent = 'Copy Code';
                  btn.classList.remove('copied');
                }, 2000);
              });
            };
            header.appendChild(btn);
          }
        }
      });
    }
  };

  window.Highlighter = Highlighter;
})(window);
