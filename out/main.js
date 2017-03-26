//index里要写在运行时会用到的文件，若不写，会报错找不到XXX（index没法注释
var _this = this;
window.onload = function () {
    var currentObj;
    var startObj;
    var isMouseDown = false;
    var startPoint = new Point(-1, -1);
    var movingPoint = new Point(0, 0);
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    var stage = new DisplayObjectContainer(); //DisplayObbjContainer还是DisplayObjb..？？
    stage.width = 600;
    stage.height = 600;
    var container = new DisplayObjectContainer();
    container.width = 600;
    container.height = 600;
    var list = new Bitmap("src/Pic/Click.png");
    var button = new Bitmap("src/Pic/Sun.png");
    button.x = 100;
    button.y = 100;
    container.addChild(list);
    container.addChild(button);
    stage.addChild(container);
    stage.addEventListener(TouchEventsType.MOUSEDOWN, function () {
        //console.log("Stage Listener");
    }, _this);
    container.addEventListener(TouchEventsType.MOUSEMOVE, function () {
        // console.log("Container Listener");
    }, _this);
    list.addEventListener(TouchEventsType.MOUSEMOVE, function () {
        if (currentObj == startObj) {
            container.x += (TouchEventService.stageX - movingPoint.x);
            container.y += (TouchEventService.stageY - movingPoint.y);
        }
    }, _this);
    button.addEventListener(TouchEventsType.CLICK, function () {
        alert("CLICK > <");
    }, _this);
    window.onmousedown = function (e) {
        var x = e.offsetX - 2;
        var y = e.offsetY - 2;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        startPoint.x = x;
        startPoint.y = y;
        movingPoint.x = x;
        movingPoint.y = y;
        TouchEventService.currentType = TouchEventsType.MOUSEDOWN;
        currentObj = stage.hitTest(x, y);
        startObj = currentObj;
        TouchEventService.getInstance().toDo();
        isMouseDown = true;
        //console.log(TouchEventService.currentType);
    };
    window.onmouseup = function (e) {
        var x = e.offsetX - 2;
        var y = e.offsetY - 2;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        var target = stage.hitTest(x, y);
        if (target == currentObj) {
            TouchEventService.currentType = TouchEventsType.CLICK;
        }
        else {
            TouchEventService.currentType = TouchEventsType.MOUSEUP;
        }
        TouchEventService.getInstance().toDo();
        currentObj = null;
        isMouseDown = false;
    };
    window.onmousemove = function (e) {
        if (isMouseDown) {
            var x = e.offsetX - 3;
            var y = e.offsetY - 3;
            TouchEventService.stageX = x;
            TouchEventService.stageY = y;
            TouchEventService.currentType = TouchEventsType.MOUSEMOVE;
            currentObj = stage.hitTest(x, y);
            TouchEventService.getInstance().toDo();
            movingPoint.x = x;
            movingPoint.y = y;
        }
    };
    setInterval(function () {
        context2D.save();
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
        context2D.restore();
    }, 100);
};
//# sourceMappingURL=main.js.map