/* ------------
   Kernel.js
   
   Requires globals.js
   
   Routines for the Operating System, NOT the host.
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */


// OS Startup and Shutdown Routines
function krnBootstrap() {
    hostLog("bootstrap", "host");           // Use hostLog because we ALWAYS want this, even if _Trace is off.

    // Initialize our global queues.
    _KernelInterruptQueue = new Queue();    // A (currently) non-priority queue for interrupt requests (IRQs).
    _KernelBuffers = new Array();           // Buffers... for the kernel.
    _KernelInputQueue = new Queue();        // Where device input lands before being processed out somewhere.
    _Console = new CLIconsole();            // The command line interface / console I/O device.

    // Initialize the CLIconsole.
    _Console.init();

    // Initialize standard input and output to the _Console.
    _StdIn = _Console;
    _StdOut = _Console;

    // Load the Keyboard Device Driver
    krnTrace("Loading the Keyboard Driver...");
    krnKeyboardDriver = new DeviceDriverKeyboard(); // Construct it.  TODO: Should that have a _global-style name?
    krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine made in the constructor.
    krnTrace(krnKeyboardDriver.status);
	
    krnTrace("Loading the FS Driver...");
    krnFileSystemDriver = new DeviceDriverFileSystem();
    krnFileSystemDriver.driverEntry(); // Call the driverEntry() initialization routine made in the constructor.
    krnTrace(krnFileSystemDriver.status);
	

    // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
    krnTrace("Enabling the interrupts.");
    krnEnableInterrupts();

    // Launch the shell.
    krnTrace("Creating and Launching the shell.");
    _OsShell = new Shell();
    _OsShell.init();

    // Finally, initiate testing.
    if (_GLaDOS) {
        _GLaDOS.afterStartup();
    }
}

function krnShutdown() {
    krnTrace("begin shutdown OS");
    // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...    
    // ... Disable the Interrupts.
    krnTrace("Disabling the interrupts.");
    krnDisableInterrupts();
    // 
    // Unload the Device Drivers?
    // More?
    //
    krnTrace("end shutdown OS");
}

// This gets called from the host hardware sim every time there is a hardware clock pulse.
function krnOnCPUClockPulse() {
    if (_KernelInterruptQueue.getSize() > 0) {
        // Process the first interrupt on the interrupt queue.
        // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
        var interrupt = _KernelInterruptQueue.dequeue();
        krnInterruptHandler(interrupt.irq, interrupt.params);
    } 
    else if (_ready_queue.length > 0) { // If there are no interrupts then run one CPU cycle if there is anything being processed.
        _CPU.cycle();
    } 
    else { // If there are no interrupts and there is nothing being executed then just be idle.
        krnTrace("Idle");
    }
}

function krnCreateProcess(hex_codes) {
	if (hex_codes.length < _PARTITION_SIZE) { 
		var partition = _MemoryManager.get_empty_partition();
		if (partition !== null) {
			var pcb = new PCB(getNewPID(), partition);
			
			_curr_pcb = pcb;
			var curr_offset = 0;
			
			hex_codes.forEach(function(hex_pair) {
				_MemoryManager.save_hex_pair(_curr_pcb.partition, curr_offset, hex_pair);
				curr_offset++;
			});
		
			_residency[pcb.pid] = pcb;
			krnInterruptHandler(CONSOLE_DISPLAY_IRQ, "Process created in Memory. PID: " + pcb.pid);
		} else { // Store it in the file system
			var pcb = new PCB(getNewPID());
			
			var data = hex_codes.join(" ");
			
			var filename = "@process" + pcb.pid;
			krnCreateFile(filename);
			krnWriteFile("@process" + pcb.pid, data);
			
			_residency[pcb.pid] = pcb;
			krnInterruptHandler(CONSOLE_DISPLAY_IRQ, "Process created in file '" + filename + "'. PID: " + pcb.pid);
		}
		
	} else { // Too Long
        krnInterruptHandler(CONSOLE_DISPLAY_IRQ, "Fail: Code too long");
	}
}

function krnKillProcess(pid) {
	// Need to find the index of the PID we need to kill
	var index = -1;
	for(var i = 0; i < _ready_queue.length; i++) {
		if(_ready_queue[i].pid === pid) {index = i;}
	}
	
	if(index != -1) {
		_StdIn.advanceLine();
		
		delete _residency[pid];
		
		if (_ready_queue[index].partition !== null) { // in Mem
			// Now we have to find the parition with the destroyed PID and clear it. 
			var partition = _MemoryManager.get_partition_by_PCB(_ready_queue[index]);
			_MemoryManager.clear_partition(partition);
		} else { // in FS
			krnDeleteFile("@process" + _ready_queue[i].pid)
		}
		
		// Remove it from the ready queue
		_ready_queue.splice(index, index + 1);
		
		// Set the current pcb and the context to the front of the queue
		if(index === 0 && _ready_queue.length > 0) {
			_curr_pcb = _ready_queue[0];
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, _curr_pcb));
		}
	} else {
		return _StdIn.putText("Fail: Can't find given pid");
	}
}

