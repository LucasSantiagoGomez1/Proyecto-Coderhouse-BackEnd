let modifyRoleBtn = document.getElementById("btn-modify-role")
let deleteUserBtn = document.getElementById("btn-delete-user")

modifyRoleBtn.addEventListener("click", () => {
  let userId = window.location.pathname.split("/").pop() // Se obtiene el id desde la url

  fetch(`/api/users/premium/${userId}`, {
    method: 'POST'
  })
  .then(result => {
    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'The user role has been modified (reloading the page)',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setTimeout(() => window.location.reload(), 3000) // Recargamos la pagina para mostrar los cambios
    }
    else {
      Swal.fire({
        icon: 'error',
        title: `The user role couldn't be modified (the user is lacking documentation)`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  })
})

deleteUserBtn.addEventListener("click", () => {
  let userId = window.location.pathname.split("/").pop() // Se obtiene el id desde la url

  fetch(`/api/users/${userId}`, {
    method: 'DELETE'
  })
  .then(result => {
    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'The user has been deleted (redirecting to home)',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setTimeout(() => window.location.replace("/users"), 3000) // Redirigimos
    }
    else {
      Swal.fire({
        icon: 'error',
        title: `The user couldn't be deleted`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  })
})