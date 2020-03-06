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




var savedresults = []
app.get("/searchResults", function(req, res){
  console.log(savedresults)
    let big_sql = 

        `SELECT * 
        FROM OneWayFlights one 
        JOIN OneWayFlights two ON 
        one.destination = two.origin 
        WHERE one.origin = '${savedresults[0].origin}' 
        AND two.destination = '${savedresults[0].destination}'`
    // `SELECT * FROM (
    //     (SELECT *
    //     FROM OneWayFlights 
    //     WHERE origin = '${savedresults[0].origin}') AS one JOIN
    //     (SELECT *
    //     FROM OneWayFlights
    //     WHERE destination = '${savedresults[0].destination}') AS two ON 
    //     one.destination = two.origin
    // )`


    let small_sql = `SELECT * from OneWayFlights WHERE origin = '${savedresults[0].origin}' and destination = '${savedresults[0].destination}' Order By origin ASC`

    db.all(small_sql, function(err,row){
        if (err) throw err;
       
        if (row.length != 0){
            res.render("searchResults", {savedresults:row})
            savedresults = []

            console.log(row)
        }

        else{
            
            res.redirect("/search")
        }

     })

    savedresults = []
});

app.get("/", function(req, res){




	let sql = `SELECT DISTINCT origin from OneWayFlights Order By origin ASC`


    db.all(sql,function(err,row){
        if (err) throw err;
       res.render('index', { oneWayFlights: row });
     })

	// res.render("search", {oneWayFlights:oneWayFlights});


});


app.post("/searchResults", function(req, res){
    var tripchoice = req.body.tripchoice;
    var origin = req.body.origin;
    var destination = req.body.destination;
    var aresult = {tripchoice:tripchoice, origin:origin, destination:destination};
    savedresults.push(aresult);
    res.redirect("/searchResults");

});




app.get("/aboutpage", function(req, res){
    res.render("aboutpage");


});


app.get("/info", function(req, res){

    res.render("info");


});
var paymentinfo=[]

// app.post('/info', function(req, res){
//     var name = req.body.name;
//     var age = req.body.age;
//     var gender = req.body.gender;
//     var nationality = req.body.nationality;
//     var phone = req.body.phone;
//     var address1 = req.body.address1;
//     var address2 = req.body.address2;
//     var country = req.body.country;
//     var province = req.body.province;
//     var postalcode = req.body.postalcode;
//     var email = req.body.email;

//     var save_result = {name:name, age:age, gender:gender, nationality:nationality, phone:phone, address1:address1, address2:address2, country:country, province:province, postalcode:postalcode, email:email}
    
//     // push info into payment array
//     paymentinfo.push(save_result);
//     res.redirect("/payment")
    
// })

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

    var save_result = {name:name, age:age, gender:gender, nationality:nationality, phone:phone, address1:address1, address2:address2, country:country, province:province, postalcode:postalcode, email:email}
    
    // push info into payment array
    paymentinfo.push(save_result);
    res.redirect("/payment")
})



app.get("/payment", function(req, res){
    console.log("hello");

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
        Email ) 
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
            '${paymentinfo[0].email}'
            )`
    )

    res.render('payment');

});



app.post("/reserved", function(req, res){
    res.render("reserved");


});


app.listen(2020, function(){
	console.log("The server has started at port 2020");
});