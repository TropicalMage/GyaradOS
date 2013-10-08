// The class that controls a single process
function PCB (pid, begin, end)  {
	this.pid	= pid;  	// Process ID
	this.begin	= begin;  	// Starting Address
	this.end    = end;	    // Last Address
	
	// Future things to save the state of the Process Control Block
	this.state =    0;
	this.acc =      0;
	this.x 	 =      0;
	this.y 	 =      0;
	this.z 	 =      0;
}