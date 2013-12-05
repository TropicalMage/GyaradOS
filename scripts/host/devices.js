/* ------------  
   Devices.js

   Requires global.js.
   
   Routines for the hardware simulation, NOT for our client OS itself. In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.
   
   This (and simulation scripts) is the only place that we should see "web" code, like 
   DOM manipulation and JavaScript event handling, and so on.  (Index.html is the only place for markup.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

var _hardwareClockID = -1;

// Every Clock Pulse
function hostClockPulse() {
    // Increment the hardware (host) clock.
    _OSclock++;
	
    // Call the kernel clock pulse event handler.
    krnOnCPUClockPulse();
	
	// Refresh the Memory Table
    var html = "<table><caption><h4>Memory</h4></caption><tr>";
    for (var i = 1; i <= _memory.length; i++) {
        html += "<td>" + _memory[i - 1] + "</td>";
        if (i % 8 === 0) {
            html += "</tr><tr>";
        }
    }
    html += "</tr></table>";
    document.getElementById("dataDivMemory").innerHTML = html;
	
	// Refresh File System
	html = "";
	html += "<table><caption><h4>File System</h4></caption>";
	for (var track = 0; track < 4; track++) {
		for (var sector = 0; sector < 8; sector++) {
			for (var block = 0; block < 8; block++) {
				html += "<tr>";
				html += "<td>" + track + "" + sector + "" + block + "</td>";
				html += "<td>" + new TSB(track + "" + sector + "" + block).to_string() + "</td>";
				html += "</tr>";
			}
		}
	}
	html += "</table>";
	document.getElementById("dataDivFileSystem").innerHTML = html;
	
	// Refresh The CPU Status
    document.getElementById("programCounter").innerHTML = _CPU.PC;
    document.getElementById("accumulator").innerHTML = _CPU.Acc;
    document.getElementById("Xreg").innerHTML = _CPU.Xreg;
    document.getElementById("Yreg").innerHTML = _CPU.Yreg;
    document.getElementById("ZFlag").innerHTML = _CPU.Zflag;
	
	// Update the display on the Ready Table
	// 		Ready processes on top
	for (var i = 0; i < _ready_queue.length && i < 3; i++) {
		document.getElementById("pid" + i).innerHTML = _ready_queue[i].pid;
		document.getElementById("state" + i).innerHTML = _ready_queue[i].state;
		document.getElementById("pc" + i).innerHTML = _ready_queue[i].PC;
		document.getElementById("pri" + i).innerHTML = _ready_queue[i].priority;
	}
	// 		Dashes if you have no remaining processes
	for (var i = _ready_queue.length; i < 3; i++) {
		document.getElementById("pid" + i).innerHTML = "-";
		document.getElementById("state" + i).innerHTML = "-";
		document.getElementById("pc" + i).innerHTML = "-";
		document.getElementById("pri" + i).innerHTML = "-";
	}
}


//
// Keyboard Interrupt, a HARDWARE Interrupt Request. (See pages 560-561 in text book.)
//
function hostEnableKeyboardInterrupt() {
    // Listen for key press (keydown, actually) events in the Document
    // and call the simulation processor, which will in turn call the 
    // OS interrupt handler.
    document.addEventListener("keydown", hostOnKeypress, false);
}

function hostDisableKeyboardInterrupt() {
    document.removeEventListener("keydown", hostOnKeypress, false);
}

function hostOnKeypress(event) {
    // The canvas element CAN receive focus if you give it a tab index, which we have.
    // Check that we are processing keystrokes only from the canvas's id (as set in index.html).
    if (event.target.id === "display") {
        event.preventDefault();
        // Note the pressed key code in the params (Mozilla-specific).
        var params = new Array(event.which, event.shiftKey);
        // Enqueue this interrupt on the kernel interrupt queue so that it gets to the Interrupt handler.
        _KernelInterruptQueue.enqueue(new Interrupt(KEYBOARD_IRQ, params));
    }
}
