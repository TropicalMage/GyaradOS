
DeviceDriverKeyboard.prototype = new DeviceDriver;

function DeviceDriverKeyboard() {
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry() {
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "Keyboard successfully loaded.";
    // More?
}

function krnKbdDispatchKeyPress(params) {
    // Parse the params.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    
    // Check to see if we even want to deal with the key that was pressed.
    if (((keyCode >= 65) && (keyCode <= 90)) || // A..Z
    ((keyCode >= 97) && (keyCode <= 123)))      // a..z
    {
        // Determine the character we want to display.  
        chr = String.fromCharCode(keyCode + 32);
        // check the shift key and re-adjust if necessary.
        if (isShifted) {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.   
    }
    else if (((keyCode >= 48) && (keyCode <= 57)) || // digits 
    (keyCode === 32)     ||  // space
    (keyCode === 13)     ||  // enter
    (keyCode === 16)     ||  // shift
    (keyCode === 192)    ||  // `
    (keyCode === 189)    ||  // -
    (keyCode === 187)    ||  // =
    (keyCode === 219)    ||  // [
    (keyCode === 221)    ||  // ]
    (keyCode === 220)    ||  /* \*/
    (keyCode === 186)    ||  // ;
    (keyCode === 222)    ||  // '
    (keyCode === 188)    ||  // ,
    (keyCode === 190)    ||  // .
    (keyCode === 191))       // /
    {
        chr = String.fromCharCode(keyCode);
        if (isShifted) {
            if (keyCode === 48) chr = String.fromCharCode(41) // )
            else if (keyCode === 49) chr = String.fromCharCode(33) // !
            else if (keyCode === 50) chr = String.fromCharCode(64) // @
            else if (keyCode === 51) chr = String.fromCharCode(35) // #
            else if (keyCode === 52) chr = String.fromCharCode(36) // $
            else if (keyCode === 53) chr = String.fromCharCode(37) // %
            else if (keyCode === 54) chr = String.fromCharCode(94) // ^
            else if (keyCode === 55) chr = String.fromCharCode(38) // &
            else if (keyCode === 56) chr = String.fromCharCode(42) // *
            else if (keyCode === 57) chr = String.fromCharCode(40) // (

            else if (keyCode === 192) chr = String.fromCharCode(126) // ~
            else if (keyCode === 189) chr = String.fromCharCode(95) // _
            else if (keyCode === 187) chr = String.fromCharCode(43) // +
            else if (keyCode === 219) chr = String.fromCharCode(123) // {
            else if (keyCode === 221) chr = String.fromCharCode(125) // }
            else if (keyCode === 220) chr = String.fromCharCode(124) // |
            else if (keyCode === 186) chr = String.fromCharCode(58) // :
            else if (keyCode === 222) chr = String.fromCharCode(34) // "
            else if (keyCode === 188) chr = String.fromCharCode(60) // <
            else if (keyCode === 190) chr = String.fromCharCode(62) // >
            else if (keyCode === 191) chr = String.fromCharCode(63) // ?
        } else {
            if (keyCode === 192) chr = String.fromCharCode(96) // `
            else if (keyCode === 189) chr = String.fromCharCode(45) // -
            else if (keyCode === 187) chr = String.fromCharCode(61) // =
            else if (keyCode === 219) chr = String.fromCharCode(91) // [
            else if (keyCode === 221) chr = String.fromCharCode(93) // ]
            else if (keyCode === 220) chr = String.fromCharCode(92) /* \*/
            else if (keyCode === 186) chr = String.fromCharCode(59) // ;
            else if (keyCode === 222) chr = String.fromCharCode(39) // '
            else if (keyCode === 188) chr = String.fromCharCode(44) // ,
            else if (keyCode === 190) chr = String.fromCharCode(46) // .
            else if (keyCode === 191) chr = String.fromCharCode(47) // /
        }
    } else if(keyCode === 8) {
        chr = "backspace"
    }  else if (keyCode === 38) {
        chr = "up";
    } else if (keyCode === 40) {
        chr = "down";
    } else {
        _KernelInterruptQueue.enqueue(new Interrupt(INVALID_KEY_IRQ, "improper key"))
    }
    _KernelInputQueue.enqueue(chr);
}
