//const express = require("express");
//const app = express();
//var server = require('http').Server(app);
//fs = require('fs')
//server.listen(12345)
//
//
//const router = express.Router();
//const bodyParser = require('body-parser');
//
//
///* connecting to the database */
//const sqlite3 = require('sqlite3').verbose()
//let db = new sqlite3.Database('data.db', (err) => {
//    if (err){
//        return console.error("unable to connect");
//    }
//    console.log('connected to database');
//});
//
//
////doucment.getElementById().onclick = function(){
////    getActivity(tx)
////}
////
////var SelectActivity = ''
////function getActivity(tx) {
////            tx.executeSql('SELECT FlightId flyid FROM Flight', [], queryActivity, errorHandler);
////                function queryActivity(tx, results) {
////            var len = results.rows.length;
////            for (var i = 0; i < len; i++) {
////               var SelectActivity +='<option value="' + results.rows.item(i).flyid
////            }
////            //SelectActivity +="</Option";
////            document.getElementById("activity").innerHTML =SelectActivity;
////        }}


// Youcheng Liao
// 11220003
// yol474
// CMPT350

const express = require("express");
const app = express();
var server = require('http').Server(app);
fs = require('fs')
server.listen(12345)




/* connecting to the database */
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('data.db', (err) => {
    if (err){
        return console.error("unable to connect");
    }
    console.log('connected to database');
});






 /* Displaying information of User  table*/


let sql = `SELECT DISTINCT departure_place dep FROM Flight`; // Querying from the database


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
    console.log("reached")

    app.get('/User.html', function (req, res){

        res.send(
    
           `<!DOCTYPE html> 
           <html>
                <body>
                    
                     <p id = "array1">${a_array}</p>



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


                    <script type="text/javascript">
                        var save = document.getElementById("array1")
                        console.log("jelloL")
                        console.log(save.innerHTML)

                        string1 = save.innerHTML.split(",")

                        var select = document.getElementById("activity1");
                
                        for (var i = 0; i < string1.length; i++){

                            var opt = string1[i];
                            var el = document.createElement("option")
                            el.textContent = opt;
                            el.value = opt;
                            select.appendChild(el);
                        }


                    </script>
                    </select>

                    <br>


                    <label for="party">Choose your departure_date:
                        <input type="date" name="party" min="2020-01-01" max="2022-04-30">
                    </label>

                    <br>

                    <input class = "button" id = "sub" type ="button" name = "Subbmit" value = "Subbmit">

                </form>


                
                <script>


                </script>
            

                </select>

                <script type="text/javascript">
                        var save = document.getElementById("array1")
                        console.log("jelloL")
                        console.log(save.innerHTML)

                        string1 = save.innerHTML.split(",")

                        var select = document.getElementById("activity");
                
                        for (var i = 0; i < string1.length; i++){

                            var opt = string1[i];
                            var el = document.createElement("option")
                            el.textContent = opt;
                            el.value = opt;
                            select.appendChild(el);
                        }

                    // testing the subbmit button
                        
                        var sub = document.getElementById("activity").onclick = function(){displayresult()}

                        function displayresult(){

                        
                        var x = document.getElementById("activity")
                        var save = x.options["selectedIndex"]
                        var result = document.getElementById("activity").options[save].text
                        console.log(result)
                           

                    
                        let sql2 = ${`SELECT DISTINCT departure_place dep FROM Flight`} ; // Querying from the database
                        
                        console.log(sql2)
                        }

                    </script>


                </body>
            <html>`    
        )
    })
    
});





db.close();



