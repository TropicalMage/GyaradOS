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

    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- Used";
    sc.
    function = shellHelp;
    this.commandList[this.commandList.length] = sc;
	
    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;

    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the OS";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the manual page";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;

    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Toggles log output";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Changes the input icon";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date";
    sc.function = shellDisplayDate;
    this.commandList[this.commandList.length] = sc;

    // status <string>
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Sets the status of your OS";
    sc.function = shellSetStatus;
    this.commandList[this.commandList.length] = sc;
    
    // showpid
    sc = new ShellCommand();
    sc.command = "showpid";
    sc.description = "- Shows all of the active processes";
    sc.function = shellShowRdyPID;
    this.commandList[this.commandList.length] = sc;
	
    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "<priority?> - Loads data from the UPI";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
    
    // run <pid>
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> - Runs the process given";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;
	
    // runall
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Runs all of the programs";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;
    
    // kill <pid>
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "<pid> - Removes the pid from residency";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;

    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Project 1 requirement";
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
    sc.description = "- Text Adventure! 'game help' for instructions.";
    sc.function = shellGame;
    this.commandList[this.commandList.length] = sc;
	
    // Quantum <int>
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<int> - Changes the quantum of the Round Robin Schedule.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;
	
    // List Files
    sc = new ShellCommand();
    sc.command = "ls";
    sc.description = "- Lists all directories";
    sc.function = shellListFiles;
    this.commandList[this.commandList.length] = sc;
	
    // Create File <filename>
    sc = new ShellCommand();
    sc.command = "create";
    sc.description = "<filename> - Creates a file.";
    sc.function = shellCreateFile;
    this.commandList[this.commandList.length] = sc;
	
    // Read File <filename>
    sc = new ShellCommand();
    sc.command = "read";
    sc.description = "<filename> - Reads a files contents.";
    sc.function = shellReadFile;
    this.commandList[this.commandList.length] = sc;
	
    // Write File <filename> "data"
    sc = new ShellCommand();
    sc.command = "write";
    sc.description = "<filename, data> - Writes data to a file.";
    sc.function = shellWriteFile;
    this.commandList[this.commandList.length] = sc;
	
    // Delete File <filename>
    sc = new ShellCommand();
    sc.command = "delete";
    sc.description = "<filename> - Delete a file and it's contents.";
    sc.function = shellDeleteFile;
    this.commandList[this.commandList.length] = sc;
	
    // Format
    sc = new ShellCommand();
    sc.command = "format";
    sc.description = " - Clears all files";
    sc.function = shellFormat;
    this.commandList[this.commandList.length] = sc;
	
    // Get Schedule
    sc = new ShellCommand();
    sc.command = "getschedule";
    sc.description = "- returns current schedule";
    sc.function = shellGetSchedule;
    this.commandList[this.commandList.length] = sc;
	
    // Set Schedule
    sc = new ShellCommand();
    sc.command = "setschedule";
    sc.description = "< rr | fcfs | priority >";
    sc.function = shellSetSchedule;
    this.commandList[this.commandList.length] = sc;
	
	
    this.putPrompt();
    
    window.setInterval(function(){updateClock()}, 500);
}

function shellPutPrompt() {
    _StdIn.putText(_OsShell.promptStr);
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
    shellPutPrompt();
    _Console.active = false;
    
/*     var timerId = null;
    timerId = setInterval(function() {
        if(!_CPU.isExecuting) { 
            _OsShell.putPrompt();
            _Console.active = true;
            _Console.handleInput();
            clearTimeout(timerId);
        }
    }, 100); */
}

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

/**************** GENERAL SHELL COMMANDS ****************/
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

