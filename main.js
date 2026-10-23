/*
 * Claudian Spinner Verbs
 * Replaces Claudian's default "thinking" texts with the spinnerVerbs
 * from Claude Code's ~/.claude/settings.json. Does not modify Claudian.
 * Supports mode "replace" (default) and "append", like Claude Code.
 */
const { Plugin } = require("obsidian");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Claudian's built-in list (v2.3.16, unchanged in v2.3.20). Only these texts are replaced, so
// special statuses Claudian sets itself are left alone.
const CLAUDIAN_DEFAULTS = new Set(
["Thinking...","Pondering...","Processing...","Analyzing...","Considering...","Working on it...","Vibing...","One moment...","On it...","Ruminating...","Contemplating...","Reflecting...","Mulling it over...","Let me think...","Hmm...","Cogitating...","Deliberating...","Weighing options...","Gathering thoughts...","Brewing ideas...","Connecting dots...","Assembling thoughts...","Spinning up neurons...","Loading brilliance...","Consulting the oracle...","Summoning knowledge...","Crunching thoughts...","Dusting off neurons...","Wrangling ideas...","Herding thoughts...","Juggling concepts...","Untangling this...","Piecing it together...","Sipping coffee...","Warming up...","Getting cozy with this...","Settling in...","Making tea...","Grabbing a snack...","Parsing...","Compiling thoughts...","Running inference...","Querying the void...","Defragmenting brain...","Allocating memory...","Optimizing...","Indexing...","Syncing neurons...","Breathing...","Finding clarity...","Channeling focus...","Centering...","Aligning chakras...","Meditating on this...","Asking the stars...","Reading tea leaves...","Shaking the magic 8-ball...","Consulting ancient scrolls...","Decoding the matrix...","Communing with the ether...","Peering into the abyss...","Channeling the cosmos...","Diving in...","Rolling up sleeves...","Getting to work...","Tackling this...","On the case...","Investigating...","Exploring...","Digging deeper...","Bear with me...","Hang tight...","Just a sec...","Working my magic...","Almost there...","Give me a moment..."]
);

const SETTINGS_PATH = path.join(os.homedir(), ".claude", "settings.json");

module.exports = class ClaudianSpinnerVerbs extends Plugin {
  onload() {
    this.cache = { mtime: 0, verbs: null };
    // One observer per window document. Popout windows have their own
    // document, so watching only the main window misses them.
    this.observers = new Map();
    this.watch(document);
    this.app.workspace.onLayoutReady(() => {
      this.app.workspace.floatingSplit?.children?.forEach((w) => w.doc && this.watch(w.doc));
    });
    this.registerEvent(this.app.workspace.on("window-open", (w) => w.doc && this.watch(w.doc)));
    this.registerEvent(this.app.workspace.on("window-close", (w) => w.doc && this.unwatch(w.doc)));
  }

  onunload() {
    for (const obs of this.observers.values()) obs.disconnect();
    this.observers.clear();
  }

  watch(doc) {
    if (!doc?.body || this.observers.has(doc)) return;
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.classList.contains("claudian-thinking")) this.swap(node);
          else node.querySelectorAll?.(".claudian-thinking").forEach((el) => this.swap(el));
        }
      }
    });
    obs.observe(doc.body, { childList: true, subtree: true });
    this.observers.set(doc, obs);
  }

  unwatch(doc) {
    this.observers.get(doc)?.disconnect();
    this.observers.delete(doc);
  }

  // Re-reads settings.json only when it has changed.
  getVerbs() {
    try {
      const mtime = fs.statSync(SETTINGS_PATH).mtimeMs;
      if (mtime !== this.cache.mtime) {
        const cfg = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8")).spinnerVerbs;
        let verbs = null;
        if (cfg && Array.isArray(cfg.verbs) && cfg.verbs.length) {
          const own = cfg.verbs.map((v) => `${v}...`);
          verbs = cfg.mode === "append" ? [...CLAUDIAN_DEFAULTS, ...own] : own;
        }
        this.cache = { mtime, verbs };
      }
    } catch (e) {
      this.cache = { mtime: 0, verbs: null };
    }
    return this.cache.verbs;
  }

  swap(el) {
    const span = el.querySelector(":scope > span:not(.claudian-thinking-hint)");
    if (!span || !CLAUDIAN_DEFAULTS.has(span.textContent)) return;
    const verbs = this.getVerbs();
    if (!verbs) return;
    span.textContent = verbs[Math.floor(Math.random() * verbs.length)];
  }
};
