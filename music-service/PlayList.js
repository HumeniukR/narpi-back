const fs = require('fs')
const jsmediatags = require('jsmediatags')
const path = require('path')
const playList = []
let numberOfTracks = 0;

function addTrackInfo(filePath, onComplete) {
new jsmediatags.Reader(filePath)
  .setTagsToRead(['title', 'artist', 'album'])
  .read({
    onSuccess: function(info) {
      playList.push({
      	id: playList.length,
      	track: path.basename(filePath),
      	title: info.tags.title,
      	artist: info.tags.artist,
      	path: filePath
      })
      if(playList.length === numberOfTracks) {
      	onComplete(playList)
      }
    },
    onError: function(error) {
      console.error('Error reading metadata: ', error.type, error.info)
    }
  });
}

exports.init = function (musicDir, onComplete) {
	fs.readdir(`./${musicDir}/`, (err, files) => {
	  files.forEach(file => {
      let trackPath = path.join(__dirname, musicDir , file)
	  	addTrackInfo(trackPath, onComplete)
	  });
	  numberOfTracks = files.length
	});
}

