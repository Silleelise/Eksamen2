/*const { response } = require("express");
const get = require("../controllers/userscontroller")
const expect = require("chai").expect
*/


//Arrange

//Act

//Assert
const chai = require('chai');
const { response } = require ('express');
const expect = require ('chai').expect
const fetch = require("node-fetch");
const chaiHttp = require('chai-http')
const should = chai.should();

chai.use(chaiHttp)


describe("test", ()=> { //den tester for kode 200, altså at vi får fat i 200
    it("beskriv testen", (done)=> {
        chai
        .request("http://localhost:3500")
        .get('/')
        .end((err, res)=> {
            res.should.have.status(200);
            // console.log(res)
            done();
        })
    })
})