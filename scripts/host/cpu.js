/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter (int)
    this.Acc   = 0;     // Accumulator (int)
    this.Xreg  = 0;     // X register (hex)
    this.Yreg  = 0;     // Y register (hex)
    this.Zflag = 0;     // Z ero flag (Think of it as "isZero".)
    this.invalid = "";  // Determines if a currently executing program should continue
    this.curr_partition = 0;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;
    };
    
    this.cycle = function() {
        krnTrace("CPU cycle");
		
		if (_ready_queue.length !== 0) {this.execute();}
		
		_quantum_counter++;
		if (_quantum_counter >= _quantum) {
			krnRotateProcess();
			_quantum_counter = 0;
		}
    };

    this.execute = function() {
        var hex_pair = _MemoryManager.load_hex_pair(this.PC);
        this.PC++;
        this.do_op_code(hex_pair);
        
        if (this.invalid === "") { // The cycle properly finished, so update pcb's state to the CPU's
            _curr_pcb.PC = this.PC;
            _curr_pcb.Acc = this.Acc;
            _curr_pcb.Xreg = this.Xreg;
            _curr_pcb.Yreg = this.Yreg;
            _curr_pcb.Zflag = this.Zflag;
        }  
		else { // Else print the invalid statement from any of the do-op methods
            _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_FAILURE_IRQ, this.invalid));
            this.invalid = "";
        }
    };
    
    // Changes the CPU to match the state
    this.switch_context = function(a_pcb) {
        this.PC    = a_pcb.PC;
        this.Acc   = a_pcb.Acc;
        this.Xreg  = a_pcb.Xreg;
        this.Yreg  = a_pcb.Yreg;
        this.Zflag = a_pcb.Zflag;  
    };
    
    // Filters a hex code combination into an op-code
    this.do_op_code = function(hex_pair) { // Shooby Do-Op. Do op. DO OP
        var num_params = 0;
        switch(hex_pair) {
            case "A9": 
                num_params = load_accum_with_const(); 
                break;
            case "AD": 
                num_params = load_accum_from_memory(); 
                break;
            case "8D": 
                num_params = store_accum_in_memory(); 
                break;
            case "6D": 
                num_params = add_with_carry();
                break;
            case "A2": 
                num_params = load_x_reg_with_const();
                break;
            case "AE": 
                num_params = load_x_reg_from_memory(); 
                break;
            case "A0": 
                num_params = load_y_reg_with_const(); 
                break;
            case "AC": 
                num_params = load_y_reg_from_memory(); 
                break;
            case "EA":
                break;
            case "00": 
                system_break(); 
                break;
            case "EC": 
                num_params = compare_to_x_reg();
                break;
            case "D0": 
                num_params = branch_not_equal();
                break;
            case "EE": 
                num_params = increment_value_at_byte(); 
                break;
            case "FF": 
                system_call();
                break;
            default: 
                this.invalid = "Unreadable Hex: (PC: " + this.PC + ", Pair: " + hex_pair + ")";
                break;
        } 
        // When done with the specific operation, increment PC by the number of parameters used for said operation. 
        this.PC += num_params;
    };
}


// Most op-codes creates a hex_params array containing the sets of hexes used for the operation 

load_accum_with_const = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC);
    // If you reach the end of your boundary for your process
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    _CPU.Acc = parseInt(hex_params[0], 16);
    
    // Getting the length of it helps properly increment _CPU.PC
    return hex_params.length;
};

load_accum_from_memory = function() {
    var hex_params = [];
    // The hex params are out of order, so swap them
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    var index = hex_params[0] + hex_params[1];
    var index = parseInt(index, 16);
    _CPU.Acc = parseInt(_MemoryManager.load_hex_pair(index), 16);
    
    return hex_params.length;
};

store_accum_in_memory = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    var index = hex_params[0] + hex_params[1];
    var index = parseInt(index, 16);
    
    var mem_string = _CPU.Acc.toString(16).toUpperCase();
    if (mem_string.length === 1) {
        mem_string = "0" + mem_string;
    }
    
    _MemoryManager.save_hex_pair(index, mem_string);
    
    return hex_params.length;
};

add_with_carry = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    var index = hex_params[0] + hex_params[1];
    var index = parseInt(index, 16);
    // Similar to load_accum_from_memory, but +=
    _CPU.Acc += parseInt(_MemoryManager.load_hex_pair(index), 16);
    return hex_params.length;
};

load_x_reg_with_const = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    _CPU.Xreg = parseInt(hex_params[0], 16);
    
    return hex_params.length;
};

load_x_reg_from_memory = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    var index = hex_params[0] + hex_params[1];
    var index = parseInt(index, 16);
    _CPU.Xreg = parseInt(_MemoryManager.load_hex_pair(index), 16);
    
    return hex_params.length;
};
  
load_y_reg_with_const = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    _CPU.Yreg = parseInt(hex_params[0], 16);
    
    return hex_params.length;
};

load_y_reg_from_memory = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    var index = hex_params[0] + hex_params[1];
    var index = parseInt(index, 16);
    _CPU.Yreg = parseInt(_MemoryManager.load_hex_pair(index), 16);
    
    return hex_params.length;
};

system_break = function() {
    _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_SUCCESS_IRQ, _curr_pcb.pid));
}; 

compare_to_x_reg = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    
    var index = hex_params[0] + hex_params[1];
    var index = parseInt(index, 16);
    var memory_value = parseInt(_MemoryManager.load_hex_pair(index), 16)
    
    if(_CPU.Xreg === memory_value) {
        _CPU.Zflag = 1;
    } else {
        _CPU.Zflag = 0;
    }
    
    return hex_params.length;
};

branch_not_equal = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    if (_CPU.Zflag === 0) {
        _CPU.PC += parseInt(hex_params[0], 16);
        _CPU.PC %= 256; // For wrapping around
        
    }
    
    return hex_params.length;
};

increment_value_at_byte = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(_CPU.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(_CPU.PC);
    if (_CPU.PC + hex_params.length >= _curr_pcb.end) {
        _CPU.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    
    var mem_index = hex_params[0] + hex_params[1];
    var mem_index = parseInt(mem_index, 16);
    var memory_value = parseInt(_MemoryManager.load_hex_pair(mem_index), 16)
    
    memory_value++;
    // Move the decimal back into hex form and in the memory address
    var mem_string = memory_value.toString(16).toUpperCase();
    if (mem_string.length === 1) { // Make certain it's a hex pair
        mem_string = "0" + mem_string;
    }
    
    _MemoryManager.save_hex_pair(mem_index, mem_string);
    
    return hex_params.length;
};

system_call = function() {
    if (_CPU.Xreg === 1) {
        _StdIn.putText(_CPU.Yreg);
        _StdIn.advanceLine();
    } 
    else if (_CPU.Xreg === 2) {
        var hex_string = "";
        var counter = _CPU.Yreg;
        // Keep adding to the string until you see a 00, then putText
        while (_MemoryManager.load_hex_pair(counter) !== "00") {
            hex_string += String.fromCharCode(parseInt(_MemoryManager.load_hex_pair(counter), 16));
            counter++;
        }
        _StdIn.putText(hex_string);
        _StdIn.advanceLine();
    }
}; 