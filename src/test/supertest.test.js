import supertest from "supertest";
import chai from "chai";

const requester = supertest('http://localhost:8080');

describe('Tests funcionales e integradores', function() {

  describe('Tests de router de productos', function() {
  
    this.timeout(10000)

    before(async function() {
      this.timeout(10000)

      console.log("Se ejecuta el before antes de los tests de router de productos")
    })

    it('El endpoint GET /api/products devuelve todos los productos', async function() {
      const {
        statusCode,
        ok,
        _body
      } = await requester.get('/api/products')

      chai.expect(statusCode).to.be.equal(200)
      chai.expect(ok).to.be.equal(true)
      chai.expect(_body).to.have.property("payload")
    })
  })
})