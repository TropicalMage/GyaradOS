/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

// Global CONSTANTS
var APP_NAME = "GyaradOS";
var APP_VERSION = "0.31";

var CPU_CLOCK_INTERVAL = 10; // ms

// IRQ enums made with _KernelInterruptQueue.enqueue(new Interrupt(enum, params);
var TIMER_IRQ = 0;
var KEYBOARD_IRQ = 1;
var OS_IRQ = 2;
var INVALID_KEY_IRQ = 3;
var PROCESS_SUCCESS_IRQ = 4;
var PROCESS_FAILURE_IRQ = 5;
var PARTITIONS_FULL_IRQ = 6;
var INVALID_BOUNDARY_IRQ = 7;
var CONTEXT_SWITCH_IRQ = 8;

// Global Components
var _CPU = null;
var _memory = [];
var _MemoryManager;
var _Console = null;
var _OsShell = null;
var _quantum = 6;
var _quantum_counter = 0;

// Standard input and output linked with _Console
var _StdIn = null;
var _StdOut = null;

// Memory Globals
var _curr_pcb; 					// pointer to the current PCB
var _PARTITION_SIZE = 256;
var _NUM_PARTITIONS = 3; 		// Number of different sections in memory
var _PID = 0; 					// The incrementor for making unique process ids
var _residency = []; 			// A mapping for all avaliable PCBs
var _PARTITIONS = []; 			// Array of Partition Objects #Mem Man
var _ready_queue = []; 			// The queue of all ready processes

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


// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
