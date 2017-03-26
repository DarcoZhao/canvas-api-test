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
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Matrix = (function () {
    function Matrix(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 1; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    Matrix.prototype.update = function (x, y, scaleX, scaleY, rotation) {
        this.tx = x;
        this.ty = y;
        //矩阵计算过程
        var skewX, skewY;
        skewX = skewY = rotation / 180 * Math.PI;
        var u = Math.cos(skewX);
        var v = Math.sin(skewX);
        this.a = Math.cos(skewY) * scaleX;
        this.b = Math.sin(skewY) * scaleX;
        this.c = -v * scaleY;
        this.d = u * scaleY;
    };
    Matrix.prototype.toString = function () {
        return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
    };
    return Matrix;
}());
function pointAppendMatrix(point, m) {
    var x = m.a * point.x + m.c * point.y + m.tx;
    var y = m.b * point.x + m.d * point.y + m.ty;
    return new Point(x, y);
}
function matrixAppendMatrix(m1, m2) {
    var result = new Matrix();
    result.a = m1.a * m2.a + m1.b * m2.c;
    result.b = m1.a * m2.b + m1.b * m2.d;
    result.c = m2.a * m1.c + m2.c * m1.d;
    result.d = m2.b * m1.c + m1.d * m2.d;
    result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
    result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
    return result;
}
function invertMatrix(m) {
    var a = m.a;
    var b = m.b;
    var c = m.c;
    var d = m.d;
    var tx = m.tx;
    var ty = m.ty;
    var determinant = a * d - b * c;
    var result = new Matrix(1, 0, 0, 1, 0, 0);
    if (determinant == 0) {
        throw new Error("Invert ERROR");
    }
    determinant = 1 / determinant;
    var k = result.a = d * determinant;
    b = result.b = -b * determinant;
    c = result.c = -c * determinant;
    d = result.d = a * determinant;
    result.tx = -(k * tx + c * ty);
    result.ty = -(b * tx + d * ty);
    return result;
}
//# sourceMappingURL=math.js.map