function krnRotateProcess() {
	_ready_queue[0].state = "Ready";
	
	// Move the queue so that the front moves to the end of the queue
	var old_front = _ready_queue.shift();
	_ready_queue.push(old_front);
	
	_ready_queue[0].state = "Running";
	// Set the current pcb and the context to the front of the queue
	_curr_pcb = _ready_queue[0];
	
	hostLog("Schedule Swap to " + _curr_pcb.pid);
	_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, _curr_pcb));
}

// 
// Interrupt Handling
// 
function krnEnableInterrupts() {
    // Keyboard
    hostEnableKeyboardInterrupt();
    // Put more here.
}

function krnDisableInterrupts() {
    // Keyboard
    hostDisableKeyboardInterrupt();
    // Put more here.
}

function krnInterruptHandler(irq, params) {
    krnTrace("Handling IRQ ~ " + irq);

    switch (irq) {
		case TIMER_IRQ:
			krnTimerISR(); // Kernel built-in routine for timers (not the clock).
			break;
			
		case KEYBOARD_IRQ:
			krnKeyboardDriver.isr(params); // Kernel mode device driver
	//        if (_StdIn.active) { // Prevents keyboard interrupts from occurring during execution
				_StdIn.handleInput();
	//        }
			break;
			
		case OS_IRQ:
			krnOSTrapError("You done goofed: " + params);
			break;
			
		case INVALID_KEY_IRQ:
			hostLog("Invalid Key")
			break;
			
		case PROCESS_SUCCESS_IRQ: // params: pid
			_StdIn.putText(" { Process Done | PID: " + params + " }");
			
			krnKillProcess(params);
			
			break;
			
		case PROCESS_FAILURE_IRQ:
			_StdIn.putText(" { Process Fail | " + params + " }");
			_StdIn.advanceLine();
			break;
			
		case PARTITIONS_FULL_IRQ:
			_StdIn.putText(" { Load Fail | Partition Size Full }");
			_StdIn.advanceLine();
			break;
			
		case INVALID_BOUNDARY_IRQ:
			hostLog("Process is trying to reach out of bounds. ")
			break;
			
		case CONTEXT_SWITCH_IRQ: // PARAMS: PCB
			_CPU.switch_context(params);
			
			if(_ready_queue.length > 0) {
				// Rotates the queue so that it reads properly before the interrupt occurs
				while(_curr_pcb.pid !== _ready_queue[0].pid) {
					_ready_queue.push(_ready_queue.shift());
				}
				
				if (params.partion === null) {
					_MemoryManager.roll_out();
					_MemoryManager.roll_in(params);
				}
			}
			break;
			
		case CONSOLE_DISPLAY_IRQ: // PARAMS: String Text
			_StdIn.putText(" { " + params + " }");
			_StdIn.advanceLine();
			break;
			
		default:
			krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
	}
}

function krnTimerISR() // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver).
{
    // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
}



//
// System Calls... that generate software interrupts via tha Application Programming Interface library routines.
//
// Some ideas:
// - ReadConsole
// - WriteConsole
// - CreateProcess
// - ExitProcess
// - WaitForProcessToExit
// - CreateFile
// - OpenFile
// - ReadFile
// - WriteFile
// - CloseFile

//
// OS Utility Routines
//
function krnTrace(msg) {
    // Check globals to see if trace is set ON.  If so, then (maybe) log the message. 
    if (_Trace) {
        if (msg === "Idle") {
            // We can't log every idle clock pulse because it would lag the browser very quickly.
            if (_OSclock % 10 === 0) // Check the CPU_CLOCK_INTERVAL in globals.js for an 
            { // idea of the tick rate and adjust this line accordingly.
                hostLog(msg, "OS");
            }
        }
        else {
            hostLog(msg, "OS");
        }
    }
}

function krnTrapError(msg) {
    hostLog("TRAP - " + msg);
    krnShutdown();
    document.write("<body bgcolor=#00FFFF>NO WEIRD KEYS ALLOWED</body>");
}

function krnOSTrapError(msg) {
    hostLog("OS TRAP - " + msg);
    krnShutdown();
    document.write("<body bgcolor=#FF0000>Boom</body>");
}

// Return current PID then increment it for the next process
function getNewPID() {
	return _PID++;
}