function shellRot13(args) {
    if (args.length > 0) {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) + "'"); // Requires Utils.js for rot13() function.
    }
    else {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args) {
    if (args.length > 0) {
        _OsShell.promptStr = args[0];
    }
    else {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellDisplayDate(args) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    _StdIn.putText(month + "/" + day + "/" + year);
}

function shellSetStatus(args) {
    document.getElementById("divStatus").innerHTML = "Status: " + args;
}

function shellShowRdyPID(args) {
	var stringy = "PIDs Running: ";
	for(var i = 0; i < _ready_queue.length; i++) {
		stringy += _ready_queue[i].pid + " > "
	}
	stringy = stringy.substring(0, stringy.length - 2)
	
	return _StdIn.putText(stringy);
}

function shellShowLocation(args) {
    _StdIn.putText("Where aren't you?");
}

function shellNuclearWar(args) {
    _KernelInterruptQueue.enqueue(new Interrupt(OS_IRQ, "test"));
}

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
                _StdIn.putText("You leap two feet into the air. Afterwards, you feel TIRED.");
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
                _StdIn.putText("The stick did less damage than the sword. Who knew!?");
                this.game2 = 0;
                break;
            case "special":
                _StdIn.putText("You dash forward with your rainbow colored sword. CONTINUE.");
                break;
            case "continue":
                _StdIn.putText("Your sword cleaves the beast in two. You are WINNER!");
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

/**************** PROGRAM COMMANDS ****************/
function shellLoad(args) {
    if (args.length === 0 || args.length === 1) {
		var priority = 0;
		
		if (args.length === 1) {
			var intRegex = /^\d+$/;
			if(intRegex.test(args[0])) {
				var priority = args[0];
			} else {
				var text = "Fail: Priority requires an integer"
				return _StdIn.putText(" { " + text + " }");
			}
		}
		
        var user_input = document.getElementById("taProgramInput").value;
        
        if (user_input !== "") { // There is something in the UPI
            var hex_pairs = user_input.split(" "); // Array of all of the hex code pairs
            
			// Check each set to see if its only a pair of hexidecimals
			var invalid = false;
			hex_pairs.forEach(function(hex_set) {
				if(hex_set.length !== 2) {
					invalid = true;
					var text = "Fail: Two hex chars only."
					return _StdIn.putText(" { " + text + " }");
				}
				if (!hex_set[0].match("[0-9a-fA-F]")) {
					invalid = true;
					var text = "Fail: " + hex_set[0] + " needs to be in hex. "
					return _StdIn.putText(" { " + text + " }");
				}
				if (!hex_set[1].match("[0-9a-fA-F]")) {
					invalid = true;
					var text = "Fail: " + hex_set[1] + " needs to be in hex. "
					return _StdIn.putText(" { " + text + " }");
				}
			});
			
			if (invalid) {return;}
		
			krnCreateProcess(hex_pairs, priority);
        } else {
			var text = "Fail: Try putting something in the UPI."
			return _StdIn.putText(" { " + text + " }");
        }
    } else {
		var text = "Fail: Requires 0 or 1 arguments"
		return _StdIn.putText(" { " + text + " }");
    }
}

function shellRun(args) {
    if (args.length === 1) { // Need only an int
        if (krnFetchProcess(args[0]) !== null) { // It's in the residency list
            var pcb = _residency[args[0]];
			
			_ready_queue.push(pcb);
			
            _curr_pcb = _ready_queue[0];
			_curr_pcb.state = "Running";
			_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, pcb));
        } else {
            return _StdIn.putText("Fail: Can't find the PCB");
        }
    } else {
        return _StdIn.putText("Fail: Use a single pid to run a specific process.");
    }
}

function shellRunAll(args) {
	for(var i in _residency) {
		var pcb = _residency[i];
		if (pcb.state === "Waiting") {
			_ready_queue.push(pcb);
		}
	}
	
	if(_ready_queue.size === 0) {
		return _StdIn.putText("Fail: No program is waiting to be executed.");
	}
	
	// Set the current pcb and context to the front of the queue for the first section
    _curr_pcb = _ready_queue[0];
	_curr_pcb.state = "Running";
	_KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, pcb));
}

