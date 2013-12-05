function MemoryManager() {
	/******************* MEMORY *******************/
    for (var i = 0; i < _NUM_PARTITIONS; i++) {
        _PARTITIONS.push(new Partition(i * _PARTITION_SIZE, (i + 1) * _PARTITION_SIZE - 1));
    }

    function Partition(start, end) {
        this.start = start;
        this.end = end;
        this.empty = true;
    }
    
    // Sets a value to an index in memory
    this.save_hex_pair = function(partition, offset, value) {
        _memory[partition.start + offset] = value;
    };
    
    // Gets the value from an index in memory
    this.load_hex_pair = function(offset) {
        return _memory[_curr_pcb.partition.start + offset];
    };
    
    // Gets the value from an index in memory
    this.get_hex_pair = function(partition, offset) {
        return _memory[partition.start + offset];
    };
    
    this.get_partition = function(part_number) {
        return _PARTITIONS[part_number];
    };
	
	this.get_partition_by_PCB = function(pcb) {
		for (var i = 0; i < _NUM_PARTITIONS; i++) {
			if (pcb.partition.start === _PARTITIONS[i].start) {
				return _PARTITIONS[i];
			}
		}
		return null;
	};
    
    this.get_empty_partition = function() {
        for (var i = 0; i < _NUM_PARTITIONS; i++) {
            if (_PARTITIONS[i].empty) {
				_PARTITIONS[i].empty = false;
                return _PARTITIONS[i];
            }
        }
        
		// No empty partitions
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

	/******************* ROLL FUNCTIONS *******************/
	// To the file
	this.roll_out = function(pcb) {
		var data = "";
		
		// Grab the data, 
		for (var i = 0; i < _PARTITION_SIZE; i++) {
			var hex_pair = this.get_hex_pair(pcb.partition, i)
			data += hex_pair + " ";
		}
		
		// clear the partition it was at and remove where it pointed to, 
		_MemoryManager.clear_partition(pcb.partition);
		pcb.partition = null;

		// and write the codes into the file
		krnCreateFile("@process" + pcb.pid);
		krnWriteFile("@process" + pcb.pid, data);
	};
	
	// To the memory
	this.roll_in = function(pcb, partition) {
		var hex_codes = krnReadFile("@process" + pcb.pid).split(" ");
		krnDeleteFile("@process" + pcb.pid);

		// put codes in memory
		var currentAddress = 0;
		hex_codes.forEach(function(hex_pair) {
			_MemoryManager.save_hex_pair(partition, currentAddress, hex_pair);
			currentAddress++;
		});
		partition.available = false;
		pcb.partition = partition;
	};
}