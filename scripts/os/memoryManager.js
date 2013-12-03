function MemoryManager() {
    for (var i = 0; i < _NUM_PARTITIONS; i++) {
        _PARTITIONS.push(new Partition(i * _PARTITION_SIZE, (i + 1) * _PARTITION_SIZE - 1));
    }

    function Partition(start, end) {
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
        return _PARTITIONS[part_number];
    };
	
	this.get_partition_by_PCB = function(pcb) {
		for(var i = 0; i < _NUM_PARTITIONS; i++) {
			if(pcb.begin === _PARTITIONS[i].start) {
				return _PARTITIONS[i];
			}
		}
		return null;
	};
    
    this.get_empty_partition = function() {
        for (var i = 0; i < _NUM_PARTITIONS; i++) {
            if (_PARTITIONS[i].empty) {
                return _PARTITIONS[i];
            }
        }
        
		// No empty partitions
        _KernelInterruptQueue.enqueue(new Interrupt(PARTITIONS_FULL_IRQ, ""));
        return null;
    };
    
    this.clear_all = function() {
        for (var i = 0; i < _memory.length; i++)
            _memory[i] = "00";
		
		for(var i = 0; i < _NUM_PARTITIONS; i++) {
			_PARTITIONS[i].empty = true;
		}
    };
	
    this.clear_partition = function(partition) {
        for (var i = partition.start; i <= partition.end; i++) {
            _memory[i] = "00";
		}
		partition.empty = true;
    };
}