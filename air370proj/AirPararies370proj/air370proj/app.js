var nodemailer = require("nodemailer")
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('Airprairiess.db3', (err) => {
 if (err){
 return console.error("unable to connect");
 }
 console.log('connected to database')
})



var savedresults = [];
var flightinfo=[];


app.get("/searchResults", function(req, res){
 console.log(savedresults)
 var choice = savedresults[0].tripchoice;
 console.log(choice);

 if (choice=="oneway"){


 let special1 = `
 SELECT *
 FROM(
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].origin}" AND destination="Saskatoon"
 
 UNION
 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Saskatoon" AND F2.destination="${savedresults[0].destination}"
 ) AND destination="${savedresults[0].destination}"
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="Saskatoon" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Saskatoon" AND F2.destination="${savedresults[0].destination}"
 ))
 ORDER BY origin
 
 
 `



 let special2 = `
 
 SELECT *
 FROM(
 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].origin}" AND destination="Calgary"
 
 UNION
 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Calgary" AND F2.destination="${savedresults[0].destination}"
 ) AND destination="${savedresults[0].destination}"
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="Calgary" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Calgary" AND F2.destination="${savedresults[0].destination}"
 ))
 ORDER BY origin
 `

 
 let big_sql = 
 
 ` SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].origin}" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="${savedresults[0].origin}" AND F2.destination="${savedresults[0].destination}"
 )
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="${savedresults[0].origin}" AND F2.destination="${savedresults[0].destination}"
 ) AND destination="${savedresults[0].destination}"
 
 `
 
 let small_sql = `SELECT * from OneWayFlights WHERE origin = '${savedresults[0].origin}' and destination = '${savedresults[0].destination}' Order By origin ASC`
 
 
 db.all(small_sql, function(err,row){
 if (err) throw err;
 
 if (row.length != 0){
 flightinfo.push(row)
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []
 
 
 }

 else if ( row.length==0 && (savedresults[0].origin=="Vancouver" || savedresults[0].origin=="Toronto" || savedresults[0].origin=="Montreal") &&
 (savedresults[0].destination=="Amsterdam" || savedresults[0].destination=="Barcelona" || savedresults[0].destination=="Frankfurt" 
 || savedresults[0].destination=="Seattle" || savedresults[0].destination=="Houston" || savedresults[0].destination=="YellowKnife" ||
 savedresults[0].destination=="Chicago" || savedresults[0].destination=="New York" || savedresults[0].destination=="Miami" ||
 savedresults[0].destination=="Mexico City" || savedresults[0].destination=="Cancun" || savedresults[0].destination=="Paris" ||
 savedresults[0].destination=="London" || savedresults[0].destination=="Prague" || savedresults[0].destination=="Stockholm"
 || savedresults[0].destination=="Rome" || savedresults[0].destination=="Munich")){


 specialCase1Query()
 }
 
 else if ( row.length==0 && (savedresults[0].origin=="Amsterdam" || savedresults[0].origin=="Barcelona" || savedresults[0].origin=="Frankfurt" 
 || savedresults[0].origin=="Seattle" || savedresults[0].origin=="Houston" || savedresults[0].origin=="YellowKnife" ||
 savedresults[0].origin=="Chicago" || savedresults[0].origin=="New York" || savedresults[0].origin=="Miami" ||
 savedresults[0].origin=="Mexico City" || savedresults[0].origin=="Cancun" || savedresults[0].origin=="Paris" ||
 savedresults[0].origin=="London" || savedresults[0].origin=="Prague" || savedresults[0].origin=="Stockholm"
 || savedresults[0].origin=="Rome" || savedresults[0].origin=="Munich") && 
 (savedresults[0].destination=="Vancouver" || savedresults[0].destination=="Toronto" || savedresults[0].destination=="Montreal") 
 ){
 specialCase2Query()

 }

 
 else{
 biggerquery()
 }
 
 });
 
 function biggerquery(){
 
 db.all(big_sql, function(err,row){
 if (err) throw err;
 
 console.log("reached")
 if (row.length != 0){
 flightinfo.push(row)
 
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []
 
 
 
 }
 
 else{
 
 res.redirect("/search")
 }
 
 
 });

 
 
 }


 function specialCase1Query(){

 db.all(special1, function(err,row){
 if (err) throw err;
 
 console.log("reached")
 if (row.length != 0){
 flightinfo.push(row)
 
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []


 
 }

 else{
 
 res.redirect("/search")
 }
 
 
 });



 }


 function specialCase2Query(){
 db.all(special2, function(err,row){
 if (err) throw err;
 
 console.log("reached")
 if (row.length != 0){
 flightinfo.push(row)
 
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []


 
 }

 else{
 
 res.redirect("/search")
 }
 
 
 });


 }





 } else{




 let special1 = `
 SELECT *
 FROM(
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].origin}" AND destination="Saskatoon"
 
 UNION
 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Saskatoon" AND F2.destination="${savedresults[0].destination}"
 ) AND destination="${savedresults[0].destination}"
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="Saskatoon" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Saskatoon" AND F2.destination="${savedresults[0].destination}"
 ))
 


 UNION



 SELECT *
 FROM(
 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].destination}" AND destination="Calgary"
 
 UNION
 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Calgary" AND F2.destination="${savedresults[0].origin}"
 ) AND destination="${savedresults[0].origin}"
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="Calgary" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Calgary" AND F2.destination="${savedresults[0].origin}"
 ))
 ORDER BY destination


 
 
 `



 let special2 = `
 
 SELECT *
 FROM(
 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].origin}" AND destination="Calgary"
 
 UNION
 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Calgary" AND F2.destination="${savedresults[0].destination}"
 ) AND destination="${savedresults[0].destination}"
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="Calgary" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Calgary" AND F2.destination="${savedresults[0].destination}"
 ))
 



 UNION





 SELECT *
 FROM(
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].destination}" AND destination="Saskatoon"
 
 UNION
 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Saskatoon" AND F2.destination="${savedresults[0].origin}"
 ) AND destination="${savedresults[0].origin}"
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="Saskatoon" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="Saskatoon" AND F2.destination="${savedresults[0].origin}"
 ))
 ORDER BY destination

 `

 
 let big_sql = 
 
 `
 
 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].origin}" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="${savedresults[0].origin}" AND F2.destination="${savedresults[0].destination}"
 )
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="${savedresults[0].origin}" AND F2.destination="${savedresults[0].destination}"
 ) AND destination="${savedresults[0].destination}"





 UNION





 SELECT *
 FROM OneWayFlights
 WHERE origin="${savedresults[0].destination}" AND destination=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="${savedresults[0].destination}" AND F2.destination="${savedresults[0].origin}"
 )
 
 UNION 
 
 SELECT *
 FROM OneWayFlights
 WHERE origin=(
 
 SELECT F1.destination AS stop
 FROM OneWayFlights F1
 JOIN OneWayFlights F2 ON F2.origin = F1.destination
 WHERE F1.origin="${savedresults[0].destination}" AND F2.destination="${savedresults[0].origin}"
 ) AND destination="${savedresults[0].origin}"

 ORDER BY origin

 
 `
 
 let small_sql = `
 SELECT * 
 FROM OneWayFlights 
 WHERE origin = '${savedresults[0].origin}' AND destination = '${savedresults[0].destination}' 
 
 
 
 UNION


 SELECT * 
 FROM OneWayFlights 
 WHERE origin = '${savedresults[0].destination}' AND destination = '${savedresults[0].origin}' 
 Order By origin ASC
 
 
 `
 
 
 db.all(small_sql, function(err,row){
 if (err) throw err;
 
 if (row.length != 0){
 flightinfo.push(row)
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []
 
 }

 else if ( row.length==0 && (savedresults[0].origin=="Vancouver" || savedresults[0].origin=="Toronto" || savedresults[0].origin=="Montreal") &&
 (savedresults[0].destination=="Amsterdam" || savedresults[0].destination=="Barcelona" || savedresults[0].destination=="Frankfurt" 
 || savedresults[0].destination=="Seattle" || savedresults[0].destination=="Houston" || savedresults[0].destination=="YellowKnife" ||
 savedresults[0].destination=="Chicago" || savedresults[0].destination=="New York" || savedresults[0].destination=="Miami" ||
 savedresults[0].destination=="Mexico City" || savedresults[0].destination=="Cancun" || savedresults[0].destination=="Paris" ||
 savedresults[0].destination=="London" || savedresults[0].destination=="Prague" || savedresults[0].destination=="Stockholm"
 || savedresults[0].destination=="Rome" || savedresults[0].destination=="Munich")){

 specialCase1Query()
 }
 
 else if ( row.length==0 && (savedresults[0].origin=="Amsterdam" || savedresults[0].origin=="Barcelona" || savedresults[0].origin=="Frankfurt" 
 || savedresults[0].origin=="Seattle" || savedresults[0].origin=="Houston" || savedresults[0].origin=="YellowKnife" ||
 savedresults[0].origin=="Chicago" || savedresults[0].origin=="New York" || savedresults[0].origin=="Miami" ||
 savedresults[0].origin=="Mexico City" || savedresults[0].origin=="Cancun" || savedresults[0].origin=="Paris" ||
 savedresults[0].origin=="London" || savedresults[0].origin=="Prague" || savedresults[0].origin=="Stockholm"
 || savedresults[0].origin=="Rome" || savedresults[0].origin=="Munich") && 
 (savedresults[0].destination=="Vancouver" || savedresults[0].destination=="Toronto" || savedresults[0].destination=="Montreal") 
 ){
 specialCase2Query()

 }

 
 else{
 biggerquery()
 }
 
 });
 
 function biggerquery(){
 
 db.all(big_sql, function(err,row){
 if (err) throw err;
 
 console.log("reached")
 if (row.length != 0){
 flightinfo.push(row)
 
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []
 
 
 
 }
 
 else{
 
 res.redirect("/search")
 }
 
 
 });

 
 }


 function specialCase1Query(){

 db.all(special1, function(err,row){
 if (err) throw err;
 
 console.log("reached")
 if (row.length != 0){
 flightinfo.push(row)
 
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []


 
 }

 else{
 
 res.redirect("/search")
 }
 
 
 });



 }


 function specialCase2Query(){
 db.all(special2, function(err,row){
 if (err) throw err;
 
 console.log("reached")
 if (row.length != 0){
 flightinfo.push(row)
 
 res.render("searchResults", {savedresults:row, choice:choice})
 savedresults.push(row)
 savedresults = []


 
 }

 else{
 
 res.redirect("/search")
 }
 
 
 });


 }


 
 }


 
 });

 

 


