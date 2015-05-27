function UserFilter(max) {
    this.max = max || 3;
    this.map = {};
}

UserFilter.prototype.count = function (name) {
    if (isNaN(this.map[name])) {
        this.map[name] = 0;
    } else {
        this.map[name] = this.map[name] + 1;
    }
    console.log(this.map[name]);

}

UserFilter.prototype.shouldAdd = function (name) {
    return this.map[name] < this.max;
}

module.exports = UserFilter;