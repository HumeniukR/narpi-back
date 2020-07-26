const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const http = require("http")
require('dotenv/config')

//const SERIAL_PATH = "/dev/ttyUSB0"; // unix-like
const SERIAL_PATH = process.env.SERIAL_PATH || "COM5";
const PORT = process.env.PORT || 5000
const SECRET = process.env.SECRET
const API_KEY = process.env.API_KEY

const SERIAL_PORT = new SerialPort(SERIAL_PATH, { baudRate: 9600 })
const parser = new Readline()

const LED_IDs = [10, 9, 8, 11, 12, 13]
const LED_COMMANDS = {
  on: 'led-on',
  off: 'led-off',
}
const WINDOW = 'win-set'
const PINCODE = 'pin-code'
const ALARM_PIN = 1234
const LOG = []
const COMMANDS = []

let alarmArmed = false
let alarmActivated = false
let serialReady = false
let serialBusy = false


SERIAL_PORT.pipe(parser)

parser.on('data', line => {
  let separatedLine =line.split(':')
  let status = separatedLine[0]
  let cmd = separatedLine[1]
    // TODO implement sending logs into DB
  LOG.push({
    commandStatus: status,
    command: cmd.trim(),
    datetime: new Date().toLocaleString()
  })
  serialBusy = true
  if(status == 'OK' && COMMANDS.length > 0) {
      send(COMMANDS.shift())
  } else if(status == 'INFO') {
    if(cmd.trim() === 'alarm') {
      alarmActivated = true
    }
  } else {
    console.error(`Error: ${line}`)
  }
  if(COMMANDS.length == 0) {
    serialBusy = false
  }
})


SERIAL_PORT.on('open', function() {
      setTimeout(() => {
        console.log('Serial Ready');
        serialReady = true
      }, 5000);
});


function send(command) {
  if(command != undefined || command != null) {
      SERIAL_PORT.write(Buffer.from(command), function(err) {
      if (err) {
        console.log('Error - command: ' + command, err.message)
      }
    })
  }
}

// SERVER
// TODO split logic of server and serial in 2 modules

http.createServer(function(request, response){
    let result

    if (request.method == 'POST') {
      let body = ''
      request.on('data', function(data) {
        body += data
    })

    request.on('end', function() {
      console.log(body)
      body = JSON.parse(body)
      if(body && body.API_KEY === API_KEY) {
        result = requestHandler(request.url, body)
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.write(JSON.stringify(result))
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
  console.log('listening on port: ', PORT)
})

function getLog(numberOfRecords) {
  return numberOfRecords ? LOG.slice(LOG.length - numberOfRecords, LOG.length) : LOG
}

function sendCommand(command) {
  if(serialBusy) {
    COMMANDS.push(command)
  } else {
    send(command)
  }
}

function getAlarmStatus() {
  return {armed: alarmArmed, activated: alarmActivated}
}

function requestHandler(url, body) {
  let result

  if (url === "/command") {
    sendCommand(formatCommand(body.command))
    result = {...LOG[LOG.lengtg - 1]}
  } else if (url === "/log") {
    result = getLog(body.numberOfRecords)
  } else if (url === "/alarm") {
    result = getAlarmStatus()
  }

  return result
}

function formatCommand(command) {
  let formatedCommand
  if(command.name == "ledOn") {
    formatedCommand = `${SECRET}>${LED_COMMANDS.on}:${LED_IDs[command.ledNumber]}|`
  } else if (command.name == "ledOff") {
    formatedCommand = `${SECRET}>${LED_COMMANDS.off}:${LED_IDs[command.ledNumber]}|`
  } else if (command.name == "windowSet") {
    formatedCommand = `${SECRET}>${WINDOW}:${command.percent}|`
  } else if (command.name == "enableAlarm" && !alarmArmed && !alarmActivated) {
    formatedCommand = `${SECRET}>${PINCODE}:${ALARM_PIN}|`
    alarmArmed = true
  } else if (command.name == "disableAlarm" && alarmArmed) {
    alarmArmed = false
    alarmActivated = false
    formatedCommand = `${SECRET}>${PINCODE}:${ALARM_PIN}|`
  }
  return formatedCommand
}
