export default class ViewUserDTO {
    constructor(user) {
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.email = user.email;
      this.cart = user.cart;
      this.last_connection = new Date(Number(user.last_connection)).toString()
      this.role = user.role;
    }
  }