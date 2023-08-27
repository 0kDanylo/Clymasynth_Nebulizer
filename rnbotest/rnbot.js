//const TimeNow = require("@rnbo/js");

//CDN?
//const { RNBOTimeNow, MessageEvent}  = require("@rnbo/js")
//import { RNBOTimeNow, MessageEvent} from "./@rnbo/js";
let audioContext;
let device;


let bgCol = 220;

setup();
mouseClicked();
async function setup()
{
   
  const patchExportURL = "rnbo/major.json";

  // Create AudioContext
  const WAContext = window.AudioContext || window.webkitAudioContext;
  const context = new WAContext();

  // Create gain node and connect it to audio output
  const outputNode = context.createGain();
  outputNode.connect(context.destination);
  context.resume();
  // Fetch the exported patcher
  let response, patcher;
  try {
      response = await fetch(patchExportURL);
      patcher = await response.json();
  
      if (!window.RNBO) {
          // Load RNBO script dynamically
          // Note that you can skip this by knowing the RNBO version of your patch
          // beforehand and just include it using a <script> tag
          await loadRNBOScript(patcher.desc.meta.rnboversion);
      }

  } catch (err) {
      const errorContext = {
          error: err
      };
      if (response && (response.status >= 300 || response.status < 200)) {
          errorContext.header = `Couldn't load patcher export bundle`,
          errorContext.description = `Check app.js to see what file it's trying to load. Currently it's` +
          ` trying to load "${patchExportURL}". If that doesn't` + 
          ` match the name of the file you exported from RNBO, modify` + 
          ` patchExportURL in app.js.`;
      }
      if (typeof guardrails === "function") {
          guardrails(errorContext);
      } else {
          throw err;
      }
      return;
  }
  
  // (Optional) Fetch the dependencies
  let dependencies = [];
  try {
      const dependenciesResponse = await fetch("export/dependencies.json");
      dependencies = await dependenciesResponse.json();

      // Prepend "export" to any file dependenciies
      dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
  } catch (e) {}

  // Create the device
  let device;
  try {
      device = await RNBO.createDevice({ context, patcher });
  } catch (err) {
      if (typeof guardrails === "function") {
          guardrails({ error: err });
      } else {
          throw err;
      }
      return;
  }

  // (Optional) Load the samples
  if (dependencies.length)
      await device.loadDataBufferDependencies(dependencies);

  // Connect the device to the web audio graph
  device.node.connect(outputNode);

  // (Optional) Extract the name and rnbo version of the patcher from the description
  document.getElementById("patcher-title").innerText = (patcher.desc.meta.filename || "Unnamed Patcher") + " (v" + patcher.desc.meta.rnboversion + ")";

  // (Optional) Automatically create sliders for the device parameters
  makeSliders(device);

  // (Optional) Create a form to send messages to RNBO inputs
  makeInportForm(device);

  // (Optional) Attach listeners to outports so you can log messages from the RNBO patcher
  attachOutports(device);

  // (Optional) Load presets, if any
  loadPresets(device, patcher);

  // (Optional) Connect MIDI inputs
  makeMIDIKeyboard(device);

  document.body.onclick = () => {
      context.resume();
  }

  // Skip if you're not using guardrails.js
  if (typeof guardrails === "function"){
      guardrails();}

      //mouseClicked();

      console.log(RNBO.TimeNow);
}



  
function mouseClicked()
  {
    
    let event1 = new RNBO.MessageEvent(RNBO.TimeNow, "in0", [ 0 ]);
    device.scheduleEvent(event1);
    
  }