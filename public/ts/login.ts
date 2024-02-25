import { showNotification } from './utils.ts';

document.addEventListener('app-loaded', () => {
  const loginForm = document.getElementById('login-form') as HTMLFormElement;
  const loginButton = document.getElementById('login-button') as HTMLButtonElement;
  const signupButton = document.getElementById('signup-button') as HTMLButtonElement;
  const actionInput = loginForm.querySelector('input[name="action"]') as HTMLInputElement;

  function initializePage() {
    loginButton.addEventListener('click', () => {
      actionInput.value = 'login';
      loginForm.submit();
    });

    signupButton.addEventListener('click', () => {
      actionInput.value = 'signup';
      loginForm.submit();
    });

    const urlSearchParams = new URLSearchParams(window.location.search);
    const successParam = urlSearchParams.get('success');

    if (successParam === 'delete') {
      showNotification('Deleted account successfully!', 'success');
      history.pushState(null, '', window.location.href.replace('?success=delete', ''));
    }
  }

  initializePage();
});
