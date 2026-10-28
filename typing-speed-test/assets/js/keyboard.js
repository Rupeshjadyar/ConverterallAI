/**
 * Typing Speed Test - Virtual Keyboard & Hand Guidance System
 * Interactive QWERTY keyboard with color-coded fingers and SVG hand diagram.
 * Namespace: window.TypeApp.Keyboard
 */

window.TypeApp = window.TypeApp || {};

(function() {
  // Finger color mapping
  const FINGER_COLORS = {
    'lp': { name: 'Left Pinky', color: '#f43f5e' },
    'lr': { name: 'Left Ring', color: '#fb923c' },
    'lm': { name: 'Left Middle', color: '#eab308' },
    'li': { name: 'Left Index', color: '#22c55e' },
    'th': { name: 'Thumb', color: '#a855f7' },
    'ri': { name: 'Right Index', color: '#06b6d4' },
    'rm': { name: 'Right Middle', color: '#3b82f6' },
    'rr': { name: 'Right Ring', color: '#8b5cf6' },
    'rp': { name: 'Right Pinky', color: '#ec4899' }
  };

  // Key to finger lookup
  const KEY_FINGER_MAP = {
    '`': 'lp', '~': 'lp', '1': 'lp', '!': 'lp', 'q': 'lp', 'a': 'lp', 'z': 'lp', 'tab': 'lp', 'caps': 'lp', 'shiftleft': 'lp',
    '2': 'lr', '@': 'lr', 'w': 'lr', 's': 'lr', 'x': 'lr',
    '3': 'lm', '#': 'lm', 'e': 'lm', 'd': 'lm', 'c': 'lm',
    '4': 'li', '$': 'li', '5': 'li', '%': 'li', 'r': 'li', 't': 'li', 'f': 'li', 'g': 'li', 'v': 'li', 'b': 'li',
    ' ': 'th', 'space': 'th',
    '6': 'ri', '^': 'ri', '7': 'ri', '&': 'ri', 'y': 'ri', 'u': 'ri', 'h': 'ri', 'j': 'ri', 'n': 'ri', 'm': 'ri',
    '8': 'rm', '*': 'rm', 'i': 'rm', 'k': 'rm', ',': 'rm', '<': 'rm',
    '9': 'rr', '(': 'rr', 'o': 'rr', 'l': 'rr', '.': 'rr', '>': 'rr',
    '0': 'rp', ')': 'rp', '-': 'rp', '_': 'rp', '=': 'rp', '+': 'rp', 'p': 'rp', '[': 'rp', '{': 'rp', ']': 'rp', '}': 'rp',
    '\\': 'rp', '|': 'rp', ';': 'rp', ':': 'rp', "'": 'rp', '"': 'rp', '/': 'rp', '?': 'rp', 'enter': 'rp', 'backspace': 'rp', 'shiftright': 'rp'
  };

  const KEYBOARD_ROWS = [
    [
      { label: '`', shift: '~', code: 'Backquote', finger: 'lp' },
      { label: '1', shift: '!', code: 'Digit1', finger: 'lp' },
      { label: '2', shift: '@', code: 'Digit2', finger: 'lr' },
      { label: '3', shift: '#', code: 'Digit3', finger: 'lm' },
      { label: '4', shift: '$', code: 'Digit4', finger: 'li' },
      { label: '5', shift: '%', code: 'Digit5', finger: 'li' },
      { label: '6', shift: '^', code: 'Digit6', finger: 'ri' },
      { label: '7', shift: '&', code: 'Digit7', finger: 'ri' },
      { label: '8', shift: '*', code: 'Digit8', finger: 'rm' },
      { label: '9', shift: '(', code: 'Digit9', finger: 'rr' },
      { label: '0', shift: ')', code: 'Digit0', finger: 'rp' },
      { label: '-', shift: '_', code: 'Minus', finger: 'rp' },
      { label: '=', shift: '+', code: 'Equal', finger: 'rp' },
      { label: '⌫', code: 'Backspace', width: 'wide', finger: 'rp' }
    ],
    [
      { label: 'Tab', code: 'Tab', width: 'med', finger: 'lp' },
      { label: 'q', code: 'KeyQ', finger: 'lp' },
      { label: 'w', code: 'KeyW', finger: 'lr' },
      { label: 'e', code: 'KeyE', finger: 'lm' },
      { label: 'r', code: 'KeyR', finger: 'li' },
      { label: 't', code: 'KeyT', finger: 'li' },
      { label: 'y', code: 'KeyY', finger: 'ri' },
      { label: 'u', code: 'KeyU', finger: 'ri' },
      { label: 'i', code: 'KeyI', finger: 'rm' },
      { label: 'o', code: 'KeyO', finger: 'rr' },
      { label: 'p', code: 'KeyP', finger: 'rp' },
      { label: '[', shift: '{', code: 'BracketLeft', finger: 'rp' },
      { label: ']', shift: '}', code: 'BracketRight', finger: 'rp' },
      { label: '\\', shift: '|', code: 'Backslash', finger: 'rp' }
    ],
    [
      { label: 'Caps', code: 'CapsLock', width: 'wide', finger: 'lp' },
      { label: 'a', code: 'KeyA', finger: 'lp' },
      { label: 's', code: 'KeyS', finger: 'lr' },
      { label: 'd', code: 'KeyD', finger: 'lm' },
      { label: 'f', code: 'KeyF', finger: 'li', homing: true },
      { label: 'g', code: 'KeyG', finger: 'li' },
      { label: 'h', code: 'KeyH', finger: 'ri' },
      { label: 'j', code: 'KeyJ', finger: 'ri', homing: true },
      { label: 'k', code: 'KeyK', finger: 'rm' },
      { label: 'l', code: 'KeyL', finger: 'rr' },
      { label: ';', shift: ':', code: 'Semicolon', finger: 'rp' },
      { label: "'", shift: '"', code: 'Quote', finger: 'rp' },
      { label: 'Enter', code: 'Enter', width: 'wide', finger: 'rp' }
    ],
    [
      { label: 'Shift', code: 'ShiftLeft', width: 'xlarge', finger: 'lp' },
      { label: 'z', code: 'KeyZ', finger: 'lp' },
      { label: 'x', code: 'KeyX', finger: 'lr' },
      { label: 'c', code: 'KeyC', finger: 'lm' },
      { label: 'v', code: 'KeyV', finger: 'li' },
      { label: 'b', code: 'KeyB', finger: 'li' },
      { label: 'n', code: 'KeyN', finger: 'ri' },
      { label: 'm', code: 'KeyM', finger: 'ri' },
      { label: ',', shift: '<', code: 'Comma', finger: 'rm' },
      { label: '.', shift: '>', code: 'Period', finger: 'rr' },
      { label: '/', shift: '?', code: 'Slash', finger: 'rp' },
      { label: 'Shift', code: 'ShiftRight', width: 'xlarge', finger: 'rp' }
    ],
    [
      { label: 'Ctrl', code: 'ControlLeft', width: 'med', finger: 'lp' },
      { label: 'Alt', code: 'AltLeft', width: 'med', finger: 'th' },
      { label: 'Space', code: 'Space', width: 'spacebar', finger: 'th' },
      { label: 'Alt', code: 'AltRight', width: 'med', finger: 'th' },
      { label: 'Ctrl', code: 'ControlRight', width: 'med', finger: 'rp' }
    ]
  ];

  const Keyboard = {
    render(containerEl) {
      if (!containerEl) return;
      containerEl.innerHTML = '';
      containerEl.className = 'virtual-kb-container';

      KEYBOARD_ROWS.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'vkb-row';

        row.forEach(keyObj => {
          const keyDiv = document.createElement('div');
          keyDiv.className = `vkb-key ${keyObj.width || ''} ${keyObj.homing ? 'homing-key' : ''}`;
          keyDiv.id = `vkb-${keyObj.code.toLowerCase()}`;
          keyDiv.setAttribute('data-char', keyObj.label.toLowerCase());
          keyDiv.setAttribute('data-shift', (keyObj.shift || '').toLowerCase());
          keyDiv.setAttribute('data-finger', keyObj.finger);

          // Color indicator dot on the key
          const fInfo = FINGER_COLORS[keyObj.finger];
          const dot = document.createElement('span');
          dot.className = 'vkb-finger-dot';
          if (fInfo) dot.style.backgroundColor = fInfo.color;

          const label = document.createElement('span');
          label.className = 'vkb-key-text';
          label.textContent = keyObj.label.toUpperCase();

          keyDiv.appendChild(dot);
          keyDiv.appendChild(label);
          rowDiv.appendChild(keyDiv);
        });

        containerEl.appendChild(rowDiv);
      });
    },

    highlightKey(char) {
      if (!char) return;
      this.clearHighlights();

      const lower = char.toLowerCase();
      let isUpper = char !== lower && char.toUpperCase() === char && char.match(/[A-Z]/);

      // Find matching key element
      let keyEl = null;
      if (char === ' ') {
        keyEl = document.getElementById('vkb-space');
      } else {
        const keys = document.querySelectorAll('.vkb-key');
        keys.forEach(k => {
          if (k.getAttribute('data-char') === lower || k.getAttribute('data-shift') === lower) {
            keyEl = k;
          }
        });
      }

      if (keyEl) {
        keyEl.classList.add('active-target-key');
        const finger = keyEl.getAttribute('data-finger');
        this.highlightFinger(finger);

        // If uppercase or shifted symbol, also highlight appropriate opposite shift key
        if (isUpper || '~!@#$%^&*()_+{}|:"<>?'.includes(char)) {
          const shiftKeyId = (['ri', 'rm', 'rr', 'rp'].includes(finger)) ? 'vkb-shiftleft' : 'vkb-shiftright';
          const shiftEl = document.getElementById(shiftKeyId);
          if (shiftEl) shiftEl.classList.add('active-shift-key');
        }
      }
    },

    clearHighlights() {
      document.querySelectorAll('.active-target-key, .active-shift-key').forEach(el => {
        el.classList.remove('active-target-key', 'active-shift-key');
      });
      document.querySelectorAll('.hand-finger.active-finger').forEach(el => {
        el.classList.remove('active-finger');
      });
    },

    highlightFinger(fingerCode) {
      if (!fingerCode) return;
      const fingerNode = document.getElementById(`finger-${fingerCode}`);
      if (fingerNode) {
        fingerNode.classList.add('active-finger');
      }

      const fingerLabel = document.getElementById('active-finger-name');
      if (fingerLabel && FINGER_COLORS[fingerCode]) {
        fingerLabel.textContent = `Finger: ${FINGER_COLORS[fingerCode].name}`;
        fingerLabel.style.color = FINGER_COLORS[fingerCode].color;
      }
    }
  };

  window.TypeApp.Keyboard = Keyboard;
})();
