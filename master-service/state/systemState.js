global.systemState = {
    rooms: [
        {id: 0, name: "Bedroom 1", enabled: false},
        {id: 1, name: "Bedroom 2", enabled: false},
        {id: 2, name: "Corridor", enabled: false},
        {id: 3, name: "Kitchen", enabled: false},
        {id: 4, name: "Pantry", enabled: false},
        {id: 5, name: "Bath", enabled: false}
    ],
    windows: [
        { id: 0, name: "Bedroom", percent: 0, active: true},
        { id: 1, name: "Kitchen", percent: 10, active: false},
        { id: 2, name: "Corridor", percent: 90, active: false},
        { id: 3, name: "Bath", percent: 50, active: false},
    ],
    vacuum: {
        lastCommand: "none", // clean/charge/forward/left/right/pause/
        status: "ready", // inprogress/done/pause/error
    },
    alarm: {armed: false, activated: false},
    player: {pause: true, currentTrack: 0}
}
