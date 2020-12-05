const chai = require('chai');
const { response } = require ('express');
const expect = require ('chai').expect
const fetch = require("node-fetch");
const chaiHttp = require('chai-http')
const should = chai.should();
chai.use(chaiHttp)


describe("test", ()=> { //den tester for kode 200, altså at vi får fat i 200
    it("should test if the server is responsive, code 200", (done)=> {
        chai
        .request("http://localhost:3500")
        .get('/') //Startsiden (login)
        .end((err, res)=> {
            res.should.have.status(200);
            done();
        })
    })
})