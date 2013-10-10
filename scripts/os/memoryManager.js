function MemoryManager() {
    // Sets a value to an index in memory
    this.save_hex_pair = function(index, value) {
        _memory[index] = value;
    };
    
    // Gets the value from an index in memory
    this.load_hex_pair = function(index) {
        return _memory[index];
    };
    
    this.clear = function() {
        for (var i = 0; i < _memory.length; i++)
            _memory[i] = "00";
    }
}