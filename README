# Example
This is a script to upload torrents automatically when them complete downloading.

## Prepare
1. Install `nodejs` in your Windows
2. Create work directory in 'Documents' folder and copy everything to it
``C:\Users\%USERNAME%\Document\qptUpload``
3. Install `npm` and get modules called `utorrent-api` and `qingyingpt-api`
OR 
copy the folder from GitHub to `node-modules` folder
[qingyingpt-api](https://github.com/zunsthy/qpt-api) [utorrent-api](https://github.com/leeroybrun/node-utorrent-api)
4. Configure utorrent `Settings->Advanced->WebUI` Like this:
* Enable WebUI
* Enable Auth (username, password)
* Specify Listening Port 
* Add Default Download Folder
5. Configure utorrent `Settings->Advanced->RunProgram` Like this:
``node C:\Users\%USERNAME%\Documents\qptUpload\qpt-ut.js %K %D %N %T %L %F``

## Config
1. `config.json` contains 2 part: utorrent client and qingyingpt api access
* username password addr port - the same as utorrent settings
* id hash key - the information from QingyingPT
2. `prefix.json` contain the array which filters the entries and calls the templates
* type - 'regexp' or 'string'
* s - the checking string
* t - the partition of tracker URL
* details - file name of the template
3. `preset` folder stores templates associated with `prefix.json`
* Line 1 - Subtitle
* Line 2 - Category
* Line 3 - Source
* Line 4 - IMDb URL
* Line 5 - Douban URL
* Line 6 - "description----"
* Line 7~Fin - Description
4. `preset\example` is an example for uploading game templates


