# Sonect Challenge

The database contains a list of Postomats around Zurich. We use [GeoJSON](https://docs.mongodb.com/manual/reference/geojson/) objects to store the coordinates so we can get advantage of the [Geospatial Queries](https://docs.mongodb.com/manual/geospatial-queries/) capabilities of mongodb.

## API

Once you start the server, to get a list of shops pass the `longitude`, `latitude`, `radius` (in meters) as query parameters in a `GET` to `api/shops/search`. You can also sort results using the `sortBy` query parameter with values of `'distance'` or `'withdrawal_limit'`. The default is to sort by distance:

Example:

```sh
$ curl http://localhost:3000/api/shops/search?longitude=8.5391557&latitude=47.3733028&radius=4000&sortBy=withdrawal_limit
```


## Prerequisites

mongodb > `3.0`
node.js > `8.0`

## Install dependencies

```sh
$ npm install
```

## Seed the database
Make sure you have installed the dependencies. Then:

```sh
$ npm run seed
```

## Run the server

Production:

```sh
$ npm start
```

Developments:

```sh
$ npm run start-dev
```

## Tests

```sh
$ npm test
```