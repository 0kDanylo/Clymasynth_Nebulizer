
outlets = 2; 
inlets = 2;

var cursorCoord = [0,0];
var nearestData = [];
var candidateDistance = 1000;
var numPoints = 0; //Do i Use it 
var pointsRegistry = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var state = "idle";
var sceneDir = "default";
var projDir="";

var rbfi = patcher.getnamed("_rbfi");
var pStorage = patcher.getnamed("_pStorage");


rbfi.message("clear");
rbfi.message("move", 0.5, 0.5);

function mouse(a, b)
{
	if(a == "mouseup")
	{
		findNearest();
	}
	else if(a == "mousedown")
	{
		findNearest();
	}
	else
	{
		cursorCoord = [a,b];
	}	
}

function dumpCatch(skipa, skipb, pName, skipc, x, y, skipd, r,g,b, skipe, radiusIn, skipf, radiusOut)
{
  if(state == "searchNearest")
	{
		
		if(skipa == "done")
		{			
			outlet(0, "nearestPreset",  nearestData);
			state = "idle"; 
			return;			
		}
	
    	var	currentDistance = ((cursorCoord[0]-x)*(cursorCoord[0]-x))+((cursorCoord[1]-y)*(cursorCoord[1]-y));
		var check = Math.sqrt(currentDistance)
		
		
		if(currentDistance<candidateDistance)
		{
			candidateDistance = currentDistance;
			nearestData = [skipa, skipb, pName, skipc, x, y, skipd, r,g,b, skipe, radiusIn, skipf, radiusOut];			
		}
	}	
	else if(state == "getNumPoints")
	{
			numPoints = skipb;
		//	post("\n nPoints: ", numPoints);
			state = "idle";
	}
	else if(state == "saving")
	{
		
		if(skipa == "done")
		{			
		//	outlet(0, "toColl",  "write", ""+patcher.this.filepath+"/"+scene+".txt");
			outlet(0, "toColl", "write", sceneDir+".json");
		
		// pattr command removed. It's now beeing sent from saveLoadSystem.js
			state = "idle"; 
			return;			
		}
	
    	
		outlet(0, "toColl","store", skipa, skipb, ""+pName, skipc, x, y, skipd, r,g,b, skipe, radiusIn, skipf, radiusOut);
		
	
	}

}
function findNearest()
{	
	nearestData = [];
	state = "searchNearest"
	candidateDistance = 1000;
	rbfi.message("dump");
}
function store()

{
		outlet(1, "store", nearestData[2].replace("/", ""));
		rbfi.message("move", nearestData[4], nearestData[5]);
}

function addPoint()
{	
	getNumPoints(); 
	var slot = findVacantSlot();
	pointsRegistry[slot] = 1;

//	pStorage.message("store", slot+1);
	outlet(1, "store", slot+1);

	rbfi.message("add_point", "name", "/"+(slot), "coords", cursorCoord, "rgb", 0.5, 0.5, 0.5);
	getNumPoints();
	findNearest();
}

function deletePoint()
{	
	var slot = parseInt(nearestData[2].replace("/", ""));
//	pStorage.message("delete", slot+1);
	outlet(1,"delete", slot+1);
	rbfi.message("delete_point", nearestData[2]);
	pointsRegistry[slot] = 0;
	getNumPoints();
	findNearest();
}
function getNumPoints()
{	

	state = "getNumPoints"
	rbfi.message("getnumpoints");	
} 
function findVacantSlot()
{
	var i = 0;
	for(i = 0; i <= pointsRegistry.length; i+=1)
	{ 
		if(pointsRegistry[i] == 0)
		{ 	
			return i;		
		}
		if(i==pointsRegistry.length && pointsRegistry[i] == 0)
		{
			return i+1;		
		}						
	}	
	
}

function clear()
{
		outlet(1,"clear");
		rbfi.message("clear");
		rbfi.message("move", 0.5, 0.5);
}

function saveScene(sc_dir)
{
	state = "saving";
	sceneDir = sc_dir;
	outlet(0, "toColl", "clear");
	rbfi.message("dump");	
}
function recallScene(sc_dir)
{
	rbfi.message("clear");
	outlet(0, "toColl", "read", sc_dir);
	rbfi.message("move", 0.5, 0.5);
	findNearest();
}

function setProjDir(dir)
{projDir = dir;}
