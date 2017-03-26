//DisplayObject是接口的实现，Container和其他继承这个实现


interface IDrawable{   //I表示接口
    draw(context2D : CanvasRenderingContext2D);
}


class DisplayObject implements IDrawable {

    x = 0;
    y = 0;
    scaleX = 1;
    scaleY = 1;
    rotation = 0;
    alpha = 1;
    globalAlpha = 1;
    //
    width = 1;
    height = 1;

    localMatrix: Matrix = new Matrix();
    globalMatrix: Matrix = new Matrix();


    listeners : TouchEvents[] = [];

    parent: DisplayObjectContainer;     
    //？？？？应该是Display..是Container的父类啊？ 
    //错！区分继承和根结点。。描述的是不同的东西


    //计算矩阵信息：先算相对矩阵，再算全局，设置位置，画
    draw(context: CanvasRenderingContext2D) {     //计算全局矩阵
        this.localMatrix.update(this.x,this.y,this.scaleX,this.scaleX,this.rotation);

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
    }

    addEventListener(type : TouchEventsType,touchFunction : Function,object : any,ifCapture? : boolean,priority?: number){
        var touchEvent = new TouchEvents(type,touchFunction,object,ifCapture,priority);
        this.listeners.push(touchEvent);
    }

    render(context2D: CanvasRenderingContext2D) {
    }

    hitTest(x: number, y: number) {
    }

}

class DisplayObjectContainer extends DisplayObject {

    //为啥private？
    //如果不私有，不通过addchild来push，就没有父节点
    private _children: DisplayObject[] = [];

    addChild(child: DisplayObject) {
        this._children.push(child);  //!!
        child.parent = this;
    }

    render(context2D: CanvasRenderingContext2D) {
        for (let child of this._children) {
            child.draw(context2D);
        }
    }

    hitTest(x : number,y: number) : DisplayObject{
        //console.log(x,y);
        var rect = new Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.width;
        rect.height = this.height;
        var result = null;
        if(rect.isPointInRectangle(x,y)){
        
            result = this;//???
            TouchEventService.getInstance().addPerformer(this);//从父到子把相关对象存入数组!!


            for(let i = this._children.length - 1;i >= 0;i--){
                var child = this._children[i];
                var point = new Point(x,y);
                var invertChildenLocalMatirx = invertMatrix(child.localMatrix);
                var pointBasedOnChild = pointAppendMatrix(point,invertChildenLocalMatirx);
                var hitTestResult = child.hitTest(pointBasedOnChild.x,pointBasedOnChild.y);

                if(hitTestResult){
                    result = hitTestResult;
                    break;
                }
            }
           
            return result;
        }

        return null;
    }

}


class TextField extends DisplayObject implements IDrawable{

    text = "Start";
    fillStyle = "#000000";  //Color
    size = 18;
    typeFace = "Arial";
    font = "18px Arial";

    //
    constructor(){
        super();
    }
    
    render(context2D : CanvasRenderingContext2D){
        context2D.fillStyle = this.fillStyle;
        context2D.font = this.font;
        context2D.fillText(this.text,0,0 + this.size); //三个参数？？MaxWidth哪去了？？
        
    }

    setText(text){
        this.text = text;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    setTextColor(color){
        this.fillStyle = color;
    }

    setTypeFace(typeFace){
        this.typeFace = typeFace;
    }

    setSize(size){
        this.size = size;
        this.font = this.size.toString() + "px " + this.typeFace;
    }

    hitTest(x : number,y :number){
        var rect = new Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.size * this.text.length;
        rect.height = this.size;
        if(rect.isPointInRectangle(x,y)){
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else{
            return null;
        }
    }

}


class Bitmap extends DisplayObject implements IDrawable{

    imageID = "";
    x = 0;
    y = 0;
    alpha = 1;
    image : HTMLImageElement;

    constructor(id : string){
        super();
        this.imageID = id;
        this.image = new Image();
        this.image.src = this.imageID;
        this.image.onload = () =>{
        this.width = this.image.width;
        this.height = this.image.height;
        }
    }

    render(context2D : CanvasRenderingContext2D){
        context2D.globalAlpha = this.alpha;
        var image = new Image();
        image.src = this.imageID;  //?????????????????????
        image.onload = () =>{
            context2D.drawImage(image,this.x,this.y);    //this.x? drawImage（image，0，0）？
        }
        console.log("Drawing!");
    }

    setImage(imageID){
        this.imageID = imageID;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    hitTest(x : number,y :number){
        var rect = new Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        if(rect.isPointInRectangle(x,y)){
            // for(var listener of this.listeners){
            //     if(listener.type == type){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else{
            return null;
        }
    }

}


class Shape extends DisplayObject implements IDrawable{

    graphics : Graphics = new Graphics();

}

class Graphics extends DisplayObject implements IDrawable{

    fillColor = "#000000";
    alpha = 1;
    lineWidth = 1;
    lineColor = "#000000";
    strokeColor = "#000000"; //给边框加颜色

    beginFill(color,alpha){
        this.fillColor = color;
        this.alpha = alpha;
    }

    endFill(){
        this.fillColor = "#000000";
        this.alpha = 1;
    }

    
    drawRect(x1,y1,x2,y2,context2D : CanvasRenderingContext2D){
        context2D.globalAlpha = this.alpha;
        context2D.fillStyle = this.fillColor;
        context2D.fillRect(x1,y1,x2,y2);
        context2D.fill();
    }

    drawCircle(x,y,rad,context2D : CanvasRenderingContext2D){
        context2D.fillStyle = this.fillColor;
        context2D.globalAlpha = this.alpha;
        context2D.beginPath();
        context2D.arc(x,y,rad,0,Math.PI*2,true);
        context2D.closePath();
        context2D.fill();
    }

    drawArc(x,y,rad,beginAngle,endAngle,context2D : CanvasRenderingContext2D){
        context2D.strokeStyle = this.strokeColor;  
        context2D.globalAlpha = this.alpha;
        context2D.beginPath();
        context2D.arc(x,y,rad,beginAngle,endAngle,true);
        context2D.closePath();
        context2D.stroke();
    }
    
}