const express = require("express");
const app = express()
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const port = 5000
const path = require('path');
const ejs = require('ejs');
const url = require('url');
const { rmSync } = require("fs");


//data base connectionie mongodb
require('./db/connection')

//------------------------------------------------------------------------------------------

//public file initializatiomn ie js css files
let public_path = path.join(__dirname, '../public')
app.use(express.static(public_path + '/CSS'))
app.use(express.static(public_path + '/js'))

//------------------------------------------------------------------------------------------

//dynamiclly pass data using ejs
let html_path = path.join(__dirname, '../templates/views/pages')
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
app.get('/', (req, res) => {

   res.render('signup', { msg: '' });

})

app.post('/signed', function (req, res) {

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
   //unique email
   const db = mongoose.connection;

   db.collection('admin').find({ "email": email }).toArray((err, result) => {
      if (result.length == 0) {

         //insert data to mongodb

         db.collection('admin').insertOne(data, (err, result) => {
            if (err) throw err;
            console.log("Record inserted Successfully");
            const id = result.insertedId;
            const redirect = `/stocks?${id}`
            // console.log(redirect);
            // return res.status(200).render('home.html',{admin_id:id});
            res.redirect(redirect)

         });
      }
      else {
         res.render('signup', { msg: 'email alredy exist' });
         console.log('email alredy exist');
      }
   })
})


// app.get('/home', (req, res) => {

//    var urls = req.url

//    console.log(urls);
//    res.render('stocks', { admin_id: urls });
//    const db = mongoose.connection;

// })
//------------------------------------------------------------------------------------------

//login
app.get('/login', function (req, res) {
   return res.render('login', { msg: '' });
})
app.post('/home-login', function (req, res) {
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
         // res.send("email not exist")
         return res.render('login', { msg: 'email not exist' });

      }

      //login succefully
      else if (result[0].email === email && result[0].password === password) {
         //to genarate admin id and push to home page url
         const db = mongoose.connection;
         db.collection('admin').find({ email: email }).toArray((err, data2) => {
            const url_path = `/stocks?${data2[0]._id}`
            res.redirect(url_path)
            console.log(data2[0]._id);
         })
      }
      //possword is wrong
      else if (result[0].email === email && result[0].password !== password) {
         return res.render('login', { msg: 'password wrong' });


      }

   });
});

//------------------------------------------------------------------------------------------
//add donor details


app.get('/donor/add_donors', function (req, res) {
   return res.render('add_donors', { msg: '' });

})


app.post('/donor/add_donors', function (req, res) {

   const db = mongoose.connection;

   // console.log(req.body.d_name);
   const admin_id = req.body.admin_id;
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
   const date = new Date();
   const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

   const add_donor_data = {
      "admin_id": admin_id,
      "donor_name": name,
      "date_of_birth": dob,
      "donation_date": today_date,
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
      'satus': 'Approved'

   }


   db.collection('add_donor').insertOne(add_donor_data, (err, result) => {

      if (err) throw err;
      return res.render('cirtificate', { name: name, donate_date: today_date, msg: "added successfully" });

   });
})
//---------------------------------------------------------------------------------


//reuest section

app.get('/donor_request', (req, res) => {
   const db = mongoose.connection;

   db.collection('donor_request').find().toArray((err, result) => {
      console.log(result.length);
      res.render('donor_request', { data: result, msg: '' });
   })
})

//verification through token number
app.get('/donor_request_approve', (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const approved_id = mongoose.Types.ObjectId(user_id);//convert string to objectid

   const admin_id = queryObject.admin_id
   const token_no = queryObject.token
   console.log(approved_id);
   const db = mongoose.connection;

   db.collection('donor_request').find({ _id: approved_id }).toArray((err, result) => {

      result[0].admin_id = admin_id
      result[0].status = 'Approved'
      const date = new Date();
      const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
      result[0].donation_date = today_date

      console.log(result[0].admin_id);
      db.collection('donor_varification').insertOne(result[0], (err, a) => {
         if (err) throw err;
         db.collection('donor_request').deleteOne({ _id: approved_id }, (err, data) => {
            //show remaining request on webpage 

            db.collection('donor_request').find().toArray((err, result) => {
               console.log(result.length);
               res.render('donor_request', { data: result, msg: 'Request approved' });
            })
         })
      });
   });
})



