# narpi-back
smart home back-end
### Instalation (vacuum-service)
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
$ cd vacuum-service 
$ npm install 
$ npm run start
```
