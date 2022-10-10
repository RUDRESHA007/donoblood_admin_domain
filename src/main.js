const express = require("express");
const app = express()
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const port = 5000
const path = require('path');
const ejs = require('ejs');
const url = require('url');


//data base connectionie mongodb
// require('./db/connection')
try {
   mongoose.connect('mongodb+srv://power:Rudra007@cluster0.0rgsp.mongodb.net/donoblood?retryWrites=true&w=majority');
   console.log("connection sucessfull")
}
catch {
   console.log("connection error")
}



//------------------------------------------------------------------------------------------

//public file initializatiomn ie js css files
let public_path = path.join(__dirname, '../public')
app.use(express.static(public_path + '/CSS'))
app.use(express.static(public_path + '/js'))

//------------------------------------------------------------------------------------------

//dynamiclly pass data threough html
let html_path = path.join(__dirname, '../templates/views')
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', html_path);

//------------------------------------------------------------------------------------------

//body parser initialization
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

//------------------------------------------------------------------------------------------


//signup
app.post('/home', function (req, res) {
   const name = req.body.username;
   const email = req.body.email;
   const password = req.body.password;
   const phone = req.body.phone;

   const data = {
      "name": name,
      "email": email,
      "password": password,
      "phone": phone
   }


   //insert data to mongodb
   const db = mongoose.connection;

   //creation of index
   // const b = db.collection('power').createIndex({ "email": 1, "phone": 1 }, { "unique": true })
   // db.collection('power').find().toArray((err, result) => {
   //    result.forEach((itm) => {
   //       console.log(itm.name===);
   //    })
   // })

   db.collection('admin').insertOne(data, (err, collection) => {
      if (err) throw err;
      console.log("Record inserted Successfully");
   });
   return res.render('home.html');
})

//------------------------------------------------------------------------------------------

//login
app.post('/home1', function (req, res) {
   const email = req.body.email;
   const password = req.body.password;
   const phone = req.body.phone;

   const data = {
      "email": email,
      // "phone": phone
   }


   //fetch data from the database
   const db = mongoose.connection;
   db.collection('admin').find(data).toArray((err, result) => {
      if (result.length === 0) {
         res.send("email not exist")
      }
      else if (result[0].email === email && result[0].password === password) {
         res.render("home.html");
      }
      else if (result[0].email === email && result[0].password !== password) {
         res.send("password wrong");

      }

   });
});

//------------------------------------------------------------------------------------------
//add donor details


app.post('/home2', function (req, res) {
   const db = mongoose.connection;

   // console.log(req.body.d_name);
   const name = req.body.d_name;
   const dob = req.body.d_dob;
   const adhar_no = req.body.adhar_no;
   const phone = req.body.d_phone;
   const country = req.body.d_country;
   const state = req.body.d_state;
   const district = req.body.d_district;
   const taluk = req.body.d_taluk;
   const pincode = req.body.d_pincode
   const address = req.body.d_address;

   const blood_type = req.body.d_blood_type;
   const blood_unit = req.body.d_blood_unit;

   const old_donation_date = req.body.old_blood_doanate_date;
   const personalPhoto = req.body.personalPhoto;


   const add_donor_data = {
      "donor_name": name,
      "date_of_birth": dob,
      "adhar_no": adhar_no,
      "phone": phone,
      "country": country,
      "state": state,
      "district": district,
      "taluk": taluk,
      "pincode": pincode,
      "address": address,
      "blood_type": blood_type,
      "unit_of_blood": blood_unit,
      "old_donation_date": old_donation_date,
      "personalPhoto": personalPhoto
   }
   //insert data to mongodb

   //creation of index
   // const b = db.collection('add_donor').createIndex({ "email": 1, "phone": 1 }, { "unique": true })

   db.collection('add_donor').insertOne(add_donor_data, (err, collection) => {
      if (err) throw err;
      console.log("donor details added Successfully");
   });
   return res.redirect('/donor/add_donors');
})
//----------------------------------------------------------------------------------


//update donor using their id


//pass id to url
app.get('/donor/update_donors', (req, res) => {
   const db = mongoose.connection;
   res.render('searchin_id');
})


//fetch id from the url

app.get(`/donor/update_donors/details`, (req, res) => {
   const db = mongoose.connection;
   // const queryObject = url.parse(req.url, true).query;//url param
   // enterd_id = queryObject._id
   // console.log(queryObject._id);
   // const string_id = mongoose.Types.ObjectId(enterd_id);//convert string to objectid


   const param_obj = url.parse(req.url, true).query;//url param
   const adhar_no = param_obj._id
   // res.send(adhar_no);

   db.collection('add_donor').find({ adhar_no: adhar_no }).toArray((err, result) => {

      // console.log(result.adhar_no == adhar_no);
      if (result.length !== 0) {
         res.render('update_donors', { data: result });
         // console.log(result[0].address);
      } else if (result.length === 0) {
         res.send("adhar no is invalid...!")

      }
   })
})


//update donor details

