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
    'santi.valdezg@gmail.com',
    'dvaldez39@gmail.com'
  ],
  subject: 'LIMPIA LA REJILLA',
});


let dataToSend = [];
let emailText = '';

helper.getThreeHourForecastByCityID(cityID, (err, threeHourForecast) => {
    if(err){
        console.log(err);
    } 
    else {
    	for (var i = 0; i < threeHourForecast.list.length; i++) {
        for (var j = 0; j < threeHourForecast.list[i].weather.length; j++) {
          if(threeHourForecast.list[i].weather[j].main === 'Rain'){
            let diaHora = threeHourForecast.list[i].dt_txt.split(' ');
            let obj = {
              title: threeHourForecast.list[i].weather[j].main,
              desc: threeHourForecast.list[i].weather[j].description,
              day: diaHora[0],
              hour: diaHora[1]
            } 
            dataToSend.push(obj);
          } // if
        } // 2 for
    	} // 1 for
      if(dataToSend){
        emailText += '<h3>Se viene la lluvia:</h3> <br>';
        for (var i = 0; i < dataToSend.length; i++) {
          emailText += `<ul>
                          <li>
                            El día: <strong>${dataToSend[i].day}</strong> <br>
                            Pronóstico: <strong>${dataToSend[i].desc}</strong> <br>
                            Hora: <strong>${dataToSend[i].hour}</strong> <br>
                          </li>
                        </ul><br>`;
        }
        emailText += '<br><em>Limpia esa rejilla..<em>';
        send({
          html: emailText,  
        }, (error, result, fullResult) => {
          if (error) console.error(error);
            console.log(result);
        });
      }
    } // end else
});


/*




            send({
              text: emailText,  
            }, (error, result, fullResult) => {
              if (error) console.error(error);
                console.log(result);
            });

*/




const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});