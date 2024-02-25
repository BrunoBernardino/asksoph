(() => {
  function initializeApp() {
    window.app = window.app || {};
    initializeLoading();

    document.dispatchEvent(new Event('app-loaded'));

    window.app.hideLoading();
  }

  function initializeLoading() {
    const loadingComponent = document.getElementById('loading');

    window.app.showLoading = () => loadingComponent.classList.remove('hide');
    window.app.hideLoading = () => loadingComponent.classList.add('hide');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
  });
})();
