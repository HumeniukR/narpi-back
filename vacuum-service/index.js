const http = require("http")
require('dotenv/config')
const vacuum = require("./vacuum")

const PORT = process.env.PORT ? process.env.PORT : 5002
const VACUUM_API_KEY = process.env.VACUUM_API_KEY

let vacbot = null
let botConnectionInProggress = false
let botConnected = false
let lastInteractionTime = Date.now()
const disconnectAfter = 600000


http.createServer(async function(request, response){
  lastInteractionTime = Date.now()
    let result

    if (request.method == 'POST') {
      let body = ''
      request.on('data', function(data) { 
        body += data
    })
   
    request.on('end', function() {
      body = JSON.parse(body)
      if(body && body.VACUUM_API_KEY === VACUUM_API_KEY) {
        connectToVaccum()
        sendCommandToVacuum(body.command)
        const message = {
          botConnectionInProggress,
          botConnected,
          lastInteractionTime,
          command: body.command
        }
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.write(JSON.stringify(message))
        response.end()
      } else {
        response.statusCode = 401;
        response.end('Error 401: wrong API key')
      }  
    })
  } else {
    response.statusCode = 500;
    response.end('Error 500: 1.Use method POST only; 2.check command')
  }
}).listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
});


async function connectToVaccum() {
  if(!botConnectionInProggress && !botConnected) {
    botConnectionInProggress = true
    vacbot = await vacuum.getVacuum()
    vacbot.on("ready", (event) => {
      botConnectionInProggress = false
      botConnected = true
    })
  }
}

function checkActivity() {
  const botConnectionExpired = Date.now() - lastInteractionTime  > disconnectAfter
  if(!botConnectionInProggress && botConnectionExpired) {
    vacbot = null
    botConnected = false
  }
}

function sendCommandToVacuum(command) {
  if(botConnected) {
    if(command === 'clean' || command === 'charge') {
      vacbot.run(command)
    } else {
      vacbot.run("move", command)
    }
  }
}

setInterval(() => {
  checkActivity()
}, 60000)