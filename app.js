/*
EXAMPLE RESPONSE

{ dt: 1574726400,
  main:
   { temp: 292.05,
     temp_min: 291.61,
     temp_max: 292.05,
     pressure: 1007,
     sea_level: 1007,
     grnd_level: 1006,
     humidity: 83,
     temp_kf: 0.44 },
  weather:
   [ { id: 804,
       main: 'Clouds',
       description: 'overcast clouds',
       icon: '04n' } ],
  clouds: { all: 98 },
  wind: { speed: 1.67, deg: 141 },
  sys: { pod: 'n' },
  dt_txt: '2019-11-26 00:00:00' }
*/

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;


const apiKey = '022c84f5c2857c814c2f6b367b7f8f19';
// const cityID = '3838583';
const cityID = '2643743'; 
const OpenWeatherMapHelper = require("openweathermap-node");
const helper = new OpenWeatherMapHelper(
    {
        APPID: apiKey,
        units: "metric"
    }
);

const send = require('gmail-send')({
  user: 'santimaiden290@gmail.com',
  pass: 'E9zZtZ8ryv7ptN',
  to:   [
    'santi.valdezg@gmail.com'
  ],
  subject: 'LIMPIA LA REJILLA',
});

const emailFooter = '<br><em>Limpia esa rejilla..<em>';

let dataToSend = [];
let emailHeader = '';
let emailText = [];

helper.getThreeHourForecastByCityID(cityID, (err, threeHourForecast) => {
    if(err){
        console.log(err);
    } 
    else {
    	for (var i = 0; i < threeHourForecast.list.length; i++) {
        for (var j = 0; j < threeHourForecast.list[i].weather.length; j++) {
          if(threeHourForecast.list[i].weather[j].main === 'Rain'||
            threeHourForecast.list[i].weather[j].main === 'Thunderstorm'){
            let diaHora = threeHourForecast.list[i].dt_txt.split(' ');
            let obj = {
              title: threeHourForecast.list[i].weather[j].main,
              desc: threeHourForecast.list[i].weather[j].description,
              day: diaHora[0],
              hour: diaHora[1]
            } 
            dataToSend.push(obj);
          } // if
        } // inner for - weather object
    	} // outer for - days
      if(dataToSend){
        emailHeader += `<h3>Se viene la lluvia:</h3> <br>
                      <ul>`;
        emailText.push(emailHeader);

        let previous = '';

        for (var i = 0; i < dataToSend.length; i++) {
          let br = '<br>';
          let hour = dataToSend[i].hour.substring(0, dataToSend[i].hour.length-3);
          let dia = `<li>Día: <strong>${dataToSend[i].day}</strong> <br>`;
          let pronostico = `${hour} - <strong>${dataToSend[i].desc}</strong> <br>`;

          if(dia == previous){
            emailText.push(pronostico);
          } else {
            previous = dia;
            emailText.push(br);
            emailText.push(dia);
            emailText.push(pronostico);
          }
        }

        emailText.push(emailFooter);
        let emailTextString = emailText.join('');

        send({
          html: emailTextString,  
        }, (error, result, fullResult) => {
          if (error) console.error(error);
            console.log(result);
        });
      }
    } // end else
});

const server = http.createServer((req, res) => {
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});