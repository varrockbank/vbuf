/**
 * Test DSL for WarrenBuf
 *
 * Object-oriented test environment that encapsulates a node and provides
 * literate methods for user interactions.
 *
 * Design Principles:
 * - Each test gets its own TestEditorEnvironment instance
 * - Literate syntax that reads like user actions
 * - Deferred execution (modifiers chain, execute on .once() or .times(n))
 *
 * Usage Example:
 *
 *   runner.beforeEach(() => {
 *     ({ wb, node, editor } = setupTestEditor());
 *   });
 *
 *   runner.it('should delete across line boundary', () => {
 *     editor.type('Hello');
 *     editor.press(Key.Enter).once();
 *     editor.type('World');
 *     editor.press(Key.ArrowLeft).withMetaKey().once();
 *     editor.press(Key.Backspace).once();
 *
 *     expect(wb.Model.lines).toEqual(['HelloWorld']);
 *   }, "Delete across boundaries");
 */

// DSL Constants
const Key = {
  Enter: 'Enter',
  Backspace: 'Backspace',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown'
};

// Valid key names for validation
const VALID_KEYS = new Set(Object.values(Key));

/**
 * Test environment for a single editor instance.
 * Provides literate methods for user interactions.
 */
class EditorFixture {
  constructor() {
    const container = document.querySelector('.editor-container');

    const node = document.createElement('div');
    node.className = 'wb no-select';
    node.innerHTML = `
      <textarea class="wb-clipboard-bridge" aria-hidden="true"></textarea>
      <div style="display: flex">
        <div class="wb-gutter"></div>
        <div class="wb-lines" style="flex: 1; overflow: hidden;"></div>
      </div>
      <div class="wb-status" style="display: flex; justify-content: space-between;">
        <div class="wb-status-left" style="display: flex;">
          <span class="wb-linecount"></span>
        </div>
        <div class="wb-status-right" style="display: flex;">
          <span class="wb-coordinate"></span>
          <span>|</span>
          <span class="wb-indentation"></span>
        </div>
      </div>
    `;

    container.innerHTML = '';
    container.appendChild(node);

    this.node = node;
    this.wb = new WarrenBuf(node);
  }

  /**
   * Press a key with optional modifiers and repetition.
   *
   * @param {string} key - Single character or Key constant
   * @returns {Object} Builder with .withMetaKey(), .withShiftKey(), .once(), .times(n)
   *
   * @example
   *   editor.press(Key.Enter).once();
   *   editor.press(Key.Backspace).times(5);
   *   editor.press(Key.ArrowLeft).withMetaKey().once();
   *   editor.press(Key.ArrowRight).withShiftKey().withMetaKey().once();
   */
  press(key) {
    // Validate key
    if (key.length > 1 && !VALID_KEYS.has(key)) {
      throw new Error(`Invalid key: '${key}'. Use type() for typing text or use a Key constant.`);
    }

    const node = this.node;
    const builder = {
      _key: key,
      _modifiers: {},

      withMetaKey() {
        this._modifiers.meta = true;
        return this;
      },

      withShiftKey() {
        this._modifiers.shift = true;
        return this;
      },

      once() {
        dispatchKey(node, this._key, this._modifiers);
        return this;
      },

      times(count) {
        for (let i = 0; i < count; i++) {
          dispatchKey(node, this._key, this._modifiers);
        }
        return this;
      }
    };

    return builder;
  }

  /**
   * Type text into the editor.
   *
   * @param {string} text - Text to type
   *
   * @example
   *   editor.type('Hello World');
   */
  type(text) {
    for (const char of text) {
      dispatchKey(this.node, char);
    }
  }
}
