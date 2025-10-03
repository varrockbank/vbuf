// Test utilities
function createTestEditor() {
  const container = document.querySelector('.editor-container');
  const node = container.querySelector('.wb');
  return { wb: new WarrenBuf(node), node };
}

function dispatchKey(node, key, modifiers = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
    bubbles: true,
    cancelable: true,
    metaKey: modifiers.meta || false,
    ctrlKey: modifiers.ctrl || false,
    shiftKey: modifiers.shift || false,
    altKey: modifiers.alt || false
  });
  node.dispatchEvent(event);
}

function type(node, text) {
  for (const char of text) {
    dispatchKey(node, char);
  }
}

// Test definitions
const runner = new TestRunner();

// Basic Typing Tests
runner.describe('Basic Typing', () => {
  let wb, node;

  runner.beforeEach(() => {
    const editor = createTestEditor();
    wb = editor.wb;
    node = editor.node;
  });

  runner.it('should insert single character', () => {
    dispatchKey(node, 'a');
    expect(wb.Model.lines[0]).toBe('a');
  }, "Insert single character 'a'");

  runner.it('should insert multiple characters', () => {
    type(node, 'Hello');
    expect(wb.Model.lines[0]).toBe('Hello');
  }, "Insert 'Hello'");

  runner.it('should insert word with spaces', () => {
    type(node, 'Hello World');
    expect(wb.Model.lines[0]).toBe('Hello World');
  }, "Insert 'Hello World' with spaces");

  runner.it('should type sentence', () => {
    type(node, 'The quick brown fox');
    expect(wb.Model.lines[0]).toBe('The quick brown fox');
  }, "Insert sentence 'The quick brown fox'");
});

// Backspace Tests
runner.describe('Backspace', () => {
  let wb, node;

  runner.beforeEach(() => {
    const editor = createTestEditor();
    wb = editor.wb;
    node = editor.node;
  });

  runner.it('should delete single character', () => {
    type(node, 'Hello');
    dispatchKey(node, 'Backspace');
    expect(wb.Model.lines[0]).toBe('Hell');
  }, "Delete single char from 'Hello' → 'Hell'");

  runner.it('should delete multiple characters', () => {
    type(node, 'Hello');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    expect(wb.Model.lines[0]).toBe('He');
  }, "Delete 3 chars from 'Hello' → 'He'");

  runner.it('should delete all characters', () => {
    type(node, 'Hi');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    expect(wb.Model.lines[0]).toBe('');
  }, "Delete all chars from 'Hi' → ''");
});

// Enter/Newline Tests
runner.describe('Enter Key', () => {
  let wb, node;

  runner.beforeEach(() => {
    const editor = createTestEditor();
    wb = editor.wb;
    node = editor.node;
  });

  runner.it('should create new line', () => {
    type(node, 'Hello');
    dispatchKey(node, 'Enter');
    expect(wb.Model.lines).toHaveLength(2);
    expect(wb.Model.lines[0]).toBe('Hello');
    expect(wb.Model.lines[1]).toBe('');
  }, "Create new line: 'Hello'[Enter] → 2 lines");

  runner.it('should create multiple lines', () => {
    type(node, 'Line 1');
    dispatchKey(node, 'Enter');
    type(node, 'Line 2');
    dispatchKey(node, 'Enter');
    type(node, 'Line 3');
    expect(wb.Model.lines).toHaveLength(3);
    expect(wb.Model.lines[0]).toBe('Line 1');
    expect(wb.Model.lines[1]).toBe('Line 2');
    expect(wb.Model.lines[2]).toBe('Line 3');
  }, "Create multiple lines: 'Line 1'[Enter]'Line 2'[Enter]'Line 3' → 3 lines");

  runner.it('should split line with Enter', () => {
    type(node, 'Hello');
    dispatchKey(node, 'ArrowLeft');
    dispatchKey(node, 'ArrowLeft');
    dispatchKey(node, 'Enter');
    expect(wb.Model.lines).toHaveLength(2);
    expect(wb.Model.lines[0]).toBe('Hel');
    expect(wb.Model.lines[1]).toBe('lo');
  }, "Split line: 'Hello'[ArrowLeft×2][Enter] → 'Hel' and 'lo'");
});

// Complex Sequences
runner.describe('Complex Sequences', () => {
  let wb, node;

  runner.beforeEach(() => {
    const editor = createTestEditor();
    wb = editor.wb;
    node = editor.node;
  });

  runner.xit('should type, delete, and retype', () => {
    type(node, 'Hello');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    type(node, 'y there');
    expect(wb.Model.lines[0]).toBe('Hely there');
  }, "Type, delete, retype");

  runner.xit('should create line, delete line break', () => {
    type(node, 'Hello');
    dispatchKey(node, 'Enter');
    type(node, 'World');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    expect(wb.Model.lines).toHaveLength(1);
    expect(wb.Model.lines[0]).toBe('Hello');
  }, "Create/delete line breaks");

  runner.xit('should type multi-line then edit first line', () => {
    type(node, 'First');
    dispatchKey(node, 'Enter');
    type(node, 'Second');
    dispatchKey(node, 'ArrowUp');
    dispatchKey(node, 'ArrowRight', { meta: true });
    type(node, ' Line');
    expect(wb.Model.lines[0]).toBe('First Line');
    expect(wb.Model.lines[1]).toBe('Second');
  }, "Multi-line editing");

  runner.xit('should delete across line boundary', () => {
    type(node, 'Hello');
    dispatchKey(node, 'Enter');
    type(node, 'World');
    dispatchKey(node, 'ArrowUp');
    dispatchKey(node, 'ArrowRight', { meta: true });
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    dispatchKey(node, 'Backspace');
    expect(wb.Model.lines).toHaveLength(1);
    expect(wb.Model.lines[0]).toBe('World');
  }, "Delete across boundaries");

  runner.xit('should create paragraph and edit middle', () => {
    type(node, 'Line 1');
    dispatchKey(node, 'Enter');
    type(node, 'Line 2');
    dispatchKey(node, 'Enter');
    type(node, 'Line 3');
    dispatchKey(node, 'ArrowUp');
    dispatchKey(node, 'ArrowRight', { meta: true });
    type(node, ' edited');
    expect(wb.Model.lines).toHaveLength(3);
    expect(wb.Model.lines[0]).toBe('Line 1');
    expect(wb.Model.lines[1]).toBe('Line 2 edited');
    expect(wb.Model.lines[2]).toBe('Line 3');
  }, "Edit middle of paragraph");
});