//request rejecttion
app.get('/reject', (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const approved_id = mongoose.Types.ObjectId(user_id);//convert string to objectid
   db.collection('donor_request').deleteOne({ _id: approved_id }, (err, data) => {
      //show remaining request on webpage 
      db.collection('donor_request').find().toArray((err, result) => {
         console.log(result.length);
         res.render('donor_request', { data: result, msg: 'Rejected' });
      })
   })
})





//patient request
app.get('/patient_request', (req, res) => {
   const db = mongoose.connection;

   db.collection('patient_request').find().toArray((err, result) => {
      console.log(result.length);
      res.render('patient_request', { data: result, msg: '' });
   })
})




//verification through token number
app.get('/patient_request_approve', (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const admin_id = queryObject.admin_id
   const token_no = queryObject.token
   const approved_id = mongoose.Types.ObjectId(user_id);//convert string to objectid


   const db = mongoose.connection;

   db.collection('patient_request').find({ _id: approved_id }).toArray((err, result) => {
      result[0].admin_id = admin_id
      result[0].status = 'Approved'
      const date = new Date();
      const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
      result[0].donation_date = today_date

      db.collection('patient_varification').insertOne(result[0], (err, a) => {
         if (err) throw err;
         db.collection('patient_request').deleteOne({ _id: approved_id }, (err, data) => {
            //show remaining request on webpage 

            db.collection('patient_request').find().toArray((err, result) => {
               console.log(result.length);
               res.render('patient_request', { data: result, msg: 'Request approved' });
            })
         })
      });
   });

})



//-------------------------------------------
//varify section

app.get('/donor_varification', (req, res) => {
   const db = mongoose.connection;

   db.collection('donor_varification').find().toArray((err, result) => {
      console.log(result.length);
      res.render('donor_varification', { data: result, msg: '' });
   })
})
//verification through token number
app.get('/donor_varified', (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const approved_id = mongoose.Types.ObjectId(user_id);//convert string to objectid

   const admin_id = queryObject.admin_id
   const token_no = queryObject.token


   if (token_no === user_id) {
      console.log(approved_id);
      const db = mongoose.connection;

      db.collection('donor_varification').find({ _id: approved_id }).toArray((err, result) => {

         result[0].admin_id = admin_id
         result[0].status = 'Varified'
         const date = new Date();
         const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
         result[0].donation_date = today_date

         console.log(result[0].admin_id);
         db.collection('add_donor').insertOne(result[0], (err, a) => {
            if (err) throw err;
            db.collection('donor_varification').deleteOne({ _id: approved_id }, (err, data) => {
               //show remaining request on webpage 

               db.collection('donor_varification').find().toArray((err, result) => {
                  console.log(result.length);
                  res.render('donor_varification', { data: result, msg: 'Request varified' });
               })
            })
         });
      });

   }
   else {
      const db = mongoose.connection;

      db.collection('donor_varification').find().toArray((err, result) => {
         console.log(result.length);
         res.render('donor_varification', { data: result, msg: 'Token No invalid' });
      })
   }
})




//patient varification
app.get('/patient_varification', (req, res) => {
   const db = mongoose.connection;

   db.collection('patient_varification').find().toArray((err, result) => {
      console.log(result.length);
      res.render('patient_varification', { data: result, msg: '' });
   })
})

//verification through token number
app.get('/patient_varified', (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const admin_id = queryObject.admin_id
   const token_no = queryObject.token
   const approved_id = mongoose.Types.ObjectId(user_id);//convert string to objectid


   if (token_no === user_id) {
      const db = mongoose.connection;

      db.collection('patient_varification').find({ _id: approved_id }).toArray((err, result) => {
         result[0].admin_id = admin_id
         result[0].status = 'Varified'
         const date = new Date();
         const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
         result[0].donation_date = today_date

         db.collection('reciver').insertOne(result[0], (err, a) => {
            if (err) throw err;
            db.collection('patient_varification').deleteOne({ _id: approved_id }, (err, data) => {
               //show remaining request on webpage 

               db.collection('patient_varification').find().toArray((err, result) => {
                  console.log(result.length);
                  res.render('patient_varification', { data: result, msg: 'Request Varified' });
               })
            })
         });
      });
   }
   else {
      const db = mongoose.connection;
      db.collection('patient_varification').find().toArray((err, result) => {
         console.log(result.length);
         res.render('patient_varification', { data: result, msg: 'Token No invalid' });
      })
   }
})
//----------------------------------------------------------------
//varification cancelation

