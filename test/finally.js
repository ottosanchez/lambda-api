'use strict';

const Promise = require('bluebird') // Promise library
const expect = require('chai').expect // Assertion library

// Init API instance
const api = require('../index')({ version: 'v1.0' })

// Simulate database module
const fakeDatabase = { connected: true }

// NOTE: Set test to true
api._test = true;

let event = {
  httpMethod: 'get',
  path: '/test',
  body: {},
  headers: {
    'Content-Type': 'application/json'
  }
}

/******************************************************************************/
/***  DEFINE TEST ROUTE                                                     ***/
/******************************************************************************/
api.get('/test', function(req,res) {
  res.status(200).json({
    method: 'get',
    status: 'ok',
    connected: fakeDatabase.connected.toString()
  })
})

/******************************************************************************/
/***  DEFINE FINALLY METHOD                                                 ***/
/******************************************************************************/
api.finally(function(req,res) {
  fakeDatabase.connected = false
})

/******************************************************************************/
/***  BEGIN TESTS                                                           ***/
/******************************************************************************/

describe('Finally Tests:', function() {

  it('Connected on first execution and after callback', function() {
    let _event = Object.assign({},event,{})

    return new Promise((resolve,reject) => {
      api.run(_event,{},function(err,res) { resolve(res) })
    }).then((result) => {
      expect(result).to.deep.equal({ headers: { 'Content-Type': 'application/json' }, statusCode: 200, body: '{"method":"get","status":"ok","connected":"true"}', isBase64Encoded: false })
    })
  }) // end it

  it('Disconnected on second execution', function() {
    let _event = Object.assign({},event,{})

    return new Promise((resolve,reject) => {
      api.run(_event,{},function(err,res) { resolve(res) })
    }).then((result) => {
      expect(result).to.deep.equal({ headers: { 'Content-Type': 'application/json' }, statusCode: 200, body: '{"method":"get","status":"ok","connected":"false"}', isBase64Encoded: false })
    })
  }) // end it

}) // end FINALLY tests
