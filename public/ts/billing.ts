document.addEventListener('app-loaded', () => {
  const billingForm = document.getElementById('billing-form') as HTMLFormElement;
  const deleteButton = document.getElementById('delete-account') as HTMLButtonElement;

  async function confirmDeleteAccount(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const { Swal } = window;

    const confirmDialogResult = await Swal.fire({
      icon: 'warning',
      title: 'Confirm delete?',
      text: `Are you sure you want to delete your account? You will lose any questions you've paid for.`,
      focusConfirm: false,
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: 'Yes, delete!',
      cancelButtonText: 'Wait, cancel.',
    });

    if (confirmDialogResult.isDenied) {
      billingForm.submit();
    }
  }

  function initializePage() {
    deleteButton.addEventListener('click', confirmDeleteAccount);
  }

  initializePage();
});
