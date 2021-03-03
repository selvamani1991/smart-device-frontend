var fs=require('fs');
var modules=JSON.parse(fs.readFileSync('modules.json', 'utf8'));
for(var k=0;k<modules.languages.length;k++){
  var language=modules.languages[k];
  var i18nObj={};
  for(var i=0;i<modules.modules.length;i++){
     var module=modules.modules[i];
     var fileName="./"+language+"/"+module+".json";
     var exist =fs.existsSync(fileName);
     if(exist){
        var data=fs.readFileSync(fileName, 'utf8');
        var words=JSON.parse(data);
        i18nObj[module] = words;
     }
  }
  var json = JSON.stringify(i18nObj,null,2);
  var outputFile="../"+language+".json";
  fs.writeFile(outputFile, json,'utf8', function(){
    console.log("Done");
  });
}