//donor cancelation
app.get("/d_cancelation", (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const admin_id = queryObject.admin_id

   const approved_id = mongoose.Types.ObjectId(user_id);
   const db = mongoose.connection;

   db.collection('donor_varification').find({ _id: approved_id }).toArray((err, result) => {

      result[0].admin_id = admin_id
      result[0].status = 'Canceled'
      const date = new Date();
      result[0].donation_date = '---'

      db.collection('cancel').insertOne(result[0], (err, a) => {
         if (err) throw err;
         db.collection('donor_varification').deleteOne({ _id: approved_id }, (err, data) => {
            //show remaining request on webpage 

            db.collection('donor_varification').find().toArray((err, result) => {
               console.log(result.length);
               res.render('donor_varification', { data: result, msg: 'varification canceled' });
            })
         })
      });
   });
   
})
//patient cancelation
app.get("/p_cancelation", (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const admin_id = queryObject.admin_id

   const approved_id = mongoose.Types.ObjectId(user_id);
   const db = mongoose.connection;

   db.collection('patient_varification').find({ _id: approved_id }).toArray((err, result) => {

      result[0].admin_id = admin_id
      result[0].status = 'Canceled'
      const date = new Date();
      result[0].donation_date = '---'

      db.collection('cancel').insertOne(result[0], (err, a) => {
         if (err) throw err;
         db.collection('patient_varification').deleteOne({ _id: approved_id }, (err, data) => {
            //show remaining request on webpage 

            db.collection('patient_varification').find().toArray((err, result) => {
               console.log(result.length);
               res.render('patient_varification', { data: result, msg: 'varification canceled' });
            })
         })
      });
   });
   
})
//donor rejection
app.get("/d_rejection", (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const admin_id = queryObject.admin_id

   const approved_id = mongoose.Types.ObjectId(user_id);
   const db = mongoose.connection;

   db.collection('donor_request').find({ _id: approved_id }).toArray((err, result) => {

      result[0].admin_id = admin_id
      result[0].status = 'Rejected'
      const date = new Date();
      result[0].donation_date = '---'

      db.collection('cancel').insertOne(result[0], (err, a) => {
         if (err) throw err;
         db.collection('donor_request').deleteOne({ _id: approved_id }, (err, data) => {
            //show remaining request on webpage 

            db.collection('donor_request').find().toArray((err, result) => {
               console.log(result.length);
               res.render('donor_request', { data: result, msg: 'Request Rejected' });
            })
         })
      });
   });
   
})
//patient rejection
app.get("/p_rejection", (req, res) => {
   const queryObject = url.parse(req.url, true).query;//url param
   const user_id = queryObject.u_id
   const admin_id = queryObject.admin_id

   const approved_id = mongoose.Types.ObjectId(user_id);
   const db = mongoose.connection;
   db.collection('patient_request').find({ _id: approved_id }).toArray((err, result) => {

      result[0].admin_id = admin_id
      result[0].status = 'Rejected'
      const date = new Date();
      result[0].donation_date = '---'

      db.collection('cancel').insertOne(result[0], (err, a) => {
         if (err) throw err;
         db.collection('patient_request').deleteOne({ _id: approved_id }, (err, data) => {
            //show remaining request on webpage 

            db.collection('patient_request').find().toArray((err, result) => {
               console.log(result.length);
               res.render('patient_request', { data: result, msg: 'Request Rejected' });
            })
         })
      });
   });
   
})

//-------------------------------------------------------------------------------------------------------














//update donor using their id


//pass id to url
app.get('/donor/update_donors', (req, res) => {
   const db = mongoose.connection;
   res.render('searchin_id', { msg: '', success: '' });

})


//fetch id from the url

