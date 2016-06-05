var chai = require('chai')
var should = chai.should()
var shelterCall = require('../index.js')

describe('shelterCall', function () {
  it('should do something', function () {
    shelterCall.doSomething().should.equal(12345)
  })
})
