const FFplay = require("ffplay")

module.exports = class MusicPlayer {
	constructor(trackList, currentTrack) {		
	    this.trackList = trackList
	    this.currentTrackNumber = currentTrack
	    this.player = null
	}

    play(trackNumber) {
        if(this.player != null) {
            this.player.stop()
            this.player = null
        }
    	if(this.trackList !== undefined && this.trackList.length > 0) {
            if(trackNumber && this.trackList.length >= trackNumber) {
                this.currentTrackNumber = trackNumber
            }
    		this.player = new FFplay(this.trackList[this.currentTrackNumber].path)
            MusicPlayer.autoplay(this)
    	}
    }

    pause() {
    	if(this.player !== null) {
    		this.player.pause()
    	}
    }

    resume() {
        if(this.player !== null) {
            this.player.resume()
        }
    }

    stop() {
    	if(this.player !== null) {
    		this.player.stop()
            this.player.proc.removeAllListeners('exit')
    	}
        this.currentTrackNumber = 0
    }

    next() {
        if(this.player !== null && this.currentTrackNumber !== null) {
            this.player.proc.removeAllListeners('exit')
            MusicPlayer.playNextTrack(this)
            MusicPlayer.autoplay(this)
        }
    }

    previous() {
        if(this.player !== null && this.currentTrackNumber !== null) {
            if(this.currentTrackNumber === 0) {
                this.currentTrackNumber = this.trackList.length - 1
            } else {
                this.currentTrackNumber--
            }
            this.player.stop()
            this.player.proc.removeAllListeners('exit')
            this.player = new FFplay(this.trackList[this.currentTrackNumber].path)
            MusicPlayer.autoplay(this)
        }
    }

    getCurrentTrack() {
        let {path, ...trackInfo} = this.trackList[this.currentTrackNumber]
        return trackInfo
    }

    static autoplay(ctx) {
        if(ctx.player !== null && ctx.currentTrackNumber !== null) {
            ctx.player.proc.on('exit', () => {
                MusicPlayer.playNextTrack(ctx)
            })
        }
    }

    static playNextTrack(ctx, currentTrackNumber) {
        if(ctx.currentTrackNumber === ctx.trackList.length - 1) {
            ctx.currentTrackNumber = 0
        } else {
            ctx.currentTrackNumber++
        }
        ctx.player.stop()
        ctx.player = new FFplay(ctx.trackList[ctx.currentTrackNumber].path)
    }

}
