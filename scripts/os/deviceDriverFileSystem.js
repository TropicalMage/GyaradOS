
DeviceDriverFileSystem.prototype = new DeviceDriver;

function DeviceDriverFileSystem() {
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnFileSystemDriverEntry;
    //this.isr = ;//TODO: Interrupt service routine for this driver
    // "Constructor" code.
}

function krnFileSystemDriverEntry() {
    // Initialization routine for this, the kernel-mode file system Device Driver.
	krnBootUpFileSystem();
    this.status = "FS successfully loaded.";
}

function krnListDirectories() {
	var files = "";
	var track = 0;
	for (var sector = 0; sector < 8; sector++) {
		for (var block = 0; block < 8; block++) {
			var key = track + "" + sector + "" + block;
			var tsb = new TSB(key);
			if (tsb.is_used()) {
				files += tsb.get_data() + ", ";
			}
		}
	}
	files = files.slice(0, files.length - 2);
	if (files.length === 0) {
		var text = "No files exist";
		return text;
	} else {
		return files
	}
}

function krnCreateFile(filename) {
	if (findDirectory(filename).key === "000") {
		var tsb = getFreeDirectory();
		
		tsb.set_next_block(getFreeBlock().key);
		tsb.set_data(filename);
		
		var text = "File '" + filename + "' created";
		return text
	} else {
		var text = "File '" + filename + "' is already created";
		return text
	}
}

function krnReadFile(filename) {
	var curr_tsb = findDirectory(filename);
	if (curr_tsb !== null) {
		curr_tsb = new TSB(curr_tsb.get_next_block());
		if (curr_tsb !== null) {
			var datas = "";

			while(curr_tsb.key !== "000") {
				datas += curr_tsb.get_data();
				curr_tsb = new TSB(curr_tsb.get_next_block());
			}
			return datas;
		} else {
			var text = "File '" + filename + "' is empty";
			return text;
		}
	} else {
		var text = "File '" + filename + "' not found";
		return text;
	}
}

function krnWriteFile(filename, data) {
	// Split the data into parts and determine how many blocks you need
	var num_blocks = Math.ceil(data.length / 60);
	var sectioned_data = [];
	for (var i = 0; i < num_blocks; i++) {
		// The end of the 60 chars or the end of the file
		var end = Math.min((i + 1) * 60, data.length);
		sectioned_data.push(data.slice(i * 60, end));
	}
	
	
	var curr_tsb = findDirectory(filename);
	if (curr_tsb.key !== "000") {
		// Need to remove any chance of getting dead blocks
		krnClearFile(filename);
		
		curr_tsb = new TSB(curr_tsb.get_next_block());
		for (var i = 0; i < sectioned_data.length; i++) {
			// Write to the currently pointing tsb
			curr_tsb.set_data(sectioned_data[i]); 
			
			if (i < sectioned_data.length - 1) { 
				next_block = getFreeBlock();
				curr_tsb.set_next_block(next_block.key);
				curr_tsb = next_block;
			}
		}
		var text = "File '" + filename + "' overwritten";
		return text;
	} else {
		var text = "File '" + filename + "' not found";
		return text;
	}
}

// Initialize every location as an unused node
function krnBootUpFileSystem() {
	for (var track = 0; track < 4; track++) {
		for (var sector = 0; sector < 8; sector++) {
			for (var block = 0; block < 8; block++) {
				var key = track + "" + sector + "" + block;
				new TSB(key).clear();
			}
		}
	}
	return null;
}

// Deletes a file and all of its connected sections
function krnDeleteFile(filename) {
	var curr_tsb = findDirectory(filename);
	if (curr_tsb.key !== "000") {
		var next_tsb = curr_tsb;
		while(curr_tsb.key !== "000") {
			next_tsb = curr_tsb;
			curr_tsb = new TSB(curr_tsb.get_next_block());
			next_tsb.clear();
		}
		var text = "File '" + filename + "' deleted";
		return text;
	} else {
		var text = "File '" + filename + "' not found";
		return text;
	}
}

// Take every directory and delete the linked files
function krnFormatFileSystem() {
	var track = 0
	for (var sector = 0; sector < 8; sector++) {
		for (var block = 0; block < 8; block++) {
			var key = track + "" + sector + "" + block;
			krnDeleteFile(new TSB(key).get_data());
		}
	}
	var text = "File System Formatted";
	return text;
}

/********************** HELPER FUNCTIONS **********************/
function findDirectory(filename) {
	filename = filename.toString()
	
	var track = 0;
	for (var sector = 0; sector < 8; sector++) {
		for (var block = 0; block < 8; block++) {
			var key = track + "" + sector + "" + block;
			var tsb = new TSB(key);
			if (tsb.is_used() && tsb.get_data() === filename) {
				return tsb;
			}
		}
	}
	return new TSB("000");
}

function getFreeDirectory() {
	var track = 0;
	for (var sector = 0; sector < 8; sector++) {
		for (var block = 0; block < 8; block++) {
			if (sector === 0 && block === 0) {
				continue;
			}
		
			var key = track + "" + sector + "" + block;
			var tsb = new TSB(key);
			if (!tsb.is_used()) {
				tsb.set_used(1);
				return tsb;
			}
		}
	}
	return null;
}

function getFreeBlock() {
	for (var track = 1; track < 4; track++) {
		for (var sector = 0; sector < 8; sector++) {
			for (var block = 0; block < 8; block++) {
				var key = track + "" + sector + "" + block;
				var tsb = new TSB(key);
				if (!tsb.is_used()) {
					tsb.set_used(1);
					return tsb;
				}
			}
		}
	}
	return null;
}

// Clears a file while retaining it's memory addresses
function krnClearFile(filename) {
	var dir = findDirectory(filename);
	var next_block = dir.get_next_block();
	var next_tsb = new TSB(next_block);
	
	krnDeleteFile(filename);
	
	dir.set_used(1);
	next_tsb.set_used(1);
	dir.set_next_block(next_block);
	dir.set_data(filename);
}

function TSB(key) {
    this.key = key; // 3 Number id for the TSB
    
	// Getters + Helpers
    this.is_used = function() {
		return localStorage[this.key][0] === "1";
    }
	
    this.is_directory = function() {
		return this.key[0] === 0;
    }
	
	this.get_used_bit = function() {
		return localStorage[this.key][0];
	}
	
    this.get_next_block = function() {
		return localStorage[this.key].slice(1, 4);
    }
	
    this.get_data = function() {
		return localStorage[this.key].slice(4);
    }
	
	// Setters
    this.set_used = function(trigger) {
		localStorage[this.key] = trigger + this.get_next_block() + this.get_data();
    }
	
	this.set_next_block = function(key) {
		localStorage[this.key] = this.get_used_bit() + key + this.get_data();
	}
	
    this.set_data = function(data) {
		localStorage[this.key] = this.get_used_bit() + this.get_next_block() + data;
    }
	
	this.clear = function() {
		localStorage[this.key] = "0000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	}
	
    this.to_string = function(){
		return localStorage[this.key];
    }
}
