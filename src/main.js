import './styles/style.css';

async function initApp() {
  try {
    const { api } = await import('./api.js');
    window.api = api;

    const isConnected = await api.healthCheck();
    if (!isConnected) {
      throw new Error('Não foi possível conectar ao backend. Verifique se o servidor está rodando na porta 3000.');
    }

    const [
      { appState },
      { ApiUtils },
      { UIUtils }
    ] = await Promise.all([
      import('./scripts/state.js'),
      import('./scripts/api-utils.js'),
      import('./scripts/ui-utils.js')
    ]);

    const [
      { cardRenderer },
      { filterSystem },
      { searchSystem },
      { viewControls }
    ] = await Promise.all([
      import('./scripts/card-renderer.js'),
      import('./scripts/filters.js'),
      import('./scripts/search.js'),
      import('./scripts/view-controls.js')
    ]);

    const [
      { navigationSystem },
      { modalSystem },
      { eventHandlers },
      { ControlsBarAutoHide }
    ] = await Promise.all([
      import('./scripts/navigation.js'),
      import('./scripts/modal.js'),
      import('./scripts/event-handlers.js'),
      import('./scripts/auto-hide.js')
    ]);

    const { App } = await import('./scripts/app.js');
    const app = new App();

    await app.init();

    window.pInk = app;
    window.appState = appState;

  } catch (error) {
    const cardsContainer = document.getElementById('cards');
    if (cardsContainer) {
      cardsContainer.innerHTML = `
        <div class="error">
          <h3>❌ Erro ao inicializar aplicação</h3>
          <p>${error.message}</p>
          <button onclick="location.reload()" class="retry-btn">Tentar novamente</button>
        </div>
      `;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
