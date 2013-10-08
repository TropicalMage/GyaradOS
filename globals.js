/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "GyaradOS"; // 'cause I was at a loss for a better name.
var APP_VERSION = "0.12"; // What did you expect?

var CPU_CLOCK_INTERVAL = 100; // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var OS_IRQ = 2;
var INVALID_KEY_IRQ = 3;
var TOTAL_MEMORY = 256;



// Global Variables
var _CPU = null;
var _memory = [];
var _MemoryManager;

var _PID = 0;

var _OSclock = 0; // Page 23.

var _Mode = 0; // 0 = Kernel Mode, 1 = User Mode.  See page 21.

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

// UI
var _Console = null;
var _OsShell = null;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
