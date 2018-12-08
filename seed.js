const db = require('./db');
const shopData = require('./shopData');
const Shop = require('./model/Shop');


async function seed(){
  try{
    console.log('connecting to mongo ...');
    await db.connect();
    console.log('connected!');
    console.log('Inserting seed data ...');
    await Shop.insertMany(shopData);
    console.log('done! will exit now..');
    return process.exit();
  }catch(err){
    console.error(err);
    return process.exit(1);
  }
}

seed();

