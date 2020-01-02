
const ex = require('express');
const bp = require('body-parser');
const OAuth = require('oauth');


const app = ex();
app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended:true}));
app.use(ex.static("public"));



app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});


var options = {weekday:'long', month:'long', day:'numeric', hour:'numeric', minute:'numeric'};
var d = new Date();
var day = d.toLocaleDateString("en-US",options);


app.post("/",function(req,res){
  var x = req.body.city;
  var y = req.body.country;

  var header = {"X-Yahoo-App-Id":"5h3fB872" };

  var request = new OAuth.OAuth(
    null,
    null,
    'dj0yJmk9Z2FEbEZNRFJwVmJyJmQ9WVdrOU5XZ3paa0k0TnpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWM5',
    '2f1daa0a3fa77aca44e095229b9769e630b749e4',
    '1.0',
    null,
    'HMAC-SHA1',
    null,
    header
  );


  var j = 'https://weather-ydn-yql.media.yahoo.com/forecastrss?location=';
  var k = '&format=json';
  var u = ',';
  var t = j+x+u+y+k;


  request.get(
        t,
        null,
        null,
        function (err, data, result) {
          if (err) {
            res.sendFile(__dirname + "/failure.html");
          } else {
            if (result.statusCode == 200) {
              var g = JSON.parse(data);
              var city = g.location.city;
              var country = g.location.country;
              var sunrise = g.current_observation.astronomy.sunrise;
              var sunset = g.current_observation.astronomy.sunset;
              var temp = g.current_observation.condition.temperature;
                  temp = Math.floor((temp-32)*5/9);
              var condition = g.current_observation.condition.text;
              var humidity = g.current_observation.atmosphere.humidity;
              var wind = g.current_observation.wind.speed;
                  wind = Math.floor((wind/1.60934));

    var fd1 = g.forecasts[1].day;
    var fl1 = g.forecasts[1].low;
        fl1 = Math.floor((fl1-32)*5/9);
    var fh1 = g.forecasts[1].high;
        fh1 = Math.floor((fh1-32)*5/9);
    var fc1 = g.forecasts[1].text;

    var fd2 = g.forecasts[2].day;
    var fl2 = g.forecasts[2].low;
        fl2 = Math.floor((fl2-32)*5/9);
    var fh2 = g.forecasts[2].high;
        fh2 = Math.floor((fh2-32)*5/9);
    var fc2 = g.forecasts[2].text;

              res.render("info",{city:city,country:country,day:day,sunrise:sunrise,sunset:sunset,temp:temp,condition:condition,humidity:humidity,wind:wind,fd1:fd1,fl1:fl1,fh1:fh1,fc1:fc1,fd2:fd2,fl2:fl2,fh2:fh2,fc2:fc2});
            } else {
                res.sendFile(__dirname + "/failure.html");
            }

          }
        }
  );

});

app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || 12,function(){
  console.log("The server is running on port 12");
})