app.post(`/donor/update_donors/details/updated`, (req, res) => {
   const db = mongoose.connection;

   const name = req.body.d_name;
   const dob = req.body.d_dob;
   const adhar_no = req.body.adhar_no;
   const phone = req.body.d_phone;
   const country = req.body.d_country;
   const state = req.body.d_state;
   const district = req.body.d_district;
   const taluk = req.body.d_taluk;
   const address = req.body.d_address;
   const pincode = req.body.d_pincode
   const blood_type = req.body.d_blood_type;
   const blood_unit = req.body.d_blood_unit;

   const old_donation_date = req.body.old_blood_doanate_date;
   const personalPhoto = req.body.personalPhoto;


   const updated_data = {
      "donor_name": name,
      "date_of_birth": dob,
      "adhar_no": adhar_no,
      "phone": phone,
      "country": country,
      "state": state,
      "district": district,
      "taluk": taluk,
      "address": address,
      "pincode": pincode,
      "blood_type": blood_type,
      'unit_of_blood': blood_unit,
      "old_donation_date": old_donation_date,
      "personalPhoto": personalPhoto
   }
   db.collection('add_donor').updateMany({ adhar_no: adhar_no }, { $set: updated_data }, { multi: true }, function (err) {
      if (err) { throw err; }

      db.collection('add_donor').find({ adhar_no: adhar_no }).toArray((err, result) => {
         // console.log((itm._id.toString() === enterd_id) + " " + i);
         res.send(result[0].address);
      })
   })
});



//--------------------------------------------------------------------------------------------
// all donors bio data


app.get('/donor/donor_details', (req, res) => {
   const db = mongoose.connection;

   db.collection('add_donor').find().toArray((err, result) => {
      res.render('donor_details', { data: result });


   })
})




app.get('/stocks', (req, res) => {
   const db = mongoose.connection;
   db.collection('reciver').find().toArray((err, result2) => {
    
   db.collection('add_donor').find().toArray((err, result) => {
      res.render('stocks', { data: result,data2:result2 });


   })
   })
})

//----------------------------------------------------------------------------------

//search by location

app.get('/search_by_location', (req, res) => {
   const db = mongoose.connection;

   db.collection('add_donor').find().toArray((err, result) => {
      res.render('search_by_location', { data: result });
   })
})
app.get(`/search_by_location/details`, (req, res) => {
   // const db = mongoose.connection;
   const queryObject = url.parse(req.url, true).query;
   // console.log(queryObject._id);
   enterd_location = queryObject.d_pincode
   console.log(enterd_location);
   const db = mongoose.connection;

   db.collection('add_donor').find({ pincode: enterd_location }).toArray((err, result) => {
      // console.log(result.length);
      if (result.length !== 0) {
         res.render('search_by_location_details', { data: result });

      } else {
         res.send("record not found")

      }

   })
})

//----------------------------------------------------------------------------------


//search by blood group


app.get('/search_by_blood_group', (req, res) => {
   const db = mongoose.connection;

   db.collection('add_donor').find().toArray((err, result) => {
      res.render('search_by_blood_group');


   })
})

app.get(`/search_by_blood_group/details`, (req, res) => {
   const queryObject = url.parse(req.url, true).query;
   enterd_blood_group = queryObject.d_blood_type
   const db = mongoose.connection;

   db.collection('add_donor').find({ blood_type: enterd_blood_group }).toArray((err, result) => {
      // console.log(result.length);
      if (result.length !== 0) {
         res.render('search_by_blood_group_details', { data: result });

      } else {
         res.send("record not found")

      }

   })
})

//--------------------------------------------------------------------------------------------

app.post('/add_reciver', (req, res) => {

   const db = mongoose.connection;

   // console.log(req.body.d_name);
   const name = req.body.p_name;
   const dob = req.body.p_dob;
   const adhar_no = req.body.p_adhar_no;
   const phone = req.body.p_phone;
   const country = req.body.p_country;
   const state = req.body.p_state;
   const district = req.body.p_district;
   const taluk = req.body.p_taluk;
   const pincode = req.body.p_pincode
   const address = req.body.p_address;
   const blood_type = req.body.p_blood_type;
   const recived_blood_unit = req.body.recived_blood_unit;




   const reciver_data = {
      "donor_name": name,
      "date_of_birth": dob,
      "adhar_no": adhar_no,
      "phone": phone,
      "country": country,
      "state": state,
      "district": district,
      "taluk": taluk,
      "pincode": pincode,
      "address": address,
      "blood_type": blood_type,
      "unit_of_blood": recived_blood_unit,

   }

   //we can add stack in theis section



   // app.get('/stocks', (req, res) => {
   //    const db = mongoose.connection;

   //    db.collection('add_donor').find().toArray((err, result) => {
   //       res.render('donor_details', { data: 'result' });
   //       console.log(result[0].unit_of_blood);

   //    })
   // })




   //insert data to mongodb

   //creation of index
   // const b = db.collection('add_donor').createIndex({ "email": 1, "phone": 1 }, { "unique": true })

   db.collection('reciver').insertOne(reciver_data, (err, collection) => {
      if (err) throw err;
      console.log("patient details added Successfully");
   });
   return res.redirect('/reciver');
})



app.get('/reciver', (req, res) => {
   // const db = mongoose.connection;
   res.render('reciver')
   // db.collection('reciver').find().toArray((err, result) => {
   //    db.collection('add_donor').find().toArray((err,results)=>{

   //    res.render('reciver', { donor: results,reciver:result });
   //    const a=results[0].unit_of_blood
   //    const b =result[0].unit_of_blood
   //    console.log(a-b);

   // })
   

   })
// })






//routing 

app.get('/', (req, res) => {

   res.render('signup.html');
})

app.get('/login', (req, res) => {
   res.render('login.html');
})


app.get('/donor/add_donors', (req, res) => {
   res.render('add_donors.html');

})

app.get('/donor/update_donors', (req, res) => {
   res.render('update_donors.html');
})
app.get('/donor/donor_details', (req, res) => {
   res.render('donor_details.html');

})
app.get('/stocks', (req, res) => {
   res.render('stocks.html');

})










app.get('*', function (req, res) {
   res.status(404).render('404-error.html');
});
   app.listen(port, () => {
      console.log(`server listening at port ${port}`);
   })