app.get("/search", function(req, res){


 let sql = `SELECT DISTINCT origin from OneWayFlights Order By origin ASC`


 db.all(sql,function(err,row){
 if (err) throw err;
 res.render('search', { oneWayFlights: row });
 })

 


});


app.post("/searchResults", function(req, res){
 // the input information from the search page
 var tripchoice = req.body.tripchoice;
 var origin = req.body.origin;
 var destination = req.body.destination;
 var aresult = {tripchoice:tripchoice, origin:origin, destination:destination};
 savedresults.push(aresult);
 // dislay results here
 res.redirect("/searchResults");

});


app.get("/aboutpage", function(req, res){
 res.render("aboutpage");

});


app.get("/info", function(req, res){

 res.render("info");


});


var paymentinfo=[]

app.post("/payment", function(req, res){
    var name = req.body.name;
    var age = req.body.age;
    var gender = req.body.gender;
    var nationality = req.body.nationality;
    var phone = req.body.phone;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var country = req.body.country;
    var province = req.body.province;
    var postalcode = req.body.postalcode;
    var email = req.body.email;

    var flightnumber = [];

    for (var i=0; i<flightinfo[0].length; i++){

        flightnumber.push(flightinfo[0][i].flightnumber);

    }
    
    var save_result = {name:name, age:age, gender:gender, nationality:nationality, phone:phone, address1:address1, address2:address2, country:country, province:province, postalcode:postalcode, email:email, flightnumber:flightnumber}
    
    // push info into payment array
    paymentinfo.push(save_result);
    res.redirect("/payment")
})



