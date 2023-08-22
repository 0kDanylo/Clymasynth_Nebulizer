Overview

Nebulizer is a poly-voice granular synthesizer, written in MAX/MSP language.
Its design leverages the polyphony to achieve dense sound textures (nebulas) out of any user-defined sound sample. The workflow of Nebulizer is focused on providing an artist with a minimalistic, yet real-time performance-friendly UI.
Its workflow mainly consists of pre-programming synthesis parameters' presets and then using the so-called RBFI-plane-widget to interpolate between pre-created samples. 
Standalone version allows creating, saving and loading projects and scenes within them.

It's workflow was designed with both content creator and an end users without musical/programmatical background in mind, just as the Climasynth app implies.  

Development and design 

Originally designed as an internal sound deign tool for synthesis of sound textures from field recordings and musical material, Nebulizer was further developed into the creator-and-user-friendly instrument with two challenges in mind: 
1. The content creator has to be able to pre-program (as intuitively as possible) the instrument for the public to explore the pre-programmed content. 
2. The public ideally has no particular target category. A person with complete absence of understanding about the granular synthesis has to be able to explore the content. 

The key solution was the implementation of the Radial Base Function Interpolation as the UI environment for exploring the content:

 - The creator programs the content in the form of synthesis parameters presets. 
 - The presets are then placed on a two-dimensional plane in a deliberate manner. 
 - The end-user 'travels' through the plane with the cursor
 - Depending on the proximity of the cursor to each preset's point, the weights for the presets are calculated by the Radial Basis Function.
 - Synthesis parameters are then tuned according to the weighted sum of preset values

This approach not only allows to condense the parameter space for the end user down to just two axes, but also creates a seamless space of synthesis settings, which in its turn allows smooth transition between pre-programmed states. 

Data Hierarchy (top level first)

project >> scenes >>  presets >>  parameters 


UI

The UI is split into the following parts:

-  Project management
    Create, save and load project files.
    
-  Scene management 
	Create and store scenes within the project. 
	A single scene is comprised of the set of synthesis parameter presets and is tied to one sound sample. By now scenes are automatically named after their corresponding sound files.   
	
-  RBFI-plane and preset management
	 The RBFI-Plane is a UI element, which holds colorful points, each corresponding to one parameter preset and a cursor. Depending on the proximity of the cursor to the points, the preset manager will interpolate between the presets, allowing transforming the parameter tunings smoothly from one preset to another. 
	
	Creating new points on the plane is nothing else, but saving the preset. 
	The center of the point resembles the exact synthesis parameters it has been created with. 
	Position, color and radiuses of corresponding points can also be tuned, to compose the plane in the ways, allowing cursor to travel between presets in various manners.
	  
   
-  Synthesis parameters programming section
	Here the content creator inputs parameters for the synthesizer. 
	RANGE, LENGTH, SPEED, and PITCH can be controlled for each voice individually, while ENVELOPE curve is global for all voices. RENGE selection allows a single global or three different selections. 
	
-  Audio output controls 
	Output gain controls, audio driver selection and toggle, global activation toggle for all voices   

Synthesis

In Nebulizer the sound texture density is achieved by running multiple instances (voices) of a relatively simple granular synthesis algorithm. Each instances' parameters have dedicated controls, exposed to the content creator. 

The synthesis algorithm of a single instance looks as follows:
<parameters are written  in all caps>

1. Pick a random starting point within RANGE on the SAMPLE
2. Play it back for the duration LENGTH with a SPEED. 
3. Apply pitch shift by PITCH
4. Window the signal with ENVELOPE curve
5. Repeat with the PERIOD
	





