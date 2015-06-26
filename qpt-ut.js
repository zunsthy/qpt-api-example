// var request = require('request');
var Utorrent = require('utorrent-api');
var QingyingptAPI = require('qpt-api');
var fs = require('fs');

function zeroPad(num, numZeros){
	var n = Math.abs(num);
	var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
	var zeroString = Math.pow(10, zeros).toString().substr(1);
	if(num < 0){
		zeroString = '-' + zeroString;
	}
	return zeroString + n;
}

function checkOccurence(haystack, needle){
	if(needle instanceof RegExp){
		return needle.test(haystack);
	} else if(typeof(needle) == 'string'){
		return haystack.toLowerCase().indexOf(needle.toLowerCase()) == -1 ? false : true;
	} else 
		return false;
}

var dd = new Date(),
		datastring = dd.getFullYear().toString() + zeroPad(dd.getMonth() + 1, 2) + zeroPad(dd.getDate().toString(), 2),
		dirname = __filename.substr(0, __filename.lastIndexOf('\\') + 1),
		config = dirname + 'config.json',
		prefix = dirname + 'prefix.json',
		preset = dirname + 'preset\\',
		logfile = dirname + datastring + '.log',
		proto = 'http://',
		site = 'pt.hit.edu.cn',
		argv = process.argv.slice(2), // %K %D %N %T %L %F
		t_type = argv[0],
		t_dir = argv[1],
		t_name = argv[2],
		t_tracker = argv[3],
		t_label = argv[4],
		t_file = argv[5];
	
function readConfig(){	
	fs.readFile(config, 'utf8', function(err, data){
		if(!err){
			var obj = JSON.parse(data);
			
			cli_username = obj.username || 'admin',
			cli_password = obj.password || '123456',
			cli_port = obj.port || 8080,
			cli_addr = obj.addr || 'localhost',
			t_path = obj.dir || 'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Roaming\\uTorrent\\'
			pt_dl_link = obj.dl || '/download.php',
			pt_up_link = obj.up || '/take/takeupload.php',
			pt_userid = obj.id;
			pt_passhash = obj.hash;
			pt_passkey = obj.key;
		}

		if(t_path, pt_passhash)
			readPrefix();
	});
}

function readPrefix(){
	fs.readFile(prefix, 'utf8', function(err, data){
		var obj = JSON.parse(data);
		
		if(obj instanceof Array){
			var cur;
			for(var i = 0; i < obj.length; i++){
				var s, t = obj[i].t;
				if(obj[i].type == 'string'){
					s = obj[i].s;
				} else {
					s = new RegExp(obj[i].s, 'i');
				}

				if(checkOccurence(t_name, s) && checkOccurence(t_tracker, t)){
					cur = obj[i];
					break;
				}
			}
			
			if(cur != undefined){
				readPreset(preset + cur.details, (cur.enc ? cur.enc : 'utf8'));
			}
		}
	});
}

function readPreset(fn, enc){
	fs.readFile(fn, enc, function(err, data){
		if(err)
			logLog(err);
		else {
			var ms = data.match(/^([\S\s]+?)$/mg).slice(0, 5).map(function(item){ return item.replace(/[\r\n]/g, ''); });
			var up = {
				name: t_name,
				small_descr: ms[0].replace(/^\s+/),
				cat: parseInt(ms[1]).toString(),
				sou: parseInt(ms[2]).toString(),
				url: ms[3],
				dburl: ms[4],
				descr: data.match(/description----\s([\S\s]+)/)[1]
			};
			uploadTorrent(up);
		}
	});
}

function uploadTorrent(args){
	var qpt = new QingyingptAPI({
		host: site,
		port: 80,
		cookie: {
			id: pt_userid,
			pw: pt_passhash
		}
	});
	
	qpt.upload(t_path + t_name + '.torrent', args, function(err, data){
		if(err)
			logLog(err);
		else{
			// console.log(data);
			var res = data;
			if(res.status == 'succ'){
				seedTorrent(res.id);
			} else 
				logLog(data);
		}
	});
}

function seedTorrent(id){
	var ut = new Utorrent(cli_addr, cli_port);
	ut.setCredentials(cli_username, cli_password);

	ut.call('list-dirs', function(err, data){ 
		if(err)
			logLog(err);
		else {
			var ds = data['download-dirs'],
					path = (t_type == 'multi' ? t_dir.substring(0, t_dir.indexOf(t_name) - 1) : t_dir).toLowerCase(),
					cur;
			for(i = 0; i < ds.length; i++){
				if(ds[i].path.toLowerCase().indexOf(path) >= 0){
					cur = i;
					break;
				}
			}
			if(cur){
				var options = {
					's': proto + site + pt_dl_link + '?id=' + id + '&passkey=' + pt_passkey,
					'download_dir': cur,
					// 'path': t_name,
					't': (new Date().getTime()).toString()
				};
				
				ut.call('add-url', options, function(err, data){
					if(err)
						logLog(err);
					else {
						logLog('"' + t_name + '"' + ' \tID: ' + id, 'successful');
					}
				});
			} else {
				logLog('NO preset directory');
			}
		}
	});
}

readConfig();

function logLog(err, type){
	fs.appendFile(logfile, dd.toTimeString().substr(0,8) + ' [' + (type ? type : 'error') + '] \t' + (typeof err == 'object' ? JSON.stringify(err) : err.toString()) + '\n', function(){
		process.exit();
	});
}
