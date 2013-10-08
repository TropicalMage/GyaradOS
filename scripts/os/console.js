/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont = _DefaultFontFamily;
    this.CurrentFontSize = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = ""; // Currently displayed string in the line
    this.history = []; // History of all the commands
    this.history_index = 0;
    this.screen_text = ""; // String of displayed text separated by \n

    

    // Methods
    this.init = function() {
        this.clearScreen();
        this.resetXY();
        _DrawingContext.font = this.CurrentFontSize + "px " + this.CurrentFont;
        _DrawingContext.fillStyle = "5555FF";
    };

    this.clearScreen = function() {
        _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        this.screen_text = "";
    };

    this.resetXY = function() {
        this.CurrentXPosition = 0;
        this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
        while (_KernelInputQueue.getSize() > 0) {
            // Get the next character from the kernel input queue.
            var chr = _KernelInputQueue.dequeue();
            
            //Enter: End of a console command
            if (chr == String.fromCharCode(13)) {
                this.history.push(this.buffer);
                this.history_index = this.history.length;
                _OsShell.handleInput(this.buffer);

                this.buffer = "";
            }
            
            // Backspace: removes last buffer char
            else if(chr == "backspace") {
                if(this.buffer.length > 0) {
                    // Overwrite the last character in the canvas
                    this.text_erase(this.buffer.slice(-1));
                }
                // Set the actual buffer variable
                this.buffer = this.buffer.slice(0, this.buffer.length - 1);
            }
            
            // Up: Cycles through your history of commands in reverse
            else if(chr == "up") {
                this.text_erase(this.buffer);
                
                this.history_index -=1;
                if(this.history_index < 0) {
                    this.history_index = this.history.length - 1;
                }
                
                this.buffer = this.history[this.history_index];
                this.putText(this.buffer);
            }
            
            // Down: Cycles through your history of commands in forwards
            else if(chr == "down") {
                this.text_erase(this.buffer);
                
                this.history_index +=1;
                if(this.history_index > this.history.length - 1) {
                    this.history_index = 0;
                }
                
                this.buffer = this.history[this.history_index];
                this.putText(this.buffer);
            }
            
            // Draws a normal character 
            else {
                this.putText(chr);
                this.buffer += chr;
            }
            // TODO: Write a case for Ctrl-C.
        }
    };

    // Adds text to the console display
    this.putText = function(text) {
        if (text !== "") {
            // Draw the text at the current X and Y coordinates.
           _DrawingContext.fillText(text, this.CurrentXPosition,  this.CurrentYPosition);
           
            // Move the current X position.
            var offset = _DrawingContext.measureText(text).width;
            this.CurrentXPosition = this.CurrentXPosition + offset;
            
            this.screen_text += text;
        }
    };

    // Every time the canvas advances a line...
    this.advanceLine = function() {
        this.CurrentXPosition = 0;
        this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
        this.screen_text += "\n";
        
        // Scroll if its at the end of the console box
        var screen_lines = this.screen_text.match(/[^\r\n]+/g); // Array of all of the placed text
        var max_lines = Math.floor(_Canvas.height / (_DefaultFontSize + _FontHeightMargin)) - 1 // Last row of the console box
        if(screen_lines.length >= max_lines) {
            // Clear the screen
            _StdIn.clearScreen();
            _StdIn.resetXY();
            this.screen_text = "";
            
            // Remove the lines depending on how much is inserted
            screen_lines.splice(0, screen_lines.length - max_lines + 1);
            var dat = this;
            // For each line from the top, redraw the text gotten from screen_text
            screen_lines.forEach(function(line) {
                dat.putText(line);
                dat.screen_text += "\n";
                dat.CurrentXPosition = 0;
                dat.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
            });
        }
    };
    
    // Overwrites a canvas text block with an invisible rectangle
    this.text_erase = function(text) {
        // Takes the dimensions of the text block to be overwritten
        var text_width = _DrawingContext.measureText(text).width;
        var text_height = (_DefaultFontSize + _FontHeightMargin) + 6;
        
        // Sets the beginning x and y coordinates while resetting the x-coord to overwrite the text
        this.CurrentXPosition = this.CurrentXPosition - text_width;
        var y_pos = this.CurrentYPosition - text_height + 9;
        
        _DrawingContext.clearRect(this.CurrentXPosition, y_pos, text_width, text_height);
        
        this.screen_text = this.screen_text.slice(0, this.screen_text.length - text.length);
    };
}
