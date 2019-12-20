var gamepad = require("gamepad");
const axios = require('axios').default;

// Initialize the library
gamepad.init()

// List the state of all currently attached devices
for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
  console.log(i, gamepad.deviceAtIndex(i));
}

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

// Listen for move events on all gamepads
const axes = new Set();
let counter = 0;
gamepad.on("move", async function (id, axis, value) {
  // { 41, 39, 37, 1, 0, 3, 36, 2, 43, 40, 38, 28, 13, 14, 11 }
  // { 41, 39, 37, 1, 3, 0, 2, 36, 43, 40, 38, 28, 30 }
  //0 1 2 3 37 39 41 43
  //0 - LH
  //1 - LV
  //2 - RH
  //3 - RV
  //37 - tilt RL
  //39 - tilt FB
  //41 - sum of both tilts ?
  //43 - sum of all
  //36 - acc rl ??? peak
  //38  - acc fb ???   peak
  //40 - acc ud ??? peak
  axes.add(axis);
  if (axis === 37) {
    // console.log("move", {
    //   id: id,
    //   axis: axis,
    //   value: value.toFixed(3),
    //   timestamp: new Date().getMilliseconds()
    // });
    value = (value > 0) ? (1 - value) : (value < 0) ? (-1 - value) : 0;
    axios({
      url: 'http://localhost:8086/write?db=mydb',
      method: 'POST',
      headers: {
        'Content-Type': "text/plain; charset=utf-8"
      },
      timeout: 0,
      data: `cpu_load_short,host=server01,region=us-west value=${value} ${new Date().getTime()}000000`,
      auth: {
        username: 'telegraf_nmc',
        password: 'REPLACE_ME'
    }
    }).catch(error => console.log(error));
  }
  console.log(counter++);
});

// Listen for button up events on all gamepads
gamepad.on("up", function (id, num) {
  console.log("up", {
    id: id,
    num: num,
  });
});

// Listen for button down events on all gamepads
gamepad.on("down", function (id, num) {
  console.log("down", {
    id: id,
    num: num,
  });
});
