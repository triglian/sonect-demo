# Sonect Challenge

The database contains a list of Postomats around Zurich. We use [GeoJSON](https://docs.mongodb.com/manual/reference/geojson/) objects to store the coordinates so we can get advantage of the [Geospatial Queries](https://docs.mongodb.com/manual/geospatial-queries/) capabilities of mongodb.

## API

Once you start the server, to get a list of shops pass the `longitude`, `latitude`, `radius` (in meters) as query parameters in a `GET` to `api/shops/search`. You can also sort results using the `sortBy` query parameter with values of `'distance'` or `'withdrawalLimit'`. The default is to sort by __distance__:

Example:

```sh
$ curl http://localhost:3000/api/shops/search?longitude=8.5391557&latitude=47.3733028&radius=4000&sortBy=withdrawalLimit
```

## Install dependencies

```sh
$ npm install
```

## Seed the database
Make sure your mongodb version is greater than 3.0 and you have installed the dependencies. Then:

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

__Important__: Make sure the database is seeded before running the tests.

```sh
$ npm test
```

## Gulp task

I created a gulp task to start the server. You need to have the gulp-cli installed:

```sh
$ npm install gulp-cli -g
```

Then, to run the task:

```sh
$ gulp
```
