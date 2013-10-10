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
    this.isExecuting = false;
    this.invalid = "";  // Determines if a currently executing program should continue
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
    };
    
    this.cycle = function() {
        krnTrace("CPU cycle");
        this.execute();
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
    };

    this.execute = function() {
        var start_index = _curr_pcb.begin;
        var end_index = _curr_pcb.end;
        while (_MemoryManager.load_hex_pair(this.PC) != "00" && this.invalid === "") {
            var hex_pair = _MemoryManager.load_hex_pair(this.PC)
            this.PC++;
            this.do_op_code(hex_pair);
        }
        if (this.invalid === "") {
            _StdIn.putText("Process " + _curr_pcb.pid + " complete.");
        } else {
            _StdIn.putText("Invalid: " + this.invalid);
            this.invalid === "";
        }
        
        this.isExecuting = false;
        _Console.advanceLine();
    };
    
    this.do_op_code = function(hex_pair) {
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
                console.log("CPU do_op Invalid: " + hex_pair);
                this.invalid = "Unreadable hex op-code.";
                break;
        }
        this.PC += bonus;
    };
}
    
load_accum_with_const = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    
    this.acc = parseInt(hex_params, 16);
    
    return hex_params.length;
};


load_accum_from_memory = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(this.PC);
    
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

store_accum_in_memory = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

add_with_carry = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

load_x_reg_with_const = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

load_x_reg_from_memory = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};
  
load_y_reg_with_const = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

load_y_reg_from_memory = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

system_break = function() {}; 

compare_to_x_reg = function() { // Compare a byte in memory to the X reg. Sets the Z (zero) flag if equal
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

branch_not_equal = function() {
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + bonus.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

increment_value_at_byte = function() { // Compare a byte in memory to the X reg. Sets the Z (zero) flag if equal
    var hex_params = [];
    hex_params[0] = _MemoryManager.load_hex_pair(this.PC + 1);
    hex_params[1] = _MemoryManager.load_hex_pair(this.PC);
    if (this.PC + hex_params.length >= _curr_pcb.end) {
        this.invalid = "Trying to reach out of bounds.";
        return -1;
    }
    return hex_params.length;
};

system_call = function() {}; 