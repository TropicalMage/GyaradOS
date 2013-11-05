function MemoryManager() {
    function Partition(start, end) {
        this.start = start;
        this.end = end;
    }
    
    // Sets a value to an index in memory
    this.save_hex_pair = function(index, value) {
        _memory[index] = value;
    };
    
    // Gets the value from an index in memory
    this.load_hex_pair = function(index) {
        return _memory[index];
    };
    
    this.get_partition = function(part_number) {
        return new Partition((part_number - 1) * 256, (part_number * 256) - 1);
    };
    
    this.get_empty_partition = function() {
        for (var i = 0; i < _PARTITIONS; i++) {
            if (_memory[i * _PARTITION_SIZE] === "00") {
                return i + 1;
            }
        }
        
        _KernelInterruptQueue.enqueue(new Interrupt(PARTITIONS_FULL_IRQ, ""));
        return -1;
    };
    
    this.clear = function() {
        for (var i = 0; i < _memory.length; i++)
            _memory[i] = "00";
    };
}