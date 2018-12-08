const express = require('express');
const _ = require('lodash');
const isValidCoordinates = require('is-valid-coordinates');
const Boom = require('boom');
const Shop = require('../../model/Shop');
const errors = require('../../errors');

/**
 * validates the search query for a shop
 * @param {Object} query - The user supplied query.
 * @param {number} query.longitude - The longitude coord for which to search for shops.
 * @param {number} query.latitude - The latitude coord for which to search for shops.
 * @param {number} query.radius - The radius in meters from the coords within for which to search for shops.
 * @param {string} [query.sortBy=distance] - Whether to sort by distance to reach the shop or maximum withdrawal limit. Accepted values: 'distance', 'withdrawal_limit'
 */
function validateSearchQuery(query) {
  let { longitude, latitude, radius, sortBy } = query;

  longitude = _.toNumber(longitude);
  latitude = _.toNumber(latitude);
  radius = _.toNumber(radius);

  if (!isValidCoordinates(longitude, latitude)) {
    throw Boom.badRequest(errors.ERR_INVALID_COORDS);
  }

  if (!_.isFinite(radius)) {
    throw Boom.badRequest(errors.ERR_INVALID_RADIUS);
  }

  if (_.isNil(sortBy)) sortBy = 'distance';

  if (sortBy !== 'distance' && sortBy !== 'withdrawal_limit') {
    throw Boom.badRequest(errors.ERR_SORT_BY);
  }

  return { longitude, latitude, radius, sortBy };
}

async function searchShop(query) {
  const { longitude, latitude, radius, sortBy } = query;

  const filters = {
    distance: { distance: 1 },
    withdrawal_limit: { withdrawalLimit: -1 }
  };

  const filter = filters[sortBy] || filters.distance;

  const results = await Shop.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        distanceField: 'distance',
        spherical: true,
        maxDistance: radius
      }
    },
    { $sort: filter }
  ]);

  const filteredResults = _.map(
    results,
    _.partialRight(_.pick, [
      'address',
      'city',
      'PO',
      'location.coordinates',
      'withdrawalLimit',
      'distance'
    ])
  );

  return filteredResults;
}

const router = express.Router();

router.get('/search', async (req, res, next) => {
  try {
    const query = validateSearchQuery(req.query);
    const results = await searchShop(query);
    return res.json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;