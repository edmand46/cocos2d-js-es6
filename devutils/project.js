var path = require('path');
var fs = require('fs');

var fileName = 'project.json';
var resPath = '.es5';

var file = JSON.parse(fs.readFileSync(fileName));
function getFiles(dir, fileList){
    var fileList = fileList || [];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, fileList);
        } else {
            fileList.push(name);
        }
    }
    return fileList;
}

var files  = getFiles(resPath);
file.jsList = files;
console.log(files);
fs.writeFileSync(fileName, JSON.stringify(file, null, 2));