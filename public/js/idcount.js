const db = mongoose.connection;

db.collection('add_donor').find().toArray((err, result) => {
    console.log( result.length);
 })