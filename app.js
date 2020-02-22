

const express = require("express");
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended: false})
const app = express();
var server = require('http').Server(app);
fs = require('fs')
server.listen(12345)




/* connecting to the database */
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('Airprairiess.db3', (err) => {
    if (err){
        return console.error("unable to connect");
    }
    console.log('connected to database');
});



 /* Displaying information of User  table*/


let sql = `SELECT DISTINCT origin dep FROM OneWayFlights ORDER BY dep`; // Querying from the database


var a_array = []
db.all(sql,[],(err, rows) => {

    if (err){
        throw err;
    }

    // console.log("db.all")
    rows.forEach((row)=>{
        // console.log(row.id, row.age)
        a_array.push(row.dep)
   

    });

    app.get('/User.html', function (req, res){

        res.send(
   
           `<!DOCTYPE html>
           <html>
                <body>
                   

                   <form >

                    <label for="name">departure location:</label>
                    <select id = "activity">
                        <option value = ""> ------ Select -------</option>

                    </select>

                    <br>

                    <!-- ######### Arrival section ##### -->

                    <label for="name">destination location:</label>
                    <select id = "activity1" >
                        <option value = ""> ------ Select -------</option>


                    </select>

                    <br>
                    <label for="party">Choose your departure_date:
                        <input type="date" name="party" min="2020-01-01" max="2022-04-30">
                    </label>

                    <br>
                    <input class = "button" id = "sub" type ="button" name = "Subbmit" value = "Subbmit">

                </form>


                <script type="text/javascript">

                        string1 = '${a_array}'.split(",");
                        var select = document.getElementById("activity");
               
                        for (var i = 0; i < string1.length; i++){

                            var opt = string1[i];
                            var el = document.createElement("option")
                            el.textContent = opt;
                            el.value = opt;
                            select.appendChild(el);
                        }

                    // reading from the dropdown menu
                       
                        var sub = document.getElementById("activity").onclick = function(){displayresult()}

                        function displayresult(){

                       
                        var x = document.getElementById("activity")
                        var save = x.options["selectedIndex"]
                        var result = document.getElementById("activity").options[save].text
                        console.log(result)
}

                    </script>

                </body>
            <html>`    

        )
        
    })
       
});


 app.get('/Confirmation.html', function (req, res){
     
     console.log(req.body)
     console.log("help")
     res.render('Confirmation-success', {data: req.body});
     
 })


db.close();



