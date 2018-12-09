/* eslint-disable mocha/prefer-arrow-callback */
/* eslint-disable no-unused-expressions */

const should = require('should'); // eslint-disable-line no-unused-vars
const request = require('supertest');
const _ = require('lodash');
const app = require('../app');
const db = require('../db');

describe('routes', function describeRoutes() {
  describe('/', function describeRoot() {
    it('should return a  running message', function itFn(done) {
      request(app)
        .get('/')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.message.should.equal('API server is running');
          done(err);
        });
    });
  });

  describe('/api', function describeRoot() {
    it('should return a 404', function itFn(done) {
      request(app)
        .get('/api')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(404)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal('Not found');
          done(err);
        });
    });
  });

  describe('/api/shops', function describeRoot() {
    it('should return a 404', function itFn(done) {
      request(app)
        .get('/api')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(404)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal('Not found');
          done(err);
        });
    });
  });
});

describe('/api/shops/search', function describeShop() {
  describe('query validation', function describeGet() {
    it('should return 400 when there is no longitude or latitude in the request', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal('Invalid coordinates');
          done(err);
        });
    });

    it('should return 400 when longitude is invalid', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({ longitude: '181', latitude: '10' })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal('Invalid coordinates');
          done(err);
        });
    });

    it('should return 400 when latitude is invalid', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({ longitude: '10', latitude: '91' })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal('Invalid coordinates');
          done(err);
        });
    });

    it('should return 400 when the radius is missing', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({ longitude: '10', latitude: '10' })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal('Radius should be a number');
          done(err);
        });
    });

    it('should return 400 when the radius is invalid', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({ longitude: '10', latitude: '10', radius: 'test' })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal('Radius should be a number');
          done(err);
        });
    });

    it('should return 400 when the sortBy is invalid', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({
          longitude: '10',
          latitude: '10',
          radius: '10',
          sortBy: 'test'
        })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body.payload.message.should.equal(
            "The sort_by should have one of the following values: 'distance', 'withdrawalLimit'"
          );
          done(err);
        });
    });
  });

  describe('results', function describeRoot() {
    before(async function beforeFn() {
      await db.connect();
    });

    it('should have the right format', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({
          longitude: '8.5417',
          latitude: '47.3769',
          radius: '1000'
        })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function responseFn(err, res) {
          // eslint-disable-line no-unused-vars
          res.body[0].should.exist;
          const shop = res.body[0];
          shop.name.should.exist;
          shop.address.should.exist;
          shop.city.should.exist;
          shop.po.should.exist;
          shop.location.should.exist;
          shop.location.coordinates.should.exist;
          shop.distance.should.exist;
          shop.withdrawalLimit.should.exist;

          should.not.exist(shop._id); // eslint-disable-line no-underscore-dangle
          should.not.exist(shop.location._id); // eslint-disable-line no-underscore-dangle
          done(err);
        });
    });

    it('should be sorted by distance by default', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({
          longitude: '8.5417',
          latitude: '47.3769',
          radius: '1000'
        })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function responseFn(err, res) {
          const isSorted = _.every(
            res.body,
            (value, index, array) =>
              index === 0 || array[index - 1].distance <= value.distance
          );

          isSorted.should.equal(true);
          done(err);
        });
    });

    it('should be ordered by withdrawal limit', function itFn(done) {
      request(app)
        .get('/api/shops/search')
        .query({
          longitude: '8.5417',
          latitude: '47.3769',
          radius: '1000',
          sortBy: 'withdrawalLimit'
        })
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function responseFn(err, res) {
          const isSorted = _.every(
            res.body,
            (value, index, array) =>
              index === 0 ||
              array[index - 1].withdrawalLimit >= value.withdrawalLimit
          );

          isSorted.should.equal(true);
          done(err);
        });
    });
  });
});
