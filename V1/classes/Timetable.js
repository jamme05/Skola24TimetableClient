const { createCanvas, NodeCanvasRenderingContext2D } = require('canvas')

class Timetable{ //scheduleDay > 0 = skoldag annars hela schemat.
    width;
    height;

    /**
     * @type {NodeCanvasRenderingContext2D}
     */
    context;
    canvas;

    lessons = [];
    boxList = [];
    lineList = [];
    textList = [];

    constructor(timetableData){
        this.lessons = timetableData.lessonInfo;
        this.boxList = timetableData.boxList;
        this.lineList = timetableData.lineList;
        this.textList = timetableData.textList;
    }

    Render(){
        const w=this.width,h=this.height;

        const canvas = createCanvas(w, h);
        const context = canvas.getContext('2d');

        context.fillStyle = '#fff'
        context.fillRect(0,0, w, h)

        var data = loadjson(__dirname+'/TE21C.json').data,
            boxList = data.boxList,
            lineList = data.lineList,
            textList = data.textList;


        for(var box of boxList){
            context.fillStyle = box.fColor;
            context.fillRect(box.x,box.y,box.width,box.height);

            context.fillStyle = box.bColor;
            context.fillRect(box.x+0.5,box.y+0.5,box.width-1,box.height-1);
        }

        for(var line of lineList){
            context.fillStyle = line.color;
            context.fillRect(line.p1x-0.5,line.p1y-0.5,line.p2x-line.p1x+0.5,line.p2y-line.p1y+0.5);
        }

        for(var text of textList){
            var extra = ''
            if(text.bold) extra = 'bold ';
            else if(text.italic) extra = 'italic ';
            context.font = `${extra}${text.fontsize+1}px Helvetica`
            //context.textAlign = 'center';
            context.fillStyle = text.fColor
            context.fillText(text.text,text.x,text.y+text.fontsize)
        }

        this.context = context;
        this.canvas = canvas;
        return canvas;
    }
}

module.exports = Timetable;