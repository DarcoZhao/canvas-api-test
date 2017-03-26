//DisplayObject是接口的实现，Container和其他继承这个实现
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.globalAlpha = 1;
        //
        this.width = 1;
        this.height = 1;
        this.localMatrix = new Matrix();
        this.globalMatrix = new Matrix();
        this.listeners = [];
    }
    //？？？？应该是Display..是Container的父类啊？ 
    //错！区分继承和根结点。。描述的是不同的东西
    //计算矩阵信息：先算相对矩阵，再算全局，设置位置，画
    DisplayObject.prototype.draw = function (context) {
        this.localMatrix.update(this.x, this.y, this.scaleX, this.scaleX, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.localMatrix;
        }
        //
        context.globalAlpha = this.globalAlpha;
        context.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        //
        this.render(context);
    };
    DisplayObject.prototype.addEventListener = function (type, touchFunction, object, ifCapture, priority) {
        var touchEvent = new TouchEvents(type, touchFunction, object, ifCapture, priority);
        this.listeners.push(touchEvent);
    };
    DisplayObject.prototype.render = function (context2D) {
    };
    DisplayObject.prototype.hitTest = function (x, y) {
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //为啥private？
        //如果不私有，不通过addchild来push，就没有父节点
        _this._children = [];
        return _this;
    }
    DisplayObjectContainer.prototype.addChild = function (child) {
        this._children.push(child); //!!
        child.parent = this;
    };
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        //console.log(x,y);
        var rect = new Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.width;
        rect.height = this.height;
        var result = null;
        if (rect.isPointInRectangle(x, y)) {
            result = this; //???
            TouchEventService.getInstance().addPerformer(this); //从父到子把相关对象存入数组!!
            for (var i = this._children.length - 1; i >= 0; i--) {
                var child = this._children[i];
                var point = new Point(x, y);
                var invertChildenLocalMatirx = invertMatrix(child.localMatrix);
                var pointBasedOnChild = pointAppendMatrix(point, invertChildenLocalMatirx);
                var hitTestResult = child.hitTest(pointBasedOnChild.x, pointBasedOnChild.y);
                if (hitTestResult) {
                    result = hitTestResult;
                    break;
                }
            }
            return result;
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    //
    function TextField() {
        var _this = _super.call(this) || this;
        _this.text = "Start";
        _this.fillStyle = "#000000"; //Color
        _this.size = 18;
        _this.typeFace = "Arial";
        _this.font = "18px Arial";
        return _this;
    }
    TextField.prototype.render = function (context2D) {
        context2D.fillStyle = this.fillStyle;
        context2D.font = this.font;
        context2D.fillText(this.text, 0, 0 + this.size); //三个参数？？MaxWidth哪去了？？
    };
    TextField.prototype.setText = function (text) {
        this.text = text;
    };
    TextField.prototype.setX = function (x) {
        this.x = x;
    };
    TextField.prototype.setY = function (y) {
        this.y = y;
    };
    TextField.prototype.setTextColor = function (color) {
        this.fillStyle = color;
    };
    TextField.prototype.setTypeFace = function (typeFace) {
        this.typeFace = typeFace;
    };
    TextField.prototype.setSize = function (size) {
        this.size = size;
        this.font = this.size.toString() + "px " + this.typeFace;
    };
    TextField.prototype.hitTest = function (x, y) {
        var rect = new Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.size * this.text.length;
        rect.height = this.size;
        if (rect.isPointInRectangle(x, y)) {
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap(id) {
        var _this = _super.call(this) || this;
        _this.imageID = "";
        _this.x = 0;
        _this.y = 0;
        _this.alpha = 1;
        _this.imageID = id;
        _this.image = new Image();
        _this.image.src = _this.imageID;
        _this.image.onload = function () {
            _this.width = _this.image.width;
            _this.height = _this.image.height;
        };
        return _this;
    }
    Bitmap.prototype.render = function (context2D) {
        var _this = this;
        context2D.globalAlpha = this.alpha;
        var image = new Image();
        image.src = this.imageID; //?????????????????????
        image.onload = function () {
            context2D.drawImage(image, _this.x, _this.y); //this.x? drawImage（image，0，0）？
        };
        console.log("Drawing!");
    };
    Bitmap.prototype.setImage = function (imageID) {
        this.imageID = imageID;
    };
    Bitmap.prototype.setX = function (x) {
        this.x = x;
    };
    Bitmap.prototype.setY = function (y) {
        this.y = y;
    };
    Bitmap.prototype.hitTest = function (x, y) {
        var rect = new Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        if (rect.isPointInRectangle(x, y)) {
            // for(var listener of this.listeners){
            //     if(listener.type == type){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else {
            return null;
        }
    };
    return Bitmap;
}(DisplayObject));
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.graphics = new Graphics();
        return _this;
    }
    return Shape;
}(DisplayObject));
var Graphics = (function (_super) {
    __extends(Graphics, _super);
    function Graphics() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fillColor = "#000000";
        _this.alpha = 1;
        _this.lineWidth = 1;
        _this.lineColor = "#000000";
        _this.strokeColor = "#000000"; //给边框加颜色
        return _this;
    }
    Graphics.prototype.beginFill = function (color, alpha) {
        this.fillColor = color;
        this.alpha = alpha;
    };
    Graphics.prototype.endFill = function () {
        this.fillColor = "#000000";
        this.alpha = 1;
    };
    Graphics.prototype.drawRect = function (x1, y1, x2, y2, context2D) {
        context2D.globalAlpha = this.alpha;
        context2D.fillStyle = this.fillColor;
        context2D.fillRect(x1, y1, x2, y2);
        context2D.fill();
    };
    Graphics.prototype.drawCircle = function (x, y, rad, context2D) {
        context2D.fillStyle = this.fillColor;
        context2D.globalAlpha = this.alpha;
        context2D.beginPath();
        context2D.arc(x, y, rad, 0, Math.PI * 2, true);
        context2D.closePath();
        context2D.fill();
    };
    Graphics.prototype.drawArc = function (x, y, rad, beginAngle, endAngle, context2D) {
        context2D.strokeStyle = this.strokeColor;
        context2D.globalAlpha = this.alpha;
        context2D.beginPath();
        context2D.arc(x, y, rad, beginAngle, endAngle, true);
        context2D.closePath();
        context2D.stroke();
    };
    return Graphics;
}(DisplayObject));
//# sourceMappingURL=api-drawing.js.map