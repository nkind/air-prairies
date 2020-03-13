var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('Airprairiess.db3', (err) => {
    if (err){
        return console.error("unable to connect");
    }
    console.log('connected to database')
})


// variable use to store the results of qurries 
var savedresults = [];
var flightinfo=[];


app.get("/searchResults", function(req, res){
    console.log(savedresults)
  
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
      
  
      /* runing the smaller query to check if there is a direct flight
        from the origin to the destination
      */
      db.all(small_sql, function(err,row){
          if (err) throw err;

          // send the flight info to the search reuslt page
          if (row.length != 0){
              flightinfo.push(row)
  
              res.render("searchResults", {savedresults:row})
              savedresults.push(row)
              savedresults = []
  
              
          }
          /*no direct flight so, the bigger query is run to check 
          for connections*/
          else{
              biggerquery()
          }
  
      });
  
      function biggerquery(){
  
          db.all(big_sql, function(err,row){
              if (err) throw err;
              
              console.log("reached")

              // send the flight info to the search reuslt page
              if (row.length != 0){
                  flightinfo.push(row)
      
                  res.render("searchResults", {savedresults:row})
                  savedresults.push(row)
                  savedresults = []
  
  
                 
              }
            
              // no connection found redirect the user back to the search page
              else{
              
                  res.redirect("/")
              }
              
      
          });
  
      }
  

  
  });

 

    

/* Query to fill in the dropdown menu in the 
main page with the locations from the database*/
app.get("/", function(req, res){

    let sql = `SELECT DISTINCT origin from OneWayFlights Order By origin ASC`

    // send the locations to the search reuslt page
    db.all(sql,function(err,row){
        if (err) throw err;
       res.render('index', { oneWayFlights: row });
     })

    


});

/* get the user information from the form in the 
search page and add them into the savedresult array.*/
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



// render the about page
app.get("/about", function(req, res){
    res.render("aboutpage");


});


app.get("/info", function(req, res){

    res.render("info");


});


var paymentinfo=[]
/* adds the userinput from the information page 
to the paymentingo array*/
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
    var flightnumber = req.body.flightnumber;

    var save_result = {name:name, age:age, gender:gender, nationality:nationality, phone:phone, address1:address1, address2:address2, country:country, province:province, postalcode:postalcode, email:email, flightnumber:flightnumber}
    
    // push info into payment array
    paymentinfo.push(save_result);
    // render the payment page.
    res.redirect("/payment")
})



app.get("/payment", function(req, res){
    // Inserting the customerinformation into the Bookings table in the database.
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
            '${paymentinfo[0].flightnumber}'
            )`
    )

    res.render('payment');

});



app.post("/reserved", function(req, res){
    res.render("reserved");


});


app.listen(2020, function(){
    console.log("The server has started");
});