app.get(`/donor/update_donors/details`, (req, res) => {
   const db = mongoose.connection;
   // const queryObject = url.parse(req.url, true).query;//url param
   // enterd_id = queryObject._id
   // console.log(queryObject._id);
   // const string_id = mongoose.Types.ObjectId(enterd_id);//convert string to objectid


   const param_obj = url.parse(req.url, true).query;//url param
   const adhar_no = param_obj._id;
   const admin_id = param_obj.a_id

   console.log(adhar_no);

   // res.send(adhar_no);

   db.collection('add_donor').find({ adhar_no: adhar_no, admin_id: admin_id }).toArray((err, result) => {


      // const db = mongoose.connection;




      db.collection('admin').find().toArray((err, result) => {
         console.log(result);
         result.forEach((e) => {
            console.log(e);
         })
      })
      // console.log(result.adhar_no == adhar_no);
      if (result.length !== 0) {
         res.render('update_donors', { data: result });
         // console.log(result[0].address);
      } else if (result.length === 0) {
         res.render('searchin_id', { msg: "Adhar Number invalid...!", success: '' });

         // res.send("adhar no is invalid...!")


      }
   })
})





//update donor details

app.post(`/donor/update_donors/details/updated`, (req, res) => {
   const db = mongoose.connection;

   const name = req.body.d_name;
   const admin_id = req.body.admin_id;
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
   const date = new Date();
   const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

   const updated_data = {
      "admin_id": admin_id,
      "donor_name": name,
      "donation_date": today_date,
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
   }
   db.collection('add_donor').updateMany({ adhar_no: adhar_no }, { $set: updated_data }, { multi: true }, function (err) {
      if (err) { throw err; }

      db.collection('add_donor').find({ adhar_no: adhar_no, admin_id: admin_id }).toArray((err, result) => {
         // console.log((itm._id.toString() === enterd_id) + " " + i);
         res.render('searchin_id', { msg: '', success: 'updated successfully....' });
      })
   })
});



//--------------------------------------------------------------------------------------------
// all donors bio data



app.get('/donor/donor_details', (req, res) => {
   const db = mongoose.connection;
   const queryObject = url.parse(req.url, true).query;//url param
   admin_id = queryObject.a
   // const admin_id = mongoose.Types.ObjectId(enterd_id);//convert string to objectid
   // console.log(admin_id);
   db.collection('add_donor').find({ admin_id: admin_id }).toArray((err, result) => {

      res.render('donor_details', { data: result });
      console.log(result);

   })
})

app.get('/home', (req, res) => {
   res.render('home.html')
})
app.get('/stocks', (req, res) => {
   var urls = req.url

   console.log(urls);
   // res.render('stocks', { admin_id: urls });
   const db = mongoose.connection;



   db.collection('reciver').find().toArray((err, result2) => {
      db.collection('patient_request').find().toArray((err, result3) => {
         db.collection('donor_request').find().toArray((err, result4) => {
            db.collection('add_donor').find({ status: 'Approved' }).toArray((err, result5) => {
               db.collection('reciver').find({ status: 'Approved' }).toArray((err, result6) => {


                  db.collection('add_donor').find().toArray((err, result) => {
                     const patient_request = result3.length
                     const donor_request = result4.length
                     const total_request = patient_request + donor_request
                     const total_approved = result5.length + result6.length
                     const total_donors = result.length
                     const total_patients = result2.length

                     // const total_units = 



                     res.render('stocks', { admin_id: urls, donated: result, recived: result2, request: total_request, approved: total_approved, donors: total_donors, patients: total_patients });


                  })
               })
            })
         })
      })
   })
})

//----------------------------------------------------------------------------------

//search by location

app.get('/search_by_location', (req, res) => {
   const db = mongoose.connection;

   db.collection('add_donor').find().toArray((err, result) => {
      res.render('search_by_location', { msg: "" });

   })
})
app.get(`/search_by_location/details`, (req, res) => {
   // const db = mongoose.connection;
   const queryObject = url.parse(req.url, true).query;
   // console.log(queryObject._id);
   enterd_location = queryObject.d_pincode
   const admin_id = queryObject.a_id
   console.log(admin_id);
   const db = mongoose.connection;

   db.collection('add_donor').find({ pincode: enterd_location, admin_id: admin_id }).toArray((err, result) => {
      console.log(result);
      if (result.length !== 0) {
         res.render('search_by_location_details', { data: result });

      } else {

         // res.send("record not found")
         res.render('search_by_location', { msg: 'record not found' });


      }

   })
})