app.get("/payment", function(req, res){
    // Inserting the customer personal inut information into the Bookings table in the database.
    console.log(paymentinfo)
    console.log("payment: \n" +Object.keys(paymentinfo[0].flightnumber).length)

    for (var i=0; i<(Object.keys(paymentinfo[0].flightnumber).length); i++){

    db.run(`INSERT INTO Bookings (
    Name, 
    age, 
    gender, 
    Nationality, 
    [Phone Number], 
    Address1, 
    Address2, 
    Country, 
    [Province/Territory], 
    [Postal Code],
    Email, 
    flightnumber) 
    VALUES(
    '${paymentinfo[0].name}', 
    '${paymentinfo[0].age}',
    '${paymentinfo[0].gender}',
    '${paymentinfo[0].nationality}',
    '${paymentinfo[0].phone}',
    '${paymentinfo[0].address1}',
    '${paymentinfo[0].address2}',
    '${paymentinfo[0].country}',
    '${paymentinfo[0].province}',
    '${paymentinfo[0].postalcode}',
    '${paymentinfo[0].email}',
    '${paymentinfo[0].flightnumber[i]}'
    )`
    )
    }
    res.render('payment');

});


app.post("/reserved", function(req, res){
    let sql = `SELECT MAX(bookingId) as save from bookings`

    var book_ref 
    console.log("reached")
    db.all(sql,function(err,row){
        book_ref = row
        console.log(book_ref[0].save)

        
     res.render("reserved");

     var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
    
    auth:{
        user: 'airprairies@gmail.com',
        pass: 'ajnw#0206'
    }
})

var mailOptions = {
    from: 'airprairies@gmail.com',
    to: `${paymentinfo[0].email},`,
    subject:'confirm',
    text: `your booking has now been confirmed. Your booking reference is ${book_ref[0].save} and your flight number is ${flightinfo.flightnumber} Thank you for flying with us` 
};

console.log("hello")
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}) 

});

app.get('/reserved', function(req, res){

})


// render the reference page.



var ref_info = []

app.get('/reference', function(req, res){
    res.render('reference')
})

app.post('/reference', function(req, res){
    var flightnumber = req.body.flightnumber
    var bookingid = req.body.bookingid
    var save = {flightnumber:flightnumber, bookingid:bookingid}

    ref_info.push(save);   
    res.redirect("/result")
})

app.get('/result', function(req, res){
    
    console.log(ref_info[0].bookingid)
    if (ref_info != []){
    let sql =  `SELECT OneWayFlights.* FROM OneWayFlights 
                JOIN Bookings on OneWayFlights.flightnumber = Bookings.flightnumber
                WHERE Bookings.bookingid = '${ref_info[0].bookingid}' `
    
    db.all(sql,function(err,row){
        console.log(row)
        if (err) throw err;
        res.render('result', {ref_info:row });
        })
    }

})


app.listen(2020, function(){
    console.log("The server has started");
});
