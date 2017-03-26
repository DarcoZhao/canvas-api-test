// TypeScript file
var Rectangle = (function () {
    function Rectangle() {
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
    }
    Rectangle.prototype.isPointInRectangle = function (x, y) {
        var point = new Point(x, y);
        var rect = this;
        if (point.x < rect.x + rect.width &&
            point.x > rect.x &&
            point.y < rect.y + rect.height &&
            point.y > rect.y) {
            return true;
        }
        else {
            return false;
        }
    };
    return Rectangle;
}());
//# sourceMappingURL=drawing-api.js.map