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
    krnTrace("Loading the keyboard device driver.");
    krnKeyboardDriver = new DeviceDriverKeyboard(); // Construct it.  TODO: Should that have a _global-style name?
    krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
    krnTrace(krnKeyboardDriver.status);

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
	
	// Update the display on the Ready Table
	for(var i = 0; i < _ready_queue.length; i++) {
		document.getElementById("pid" + i).innerHTML = _ready_queue[i].pid;
		document.getElementById("state" + i).innerHTML = _ready_queue[i].state;
		document.getElementById("begin" + i).innerHTML = _ready_queue[i].begin;
		document.getElementById("end" + i).innerHTML = _ready_queue[i].end;
	}
	for(var i = _ready_queue.length; i < 3; i++) {
		document.getElementById("pid" + i).innerHTML = "-";
		document.getElementById("state" + i).innerHTML = "-";
		document.getElementById("begin" + i).innerHTML = "-";
		document.getElementById("end" + i).innerHTML = "-";
	}
}

function krnCreateProcess(hex_codes) {
    var partition_num = _MemoryManager.get_empty_partition();
    if (partition_num === -1) {return -1;}
    
    var start_address = (partition_num - 1) * _PARTITION_SIZE;
    var end_address = (partition_num * _PARTITION_SIZE) - 1;
    
    var pcb = new PCB(getNewPID(), start_address, end_address);
	
    _curr_pcb = pcb;
    
    var curr_offset = 0;
    hex_codes.forEach(function(hex_pair) {
        _MemoryManager.save_hex_pair(curr_offset, hex_pair);
        curr_offset++;
    });
    
    _MemoryManager.get_partition(partition_num).empty = false;
    
    _residency[pcb.pid] = pcb;
    return _StdIn.putText("Unique PID: " + pcb.pid);
}

function krnRotateProcess() {

	_ready_queue[0].state = "Ready";
	document.getElementById("state" + _ready_queue[0].pid).innerHTML = "Ready";
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

function krnInterruptHandler(irq, params) // This is the Interrupt Handler Routine.  Pages 8 and 560.
{
    // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
    krnTrace("Handling IRQ~" + irq);

    // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
    // TODO: Consider using an Interrupt Vector in the future.
    // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.  
    //       Maybe the hardware simulation will grow to support/require that in the future.
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
    case PROCESS_SUCCESS_IRQ:
        _StdIn.putText(" { Process Done | " + params + " }");
		_curr_pcb.pid = "-";
		_curr_pcb.state = "-";
		_curr_pcb.begin = "-";
		_curr_pcb.end = "-";
		
        _StdIn.advanceLine();
		
		_ready_queue.shift();
		document.getElementById("pid" + _ready_queue.length).innerHTML = "-";
		document.getElementById("state" + _ready_queue.length).innerHTML = "-";
		document.getElementById("begin" + _ready_queue.length).innerHTML = "-";
		document.getElementById("end" + _ready_queue.length).innerHTML = "-";
		
		// Set the current pcb and the context to the front of the queue
		if(_ready_queue.length !== 0) {
			_curr_pcb = _ready_queue[0];
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, _curr_pcb));
		}
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
	case CONTEXT_SWITCH_IRQ:
		_CPU.switch_context(params);
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