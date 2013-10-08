function Memory() {
    this.memory_space = [];
    for (var i = 0; i < TOTAL_MEMORY; i++)
        this.memory_space[i] = "00";
    return this.memory_space;
}