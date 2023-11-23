
const http= require('http');
const fs = require('fs');
const requests = require('requests');


const homeFile = fs.readFileSync("home.html","utf-8");
const cssFile = fs.readFileSync('style.css', 'utf-8'); // Replace 'styles.css' with the path to your CSS file

const modifiedHomeFile = homeFile.replace('</head>', `<style>${cssFile}</style></head>`);

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.ceil(orgVal.main.temp-273.15));
    temperature = temperature.replace("{%tempmin%}",Math.ceil(orgVal.main.temp_min-273.15));
    temperature = temperature.replace("{%tempmax%}", Math.ceil(orgVal.main.temp_max-273.15));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };

const server = http.createServer((req,res)=>{
    if(req.url = "/")
    {
        requests(
            `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=d34f77bb316d6699fab4c8c2e31eb479`
          )
          .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            // console.log(arrData[0].main.temp);
            const realTimeData = arrData
              .map((val) => replaceVal(modifiedHomeFile, val))
              .join(" ");
            res.write(realTimeData);
            //  console.log(realTimeData);
        })
        .on("end", (err) => {
          if (err) return console.log("connection closed due to errors", err);
          res.end();
          });
        }  else {
            res.end("File not found");
          }    
});
server.listen(8000,"127.0.0.1");
