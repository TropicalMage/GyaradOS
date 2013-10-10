/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr = ">";
    this.commandList = [];
    // Methods
    this.init = shellInit;
    this.putPrompt = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute = shellExecute;
    this.game1 = 0;
    this.game2 = 0;
}

function shellInit() {
    var sc = null;

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;

    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.
    function = shellHelp;
    this.commandList[this.commandList.length] = sc;

    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the OS but leaves the hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;

    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS log on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Changes the input icon.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date.";
    sc.function = shellDisplayDate;
    this.commandList[this.commandList.length] = sc;

    // status <string>
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Sets the status of your OS.";
    sc.function = shellSetStatus;
    this.commandList[this.commandList.length] = sc;
    
    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Loads data from the User Program Input.";
    sc.function = shellLoadUPI;
    this.commandList[this.commandList.length] = sc;
    
    // run
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<int> - Runs the process of a PID Index";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;

    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays your current location.";
    sc.function = shellShowLocation;
    this.commandList[this.commandList.length] = sc;
    
    // Global Thermonuclear War
    sc = new ShellCommand();
    sc.command = "globalthermonuclearwar";
    sc.description = "- Do you want to play a game?";
    sc.function = shellNuclearWar;
    this.commandList[this.commandList.length] = sc;
    
    // Game
    sc = new ShellCommand();
    sc.command = "game";
    sc.description = "- Illogical text adventure. 'game help' for instructions.";
    sc.function = shellGame;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
    
    window.setInterval(function(){updateClock()}, 500);
}

function shellPutPrompt() {
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer) {
    krnTrace("Shell>" + buffer);
    
    // Parse the input and assign the command and args to local variables
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    var cmd = userCommand.command;
    var args = userCommand.args;
    
    // Determine the command and execute it.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length) {
        if (this.commandList[index].command === cmd) {
            found = true;
            var fn = this.commandList[index].function;
        }
        else {
            ++index;
        }
    }
    if (found) {
        this.execute(fn, args);
    } else {
        this.execute(shellInvalidCommand);
    }
}

