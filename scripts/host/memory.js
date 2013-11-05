function Memory() {
    this.memory_space = [];
    for (var i = 0; i < _PARTITION_SIZE * _PARTITIONS; i++)
        this.memory_space[i] = "00";
    return this.memory_space;
}