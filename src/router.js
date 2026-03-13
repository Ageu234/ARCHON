// ═══════════════════════════════════════════════════════════════
// ARCHON — Simple Hash Router
// ═══════════════════════════════════════════════════════════════

export class Router {
  constructor() {
    this.routes = {};
    this.currentView = null;
    window.addEventListener('hashchange', () => this.resolve());
  }

  on(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const handler = this.routes[hash] || this.routes['/'];
    if (handler) {
      if (this.currentView && this.currentView.destroy) {
        this.currentView.destroy();
      }
      this.currentView = handler();
    }
  }

  start() {
    this.resolve();
  }
}
