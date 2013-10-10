/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

// Global CONSTANTS
var APP_NAME = "GyaradOS";
var APP_VERSION = "0.21";

var CPU_CLOCK_INTERVAL = 100; // ms

var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var OS_IRQ = 2;
var INVALID_KEY_IRQ = 3;
var TOTAL_MEMORY = 256;



// Global Components
var _CPU = null;
var _memory = [];
var _MemoryManager;
var _Console = null;
var _OsShell = null;

// Memory Globals
var _curr_pcb; // pointer to the current PCB
var _PID = 0;           // The incrementor for making unique process ids
var _PID_to_PCB = [];   // A mapping of a process id to its control block

var _OSclock = 0; // Page 23.

var _Mode = 0; // 0 = Kernel Mode, 1 = User Mode.  See page 21.

// Canvas Globals
var _Canvas = null; // Initialized in hostInit().
var _DrawingContext = null; // Initialized in hostInit().
var _DefaultFontFamily = "Lucida Console"; 
var _DefaultFontSize = 14;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues handled in Kernel
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
