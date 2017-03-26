//index里要写在运行时会用到的文件，若不写，会报错找不到XXX（index没法注释

window.onload = () => {
    var currentObj;
    var startObj;
    var isMouseDown = false;
    var startPoint = new Point(-1,-1);
    var movingPoint = new Point(0,0);

    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");

    var stage = new DisplayObjectContainer();//DisplayObbjContainer还是DisplayObjb..？？
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

    stage.addEventListener(TouchEventsType.MOUSEDOWN,()=>{
        //console.log("Stage Listener");
    },this)

    container.addEventListener(TouchEventsType.MOUSEMOVE,()=>{
        // console.log("Container Listener");
    },this)

    list.addEventListener(TouchEventsType.MOUSEMOVE,()=>{
        if(currentObj == startObj){
        container.x += (TouchEventService.stageX - movingPoint.x);
        container.y += (TouchEventService.stageY - movingPoint.y);
        }
    },this);

    button.addEventListener(TouchEventsType.CLICK,()=>{
        alert("CLICK > <");
    },this);


    window.onmousedown = (e) =>{
        let x = e.offsetX - 2;
        let y = e.offsetY - 2;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        startPoint.x = x;
        startPoint.y = y;
        movingPoint.x = x;
        movingPoint.y = y;
        TouchEventService.currentType = TouchEventsType.MOUSEDOWN;
        currentObj = stage.hitTest(x,y);
        startObj = currentObj;
        TouchEventService.getInstance().toDo();
        isMouseDown = true;
        //console.log(TouchEventService.currentType);
    }

    window.onmouseup = (e) =>{
        let x = e.offsetX - 2;
        let y = e.offsetY - 2;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        var target = stage.hitTest(x,y);
        if(target == currentObj){
            TouchEventService.currentType = TouchEventsType.CLICK;
        }
        else{
            TouchEventService.currentType = TouchEventsType.MOUSEUP
        }
        TouchEventService.getInstance().toDo();
        currentObj = null;
        isMouseDown = false;
    }

    window.onmousemove = (e) =>{
        if(isMouseDown){
            let x = e.offsetX - 3;
            let y = e.offsetY - 3;
            TouchEventService.stageX = x;
            TouchEventService.stageY = y;
            TouchEventService.currentType = TouchEventsType.MOUSEMOVE;
            currentObj = stage.hitTest(x,y);
            TouchEventService.getInstance().toDo();
            movingPoint.x = x;
            movingPoint.y = y;
        }
    }

    setInterval(() => {
        context2D.save();
        context2D.clearRect(0,0,canvas.width,canvas.height);
        stage.draw(context2D);
        context2D.restore();
        
    },100)


}