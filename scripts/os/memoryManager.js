function MemoryManager() {
    this.save_hex_pair = function(index, value) {
        _memory[index] = value;
    }
    
    this.load_hex_pair = function(index) {
        return _memory[index];
    }
    
    this.getNextByte = function() {
		return _memory[++_CPU.PC + this.getRelocationValue()];
	}
    
    this.hex_to_dec = function(hex) {
        return parseInt(hex, 16);
    }
}