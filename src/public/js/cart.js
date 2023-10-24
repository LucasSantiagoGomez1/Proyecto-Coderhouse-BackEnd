let btnCartPurchase = document.getElementById("btn-cart-purchase")
let emtpyCart = document.getElementById("btn-empty-cart")

btnCartPurchase.addEventListener('click', async () => {
  let cartId = window.location.pathname.split("/").pop()

  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST'
  })
  .then(async (result) => {
    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Purchase has been completed (redirecting to ticket information)',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      let payload = (await result.json()).payload
      let ticketId = payload.ticket._id

      setTimeout(() => window.location.replace(`/tickets/${ticketId}`), 3000)
    }
    else {
      Swal.fire({
        icon: 'error',
        title: `The purchase couldn't be completed`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  })
})

emtpyCart.addEventListener('click', () => {
  let cartId = window.location.pathname.split("/").pop()

  fetch(`/api/carts/${cartId}`, {
    method: 'DELETE'
  })
  .then(result => {
    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Cart was emptied (redirecting to products)',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setTimeout(() => window.location.replace("/products"), 3000)
    }
    else {
      Swal.fire({
        icon: 'error',
        title: `Cart couldn't be emptied`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  })
})