function shellKill(args) {
	var intRegex = /^\d+$/;
	if (intRegex.test(pid)) { // It's an integer
		pid = parseInt(pid);
		krnKillProcess(pid);
	} else {
		return _StdIn.putText("Fail: Please input a pid");
	}
}

/**************** FILE SYSTEM COMMANDS ****************/
function shellListFiles(args) {
	var text = krnListDirectories();
	return _StdIn.putText(" { " + text + " }");
}

function shellCreateFile(args) {
	var text = "";
	if (args[0].length > 60) {
		text = "Fail: Filename too long"
		return _StdIn.putText(" { " + text + " }");
	} 
	if (args.length === 0) {
		text = "Fail: Provide a name"
		return _StdIn.putText(" { " + text + " }");
	} else if (args.length > 1) {
		text = "Fail: Names can only have 1 word"
		return _StdIn.putText(" { " + text + " }");
	}
	text = krnCreateFile(args);
	return _StdIn.putText(" { " + text + " }");
}

function shellReadFile(args) {
	var text = "";
	if (args[0].length > 60) {
		text = "Fail: Filename too long"
		return _StdIn.putText(" { " + text + " }");
	} 
	if (args.length === 0) {
		text = "Fail: Provide a name"
		return _StdIn.putText(" { " + text + " }");
	} else if (args.length > 1) {
		text = "Fail: Names can only have 1 word"
		return _StdIn.putText(" { " + text + " }");
	}
	text = krnReadFile(args[0]);
	return _StdIn.putText(" { " + text + " }");
}

function shellWriteFile(args) {
	var text = "";
	if (args.length === 0) {
		text = "Fail: Provide a name and data"
		return _StdIn.putText(" { " + text + " }");
	}
	
	var filename = args[0]
	var data = args.slice(1).toString();
	
	text = krnWriteFile(filename, data);
	return _StdIn.putText(" { " + text + " }");
}

function shellDeleteFile(args) {
	var text = "";
	if (args.length === 0) {
		text = "Fail: Provide a name";
		return _StdIn.putText(" { " + text + " }");
	}
	if (args.length > 1) {
		text = "Fail: One-Worded names only";
		return _StdIn.putText(" { " + text + " }");
	} 
	if (args[0].length > 60) {
		text = "Fail: Filename too long";
		return _StdIn.putText(" { " + text + " }");
	}
	text = krnDeleteFile(args.toString());
	return _StdIn.putText(" { " + text + " }");
}

function shellFormat(args) {
	text = krnFormatFileSystem();
	return _StdIn.putText(" { " + text + " }");
}

/**************** SCHEDULE COMMANDS ****************/
function shellGetSchedule(args) {
	return _StdIn.putText(" { " + _SCHEDULE + " }");
}

function shellSetSchedule(args) {
	var text;
	if (args.length !== 1) {
		text = "Fail: One argument only";
		return _StdIn.putText(" { " + text + " }");
	}
	
	if (args[0] === "rr") {
		_SCHEDULE = "rr";
		_quantum = _true_quantum;
		text = "Schedule is now " + _SCHEDULE;
		return _StdIn.putText(" { " + text + " }");
	}
	if (args[0] === "fcfs") {
		_SCHEDULE = "fcfs";
		_quantum = 999999999999;
		text = "Schedule is now " + _SCHEDULE;
		return _StdIn.putText(" { " + text + " }");
	}
	if (args[0] === "priority") {
		_SCHEDULE = "priority";
		text = "Schedule is now " + _SCHEDULE;
		return _StdIn.putText(" { " + text + " }");
	}
	
	text = "Fail: Provide 'rr', 'fcfs', or 'priority'";
	return _StdIn.putText(" { " + text + " }");
}

function shellQuantum(args) {
	var intRegex = /^\d+$/;
	if(intRegex.test(args)) {
		_quantum = args;
		_true_quantum = args;
	} else {
		_StdIn.putText("Fail: Please input an integer");
	}
}

/**************** MISC ****************/
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