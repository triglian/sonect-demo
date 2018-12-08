const express = require('express')
const Boom = require('boom');
const db = require('./db');
const apiRouter = require('./routes/api/shops');
require('./model/Shop');

const port = 3000;

async function init(){
  try{
    await db.connect();
    const app = express();
    
    app.get('/', (req,res) => res.json({message: 'API server is running'}))
    app.use('/api/shops', apiRouter);

    // 404 handler
    app.use((req, res) => {
      const err = Boom.notFound('Not found');
      return res.json(err.output);
    });

    // default error handler
    app.use((err, req, res, next) => {
      if(err.isBoom){
        return res.json(err.output);
      }
      return next(err);
    });

    app.listen(port, () => console.log(`API server listening on port ${port}!`))

  }catch(err){
    console.error('Unhandled error occured:')
    console.error(err);
  }
}

init();
