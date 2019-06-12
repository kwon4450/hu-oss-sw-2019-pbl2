# hu-oss-sw-2019-pbl2

## release

1. clone
	```bash
	$ git clone -b release https://github.com/BS00000001/hu-oss-sw-2019-pbl2
	```
2. install packages
	```bash
	$ npm i
	```
3. change localhost to server ip in 'main.js' file
  ```bash
  (main.js)
  ...
  win.loadURL('http://localhost:8000') >> win.loadURL('http://server-ip:8000')
  ...
  ```
4. build app
	```bash
	$ npm run build
	```
5. run app