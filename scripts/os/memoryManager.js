function MemoryManager() {
    for (var i = 0; i < _NUM_PARTITIONS; i++) {
        _PARTITIONS.push(new Partition(i + 1, i * _PARTITION_SIZE, (i + 1) * _PARTITION_SIZE - 1));
    }

    function Partition(id, start, end) {
        this.id = 0;
        this.start = start;
        this.end = end;
        this.empty = true;
    }
    
    // Sets a value to an index in memory
    this.save_hex_pair = function(offset, value) {
        _memory[_curr_pcb.begin + offset] = value;
    };
    
    // Gets the value from an index in memory
    this.load_hex_pair = function(offset) {
        return _memory[_curr_pcb.begin + offset];
    };
    
    this.get_partition = function(part_number) {
        return _PARTITIONS[part_number - 1];
    };
    
    this.get_empty_partition = function() {
        for (var i = 0; i < _NUM_PARTITIONS; i++) {
            if (_PARTITIONS[i].empty) {
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