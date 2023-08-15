//ALWAYS KEEP IN THE TOP PARENT PATCHER!


/*DATA STRUCTURE:

	FILES : 
 			- Project File [prjName, Scene[1]{sc_name, au_path}, Scene[2]...]
			- RBFI JSONs for each scene
			- Pattr JSON for each scene


*/

/*
  disabled folder creation! Lines changed : 54, 140, 156

*/
outlets = 5; 

inlets = 1;


var o_umenu = 0;
var o_rbfi = 1;
var o_title =2;
var o_shell =3;
var o_pattr =4;

setoutletassist(o_umenu, "to uMenu");
setoutletassist(o_rbfi, "to rbfiControl bpatcher");
setoutletassist(o_title, "to text");
setoutletassist(o_shell, "to shell");
setoutletassist(o_pattr, "to pattr");

var shell = this.patcher.getnamed("myShell");

var defPresetStoragePath = "/presets";
var curScene = "";
var audioFilepath = "";
var srcBuf = new Buffer("source");
var projFile = new Dict();
var projDir = "";
var projName = "";
var state = "idle";
var defUMenuEntry = "[scn]"

outlet(o_title, "set", "[empty]");



function createProject(p_name, p_folder)
	{
	if(curScene.length != 0){storeScene(curScene);}
	initialize();	
	
//	projDir =  p_folder+p_name;                             !!!!
z	projDir = this.patcher.filepath;
	projName = p_name;

//post("New project " + projName + " in: " + projDir);

	projFile = new Dict(p_name);
	projFile.append("prjName", p_name);

//	shell.message("mkdir" , str_shellFormat(projDir));
//	shell.message( "mkdir",  str_shellFormat(projDir+"/scenes"));


	outlet(o_rbfi, "setProjDir", ""+projDir);

	outlet(o_title, "set", projName);
}

function saveProject()
{

	if(curScene.length != 0){storeScene(curScene);}
		
	if(projName.length != 0){projFile.export_json(projDir+"/"+projName);}
	


} 
	
function openProject(fileDir)
{
	if(curScene.length != 0){storeScene(curScene);}
 
	initialize();
	projFile.import_json(fileDir);

	projName = projFile.get("prjName");
	projDir = extractPath(fileDir);
	
	
	post("Open project " + projName + " in:" + projDir);

	outlet(o_rbfi, "setProjDir", projDir); 
	if(projFile.contains("sc_0")){
	recallScene(projFile.get("sc_0")[0]);
	}
	populateUMenu(); 
	 	
 	outlet(o_title, "set", projName);
} 

function newScene(au_Path)
{
	
if(curScene.length > 0){storeScene(curScene)};
	
	outlet(o_rbfi, "clear");
	outlet(o_pattr, "clear");
	var i = 0;
	while(projFile.contains("sc_"+i))
	{
		i++;
	}

	srcBuf.send("replace", au_Path);
	projFile.append("sc_"+i, extractFileName(au_Path), au_Path );
	
	curScene = extractFileName(au_Path)
	outlet(o_umenu, "append", curScene);
	outlet(o_umenu, "set", curScene);
}

function recallScene(sc_name)
{	
	
	if(sc_name == defUMenuEntry && sc_name == curScene )
	{
			if(curScene.length != 0){storeScene(curScene);}
	}
	else
	{
		if(curScene.length != 0){storeScene(curScene);}
		post(getSceneKeyByName(sc_name)+"\n");
		srcBuf.send("replace", projFile.get(getSceneKeyByName(sc_name))[1]);
		//outlet(o_pattr, "read", projDir + "/scenes/"+"p_"+sc_name+".json");
		//outlet(o_rbfi, "recallScene", projDir +"/scenes/"+"r_"+sc_name+".json");
		outlet(o_pattr, "read", projName+ "_"+"p_"+sc_name+".json");
		outlet(o_rbfi, "recallScene", projName+ "_"+"r_"+sc_name+".json");
		
		curScene = sc_name;
	}

}
function deleteScene(sc_name)
{
// by now - only by hand
}

function storeScene(sc_name)
{                                                                           
//	outlet(o_pattr, "writejson", projDir + "/scenes/"+"p_"+sc_name);                       !!
//	outlet(o_rbfi, "saveScene", projDir + "/scenes/"+"r_"+sc_name)	;
outlet(o_pattr, "writejson",  projName+ "_"+"p_"+sc_name);                       
	outlet(o_rbfi, "saveScene", projName+ "_"+"r_"+sc_name);	;
	// Overwrites files with same SCENE NAME
}

function getSceneKeyByName(sc_name)
{
	for(i = 0; i< projFile.getkeys().length; i++)
	{
	 if(projFile.get("sc_"+i)[0] == sc_name) {post ("sc_"+i);return ("sc_"+i);}  
		else{post("sc_name "+sc_name+"was not found in project " + projName);}
	}
}
	
	
function populateUMenu()
{
	outlet(o_umenu, "clear");
	outlet(o_umenu, "append", defUMenuEntry);
	for(i = 0; i<projFile.getkeys().length; i++)
	{	
		var key = "sc_"+i;
		if(projFile.contains(key))
		{
			outlet(o_umenu, "append", projFile.get(key)[0]);
		}
	}

}

function initialize()
{
	
	outlet(o_rbfi, "clear");
	outlet(o_pattr, "clear");
	outlet(o_umenu, "clear");
	srcBuf.send("clear");
	curScene = "";
	
	outlet(o_umenu, "append", defUMenuEntry);		
}

function shellDone(sh_out)
{
	switch(sh_out)
	{
	case "mkdir": saveProject(); break;
	default: break;
	}// reacting to shell doing thins
}
	
function extractExtention(path)
{}


	
function str_indexOfLast(str, ch)	
{
	var index = -1;
	for(i =0; i<str.length; i++) { if(str.charCodeAt(i) == ch.charCodeAt(0)) { index = i; } }
	return index;
}
function extractFileName(path)
{
	var res =  path;
	res = res.substring(str_indexOfLast(path, "/")+1, res.length);
	return res;
}
function extractPath(path)
{
	var res =  path;
	res = res.substring(0,str_indexOfLast(path, "/"));
	return res;
}
function str_shellFormat(str)
{
if(str != str.replace(" ", "")) { return str;}
	else{
return "\""+str+"\"";
}
}
