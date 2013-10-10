// The class that controls a single process
function PCB (pid, begin, end)  {
	this.pid	= pid;  	// Process ID (int)
	this.begin	= begin;  	// Starting Address (int)
	this.end    = end;	    // Last Address (int)
	
	// Future things to save the state of the Process Control Block
	this.state =    0;
    this.PC    = 0;
    this.Acc   = 0;
    this.Xreg  = 0;
    this.Yreg  = 0;
    this.Zflag = 0; 
    
    this.to_string = function() {
        return "PID:" + this.pid + "|PC:" + this.PC + "|Acc:" + this.Acc + "|X:" + this.Xreg + "|Y:" + this.Yreg + "|Z:" + this.Zflag;
    };
}