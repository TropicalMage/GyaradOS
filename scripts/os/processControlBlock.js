// The class that controls a single process
function PCB (pid, partition)  {
	this.pid	= pid;  	// Process ID (int)
	this.state = "Waiting"
	this.partition = partition;
	
	// Future things to save the state of the Process Control Block
    this.PC    = 0;
    this.Acc   = 0;
    this.Xreg  = 0;
    this.Yreg  = 0;
    this.Zflag = 0; 
    
    this.to_string = function() {
        return "PID:" + this.pid + "|PC:" + this.PC + "|Acc:" + this.Acc + "|X:" + this.Xreg + "|Y:" + this.Yreg + "|Z:" + this.Zflag;
    };
}