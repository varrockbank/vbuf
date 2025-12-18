# Buffee

Inspired by the spartan performance and minimalism of terminal interfaces and Vim, Buffee is a
microlibrary and efficient plaintext rendering engine for the web. Fixed-width text in a grid layout is not a bug, it's a feature! Yes - like Emacs, this microlibrary includes a text editor too.

- tiny footprint: ~4kb, zero-dependency, low memory/CPU overhead
- performance: rivals native editors like Vim - no slowdown on large files
- heavy-duty: ~70m+ SLOC files, (1B+ in ultra-high-capacity mode)
- minimal: no build step, no NPM, Just vendor the VanillaJS function. minimal surface area.
- extensible: TUI, syntax highlighting modules, hackable API/internals

![](assets/preview.png)

[Live Demo](https://varrockbank.github.io/buffee/)

[Unit Tests](https://varrockbank.github.io/buffee/test/)

## An Embeddable Building Block

1. spartan (minimal, performant, capable)
2. hackable
3. tiny 

This trifecta uniquely positions buffee as a building block for rich editing experience, IDEs and apps. In fact, this guides what features to scope and omit.

See [comparison](https://varrockbank.github.io/buffee/comparison.html) and [performance](https://varrockbank.github.io/buffee/performance.html) for more on Buffee's niche.

## Usage

### Font Requirements

Buffee assumes monospace fonts with accurate CSS `ch` values. When this assumption breaks, the cursor drifts from expected position over long lines.

- **Good:** Menlo, Consolas, `monospace` (generic)
- **Bad:** Monaco

To test: type "A" 100+ times and move cursor to end. If misaligned, try a different font.

### CSS 

Use `style.css` which contains all structural styles. Then define colors for your instance:

```css
.wb { background-color: #282C34; color: #B2B2B2 }
.wb .wb-selection { background-color: #EDAD10 }
.wb .wb-cursor { background-color: #FF6B6B }
```

see [themes](https://varrockbank.github.io/buffee/themes.html) for inspiration.

### HTML

Editor instances bind to DOM node with this structure:

```html
<blockquote class="wb no-select" tabindex="0" id="editor">
  <textarea class="wb-clipboard-bridge" aria-hidden="true"></textarea>
  <div class="wb-content">
    <div class="wb-gutter"></div>
    <div class="wb-lines"></div>
  </div>
  <div class="wb-status">
    <div class="wb-status-left">
      <span class="wb-linecount"></span>
    </div>
    <div class="wb-status-right">
      <span class="wb-coordinate"></span>
      <span>|</span>
      <span class="wb-indentation"></span>
    </div>
  </div>
</blockquote>
```

### JavaScript

```javascript
const editor = new Buffee(document.getElementById("editor"), {});
```

#### Auto-fit Viewport

By default, the editor auto-fits to its container. For fixed dimensions, specify:

```javascript
new Buffee(el, { viewportRows: 20 });      // Fixed row count
new Buffee(el, { viewportCols: 80 });      // Fixed column width
new Buffee(el, { viewportRows: 20, viewportCols: 80 }); // Both fixed
```

For auto-fit to work, the editor must have a defined height (either `height: 100%` of parent, or explicit pixel height).

### Model-view-controller API

**Model** `instance.Model.lines` is the text buffer

**View** `instance.Viewport` subset of indices of text buffer to be rendered

**Controller** `instance.Selection` text editor operations are relative to the text Selection. Cursor are just a special case of Selection. Historically, indexing was Viewport relative but now absolute.

## Extensibility

Historically, extensibility was only via the MVC APIs. However, extensions can access deeper internals. See extensions directory for examples including:

- Tree-sitter (experimental)
- Regex based syntax highlighting
- TUI (legacy that fiddles with)
- Elementals (TUI 2.0 that uses layer API)

iOS support is currently provided as an extension which maps iOS events to keyboard events. see: index.html for example.

## Distributable

There is no build process needed to vendor `Buffee` global function nor is there to work on the code. However, the minified distributable is created with globally installed `Terser`. This is done by a pre-commit hook ensuring `dist/buffee.min.js` is updated in sync. 
`scripts/setup-hooks.sh` symlinks:

```sh
ln -s ../../hooks/pre-commit .git/hooks/pre-commit
```

## Footnotes

Key performance insight is maintaining small footprint in the DOM and 
then performing surgical DOM updates. Furthermore, the fixed-width character grid
simplifies some rendering challenges.

The zeitgeist of webdev is VDOM and efficient incrementality but this abstraction does not come free. Furthermore, the smallest VDOM diffing libraries are larger than buffee's entire footprint.

Buffers are the darkhorses of text editor implementations. They map 1:1 with the problem domain but are infeasible in practice as text editing operations constantly involve line reindexing. The pantheon of native text editors use a combination of complex data structures. VSCode, whle running in Electron, uses a [Piecetree](https://code.visualstudio.com/blogs/2018/03/23/text-buffer-reimplementation). TThe piecetree library alone is 10x+ buffee's entire footprint. Buffee owes its compactness to V8 arrays not being real arrays and hyperoptimized by V8 magic. We can program against an intuitive model and remain compact while getting O(1) cursor/line-wise editor operations 
