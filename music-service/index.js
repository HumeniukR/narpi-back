
/*
TODO volume control

set volume to 10%
	$ amixer sset 'PCM' 10%
set volume to 10%
	$ amixer sset 'PCM' 10%
play song
ffplay track.mp3
example lib for terminal music control
https://www.npmjs.com/package/sound-play
https://github.com/nomadhoc/sound-play/blob/master/src/index.js
*/



const http = require("http")
const PlayList = require('./PlayList')
const MusicPlayer = require('./MusicPlayer')
require('dotenv/config')

const PLAYER_API_KEY = process.env.PLAYER_API_KEY
const PORT = process.env.PORT
const MUSIC_FOLDER = process.env.MUSIC_FOLDER

let tracks
let currentTrack = 0

PlayList.init(MUSIC_FOLDER, list => {
  tracks = [...list]
  const player = new MusicPlayer(list, currentTrack)
	runMusicServer(PORT, player)
  console.log('Playlist ready')
})


function runMusicServer(port, player) {
  http.createServer(function(request, response){
    if (request.method == 'POST') {
      let body = ''
      request.on('data', function(data) {
        body += data
      })
      request.on('end', function() {
        body = JSON.parse(body)
        if(body.PLAYER_API_KEY === PLAYER_API_KEY) {
          handlePlayerRequest(request.url, body, player)
          response.writeHead(200, {'Content-Type': 'application/json'})
          response.write(JSON.stringify(player.getCurrentTrack()))
        } else {
          response.statusCode = 401;
        }
          response.end()
      })
    } else if (request.method == 'GET' && request.headers['player-api-key'] === PLAYER_API_KEY) {
        response.writeHead(200, {'Content-Type': 'application/json'})
      if(request.url === '/current') {
        response.write(JSON.stringify(player.getCurrentTrack()))
      } else if(request.url === '/playlist') {
        tracks = tracks.map(item => {
          let {path, ...info} = item
          return info
        })
        //response.write(JSON.stringify(tracks))
        response.write(JSON.stringify({
          playlist: tracks,
          currentTrack: player.getCurrentTrack()
        }))
      } else {
        response.statusCode = 404;
      }
        response.end()
    } else {
      response.statusCode = 404;
      response.end('error 404: Not found')
    }

  }).listen(port, err => {
    if(err) {
      return console.error('Something went wrong ', err)
    }
    console.log(`Server is listening on ${port}`)
  });
}

function handlePlayerRequest(url, body, player) {
  if(url === '/play') {
    if(body.trackId !== undefined && typeof body.trackId == 'number') {
      player.play(body.trackId)
    } else {
      player.play(currentTrack)
    }
  } else if (url === '/pause') {
    player.pause()
  } else if (url === '/resume') {
    player.resume()
  } else if (url === '/next') {
    player.next()
  } else if (url === '/prev') {
    player.previous()
  } else if (url === '/stop') {
    player.stop()
  }
}
