/* ============================================
   JeevanCare+ SPA Router
   ============================================ */

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const parts = hash.split('/');
    const basePath = '/' + (parts[1] || '');
    const id = parts[2] || null;

    let route = this.routes[hash];
    let matchedId = null;

    if (!route && id) {
      route = this.routes[basePath];
      matchedId = id;
    }
    
    if (route) {
      this.currentRoute = hash;
      const mainContent = document.getElementById('main-content');
      mainContent.classList.add('page-enter');
      route(matchedId);
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.route === hash);
      });
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Remove animation class after it plays
      setTimeout(() => mainContent.classList.remove('page-enter'), 400);
    }
  }

  init() {
    this.handleRoute();
  }
}
