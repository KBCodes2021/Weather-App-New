//jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

          app.post("/", function(req, res){
            const query = req.body.cityName;
            const unit = "metric";
            const apiKey = process.env.NODE_APP_SECRETAPI
            const url = process.env.NODE_APP_SECRETURL + apiKey + "&q=" + query + "&units=" + unit;

            https.get(url, function(response){
              console.log(response.statusCode);

              if (response.statusCode === 200) {
                response.on("data", function(data){

                  const weatherData =  JSON.parse(data);
                  const temp = weatherData.main.temp;
                  const weatherDescription = weatherData.weather[0].description;
                  const icon = weatherData.weather[0].icon;
                  const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                  res.write("<p>The weather is currently " + weatherDescription + "</p>");
                  res.write("<h1>The temperature in " +  query + " is " + temp + "  degrees Celcius.</h1>");
                  res.write("<img src=" + imageURL + ">");
                  res.send();


                });



              } else {
                res.sendFile(__dirname + "/failure.html");
              }
            });


          });

          app.post("/success", function(req, res){
            res.redirect("/");
          });

          app.post("/failure", function(req, res) {
            res.redirect("/");
          });


          app.listen(process.env.PORT || 3000, function(){
            console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
          });
