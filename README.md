# narpi-back
Smart home back-end services
Here is the [front-end](https://github.com/joostth) part of smart home.
### Instalation (vacuum-service)
```sh
$ cd vacuum-service
```
Check the [list](https://github.com/mrbungle64/ecovacs-deebot.js#readme) of supported vacuum bots before instalation. Thanks: [mrbungle64](https://github.com/mrbungle64), [joostth](https://github.com/joostth)

For Debian-based Linux systems the following commands should be executed:
```sh
$ sudo apt-get update sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```
A reboot might be necessary before executing the next command
```sh
$ sudo npm install canvas --unsafe-perm=true
```
Create .env file in the root of vacuum-service and add following constants
```sh
PORT=4003
VACUUM_API_KEY=vacuum-api-key
ACCOUNT_ID=your@email.com
PASSWORD=yourpassword
COUNTRY=ua
```
```sh
$ npm install 
$ npm run start
```
### Instalation (arduino-service)
Before installing arduino service [folow this instructions](https://github.com/HumeniukR/microcontroller/blob/master/README.md).
```sh
$ cd arduino-service
```
Create .env file in the root of arduino-service and add following constants (Check your device manager and find port where connected your arduino, insert it into SERIAL_PATH)
```sh
PORT=4001
SERIAL_PATH=COM3
API_KEY=apikey
SECRET=1234
```
then
```sh
$ npm install 
$ npm run start
```
Done!

### Instalation (music-service)
Before installing music service [download ffmpeg](https://ffmpeg.org/download.html).
```sh
$ cd music-service
```
Create .env file in the root of music-service and add following constants (add your .mp3 files into music folder or add your own music folder using env MUSIC_FOLDER)
```sh
PORT=4002
PLAYER_API_KEY=api-key
MUSIC_FOLDER=music
```
then
```sh
$ npm install 
$ npm run start
```
Done!

### Instalation (master-service)
Before installing you have to create data base (mogodb) locally or in cloud [(Create your account)](https://account.mongodb.com/account/register)
```sh
$ cd master-service
```
Create .env file in the root of master-service and add following constants (add link to your DB into DBINFO constant)
```sh
DBINFO=mongodb+srv://somename:somesecretword@cluster3.la2nu.mongodb.net/narpi
PORT=4000
ACCESS_JWT=secretjwttoken12345
REFRESH_JWT=refreshsecretjwt12345
VACUUM_API_URL=http://127.0.0.1:4003/
VACUUM_API_KEY=api-key
PLAYER_API_URL=http://127.0.0.1:4002/
PLAYER_API_KEY=api-key
CONTROLLER_API_URL=http://127.0.0.1:4001/
CONTROLLER_API_KEY=api-key
```
Make sure that all constants in master-service .env file (API ports / API keys) match to the constants set up in other services
```sh
$ npm install 
$ npm run start
```
Done!

## Important !
The project not fully completed do not use it for automation your own house
All services except master-service are not protected, make sure that they isolated in the private network. You can give access only to the master-service for front-end using port forwarding on your router, other ports should be disabled (except SSH, VNC, telnet if you wish)

### Todos

 - implement sending logs into DB (master-service / arduino-service)
 - fix bugs in music player
 - implement sending statuses using WebSockets
 - refactoring

License
----

MIT

