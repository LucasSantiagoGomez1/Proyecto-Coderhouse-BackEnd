export const adminRoleAuth = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  }
  else {
    res.status(403).send({ status: "failure", details: "You don't have access. Must be an admin" })
  }
}

export const userRoleAuth = (req, res, next) => {
  if (req.user.role === "user") {
    next();
  }
  else {
    res.status(403).send({ status: "failure", details: "You don't have access. Must be an user" })
  }
}

export const premiumRoleAuth = (req, res, next) => {
  if (req.user.role === "premium") {
    next();
  }
  else {
    res.status(403).send({ status: "failure", details: "You don't have access. Must be premium" })
  }
}

// Permite (a partir de un array con roles), otorgar acceso a dichos roles
export const multipleRolesAuth = (roles) => {
  return async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    }
    else {
      let msg = roles.join(" / ")
      res.status(403).send({ status: "failure", details: "You don't have access. Must be: " + msg })
    }
  }
} 