//----------------------------------------------------------------------------------


//search by blood group


app.get('/search_by_blood_group', (req, res) => {
   const db = mongoose.connection;

   db.collection('add_donor').find().toArray((err, result) => {
      res.render('search_by_blood_group', { msg: "" });


   })
})

app.get(`/search_by_blood_group/details`, (req, res) => {
   const queryObject = url.parse(req.url, true).query;
   enterd_blood_group = queryObject.d_blood_type

   const admin_id = queryObject.a_id
   const db = mongoose.connection;

   db.collection('add_donor').find({ blood_type: enterd_blood_group, admin_id: admin_id }).toArray((err, result) => {
      // console.log(result.length);
      if (result.length !== 0) {
         res.render('search_by_blood_group_details', { data: result });

      } else {
         // res.send("record not found")
         res.render('search_by_blood_group', { msg: "record not found" });

      }

   })
})

//--------------------------------------------------------------------------------------------
app.get('/reciver', (req, res) => {
   res.render('reciver')
})

app.post('/add_reciver', (req, res) => {

   const db = mongoose.connection;

   // console.log(req.body.d_name);
   const name = req.body.p_name;
   const admin_id = req.body.admin_id;
   const dob = req.body.p_dob;
   const adhar_no = req.body.p_adhar_no;
   const phone = req.body.p_phone;
   const country = req.body.p_country;
   const state = req.body.p_state;
   const district = req.body.p_district;
   const taluk = req.body.p_taluk;
   const pincode = req.body.p_pincode
   const address = req.body.p_address;
   const hospital = req.body.hospital;
   const disease = req.body.disease;
   const blood_type = req.body.p_blood_type;
   const recived_blood_unit = req.body.recived_blood_unit;
   const date = new Date();
   const today_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`



   const reciver_data = {
      "donor_name": name,
      "admin_id": admin_id,
      "donate_date": today_date,
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
      'hospital': hospital,
      'disease': disease,
      "unit_of_blood": recived_blood_unit,
      'satus': 'Success'

   }

   db.collection('reciver').insertOne(reciver_data, (err, collection) => {
      if (err) throw err;
      console.log("patient details added Successfully");
   });
   return res.redirect('/reciver');
})

//insert data to mongodb

//creation of index
// const b = db.collection('add_donor').createIndex({ "email": 1, "phone": 1 }, { "unique": true })






//------------------------------------------------------------------------------------------



//program section

app.get('/create_program', (req, res) => {
   res.render('program_creation', { msg: "" });

})
app.post('/create_program', (req, res) => {
   const db = mongoose.connection;
   const program_name = req.body.program_name;
   const program_date = req.body.program_date;
   const program_location = req.body.program_location;

   const program_data = {
      "program_name": program_name,
      "program_date": program_date,
      "program_location": program_location
   }

   db.collection('programs').insertOne(program_data, (err, collection) => {
      if (err) throw err;
      console.log("program uploaded Successfully");
      res.render('program_creation', { msg: "  Program  Created  " })
   });
})

//------------------------------------------------------------------------------------------


//view created program list and also delete the list

app.get('/program_list', (req, res) => {
   const db = mongoose.connection;

   db.collection('programs').find().toArray((err, result) => {
      console.log(result.length);
      res.render('programs', { data: result, msg: '' });



   })
})

app.get('/program_list_delete', (req, res) => {
   const db = mongoose.connection;

   const queryObject = url.parse(req.url, true).query;//url param
   url_id = queryObject.program_id
   const program_id = mongoose.Types.ObjectId(url_id);//convert string to objectid  
   console.log(program_id);
   db.collection('programs').deleteOne({ _id: program_id }, (err, result) => {
      db.collection('programs').find().toArray((err, result) => {
         res.render('programs', { data: result, msg: '  Function  Deleted  ' });

      })




   })
})





//------------------------------------------------------------------------------------------














app.get('/donor/update_donors', (req, res) => {
   res.render('update_donors.html');
})
app.get('/donor/donor_details', (req, res) => {
   res.render('donor_details.html');

})
app.get('/donor/donor_details/a', (req, res) => {
   res.render('empty.html');

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



