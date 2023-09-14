const form = document.getElementById('resetPasswordRequestForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/requestResetPassword',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Email for restoring your password has been sent',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: `There was an error`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
    })
})