function shellParseInput(buffer) {
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList) {
        var arg = trim(tempList[i]);
        if (arg != "") {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args) {
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0) {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    
    _Console.active = false;
    
    var timerId = null;
    timerId = setInterval(function() {
        if(!_CPU.isExecuting) { 
            _OsShell.putPrompt();
            _Console.active = true;
            clearTimeout(timerId);
        }
    }, 100);
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

// Interior or private classes used only inside Shell()
function ShellCommand() {
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

function UserCommand() {
    // Properties
    this.command = "";
    this.args = [];
}



/* Shell Command Functions.  Again, not part of Shell() class per se', just called from there. */

function shellInvalidCommand() {
    _StdIn.putText("Invalid Command. Use 'help' to guide you.");
}

function shellVer(args) {
    _StdIn.putText(APP_NAME + " v" + APP_VERSION);
}

function shellHelp(args) {
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList) {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }
}

function shellShutdown(args) {
    _StdIn.putText("Shutting down...");
    krnShutdown();
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args) {
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args) {
    if (args.length > 0) {
        var topic = args[0];
        switch (topic) {
        case "help":
            _StdIn.putText("Help displays a list of (hopefully) valid commands.");
            break;
        default:
            _StdIn.putText("No manual entry for " + args[0] + ".");
        }
    }
    else {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

// Trace Command
function shellTrace(args) {
    if (args.length > 0) {
        var setting = args[0];
        switch (setting) {
        case "on":
            _Trace = true;
            _StdIn.putText("Trace ON");
            break;
        case "off":
            _Trace = false;
            _StdIn.putText("Trace OFF");
            break;
        default:
            _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }
    }
    else {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

// Rotate Command
function shellRot13(args) {
    if (args.length > 0) {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) + "'"); // Requires Utils.js for rot13() function.
    }
    else {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

// Prompt Command
function shellPrompt(args) {
    if (args.length > 0) {
        _OsShell.promptStr = args[0];
    }
    else {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}


// Date Command
function shellDisplayDate(args) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    _StdIn.putText(month + "/" + day + "/" + year);
}

// Status Command
function shellSetStatus(args) {
    document.getElementById("divStatus").innerHTML = "Status: " + args;
}

// Load Command
function shellLoadUPI(args) {
    if (args.length === 0) { // No args
        var user_input = document.getElementById("taProgramInput").value;
        
        if (user_input !== "") { // There is something in the UPI
            var hex_pairs = user_input.split(" ");
            
            if (hex_pairs.length < TOTAL_MEMORY) {
                // Check each set to see if its only a pair of hexidecimals
                var invalid = false;
                hex_pairs.forEach(function(hex_set) {
                    if(hex_set.length !== 2) {
                        invalid = true;
                        return _StdIn.putText("Invalid: Two hex chars only.");
                    }
                    if (!hex_set[0].match("[0-9a-fA-F]")) {
                        invalid = true;
                        return _StdIn.putText("Invalid: " + hex_set[0] + " needs to be in hex. ");
                    }
                    if (!hex_set[1].match("[0-9a-fA-F]")) {
                        invalid = true;
                        return _StdIn.putText("Invalid: " + hex_set[1] + " needs to be in hex. ");
                    }
                });
                
                if (invalid) {return;}
                
                var hex_codes = [];
                hex_pairs.forEach(function(hex_pair) {
                    hex_codes.push(hex_pair);
                    return;
                });
            
                krnCreateProcess(hex_codes);
            } else {
                return _StdIn.putText("Invalid: Insufficient memory space.");
            }
        } else {
            return _StdIn.putText("Invalid: Try putting something in the UPI.");
        }
    } else {
        return _StdIn.putText("Invalid: Requires no arguments.");
    }
}

// Run Command
function shellRun(args) {
    if (args.length == 1) { // Need only an int
        if (_PID_to_PCB.length > args[0]) {
            var pcb = _PID_to_PCB[args[0]];
            _curr_pcb = pcb;
            _CPU.isExecuting = true;
            _CPU.switch_context(pcb);
        } else {
            return _StdIn.putText("Invalid: Unable to locate the pcb. Avaliable processes: " + _PID_to_PCB.length);
        }
    } else {
        return _StdIn.putText("Invalid: Use a single pid to run a specific process.");
    }
}

// Where Am I Command
function shellShowLocation(args) {
    _StdIn.putText("Where aren't you?");
}

// BSOD Command
function shellNuclearWar(args) {
    _KernelInterruptQueue.enqueue(new Interrupt(OS_IRQ, "test"));
}

// Game Command
function shellGame(args) {
    if (args.length > 0) {
        var action = args[0];
        switch(action) {
            case "help":
                _StdIn.putText("Use bolded word for a command. eg: 'game dance'");
                break;
            case "look":
                _StdIn.putText("You see the giant beast, a ROCK, and a STICK.");
                break;
            case "sword":
                _StdIn.putText("You swing your sword at the mighty foe. He seems unfazed.");
                break;
            case "jump":
                _StdIn.putText("You leap two feet into the air. After all that exercise, you feel TIRED.");
                break;
            case "dance":
                if(this.game1 && this.game2) {
                    _StdIn.putText("What's this?! Your sword is glowing. You know SPECIAL.");
                } else {
                    _StdIn.putText("The monster can't look away. +2 Charm");
                }
                break;
            case "rock":
                _StdIn.putText("You now have ROCK. You've learned THROW.");
                this.game1 = 1;
                break;
            case "stick":
                _StdIn.putText("You now have STICK. You've learned SWING.");
                this.game2 = 1;
                break;
            case "tired": 
                _StdIn.putText("A nap seems like a good idea... GAME OVER");
                break;
            case "throw":
                _StdIn.putText("The rock hurt the giant beast right in the feelings.");
                this.game1 = 0;
                break;
            case "swing":
                _StdIn.putText("The stick did less damage than the sword. What did you expect?");
                this.game2 = 0;
                break;
            case "special":
                _StdIn.putText("You dash at the beast with your rainbow colored sword. CONTINUE.");
                break;
            case "continue":
                _StdIn.putText("You swing your sword and slice the beast in two. You are WINNER!");
                break;
            case "winner":
                _StdIn.putText("SUPER win! Seriously, it's over. There's nothing left. ");
                break;
            case "super":
                _StdIn.putText("    :| srs");
                break;
            default:
                _StdIn.putText("Don't understand. Start: 'game', Help: 'game help'");
                break;
        }
    } else {
        _StdIn.putText("A beast is before you. Do you LOOK, SWORD, JUMP, or DANCE?");
    }
}

// Refreshes the Clock in the Corner
function updateClock() {
    var date = new Date();
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var day = weekday[date.getDay()];
    var hours = make_it_double(date.getHours());
    var minutes = make_it_double(date.getMinutes());
    var seconds = make_it_double(date.getSeconds());
    function make_it_double(n) {
        return n < 10 ? '0' + n : n;
    }
    document.getElementById("divStatusDate").innerHTML = day + " " + hours + ":" + minutes + ":" + seconds;
}