
let canvas = document.getElementById('my_canvas');
// set a desired width of the canvas
canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 100;

var c = canvas.getContext('2d');
// 'mouse' object tracks the first mouse click event (coordinates, wrt to the main screen != canvas coordinates)
var mouse = {
    x: undefined,
    y: undefined
}
var rectangles=[];
class rectangle {
    constructor(x1, y1, x2, y2, color){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.breadth = Math.abs(y2-y1);
        this.length = Math.abs(x2 - x1);
        this.color = color;
    }

    check_interior(x, y){
        // console.log('------------------------------')
        // console.log("x1", this.x1, 'x2', this.x2);
        // console.log("y1", this.y1, 'y2', this.y2);
        // console.log("x", x, 'y', y);
        
        if((this.x1 < x && this.x2 > x) && (this.y1 < y  && this.y2 > y)){
            console.log("Interior")
            return true;
        }
        console.log("exterior");
        return false;
    }

    delete_it(){
        c.clearRect(this.x1, this.y1, this.x2-this.x1, this.y2-this.y1);
        console.log("Deleted");
        return true;
    }
    move_to(x,y, new_x, new_y){
        c.clearRect(this.x1, this.y1, this.x2-this.x1, this.y2-this.y1); // delete it 
        // get the distance from left side of the rectangle
        let min_left = Math.min(this.x1, this.x2);
        let min_top = Math.min(this.y1, this.y2);
        let left_dist = x - min_left;
        let top_dist = y - min_top;
        // delete the older one form array
        for(var i = 0; i<rectangles.length; i++){if(this===rectangles[i]){rectangles.splice(i, 1);break;}}
        // now create a new rectance at (x-)
        c.fillStyle=this.color;
        c.fillRect(new_x-left_dist, new_y-top_dist, this.length, this.breadth )
        const x_ = new_x - left_dist;
        const y_ = new_y - top_dist;
        const x__ = x_ + this.length;
        const y__ = y_ + this.breadth;
        const r = new rectangle(x_, y_, x__, y__, this.color);
        rectangles = [...rectangles, r]; // add the new rectangle to the list
    }

}

const draw_rectangle = (x1, y1, x2, y2) => {
    // get a random color
    var red = Math.round(Math.random()*255);
    var green = Math.round(Math.random()*255);
    var blue = Math.round(Math.random()*255);
    c.fillStyle=`rgba(${red}, ${green}, ${blue}, 1)`;

    var length = x2 - x1;
    var breadth = y2 - y1;
    c.fillRect(x1, y1, length, breadth); // create a rectangle on the canvas
    const r = new rectangle(x1, y1, x2, y2, c.fillStyle); // store that rectangle as an object
    rectangles = [...rectangles, r];        // add that rectangle to the array of rectangles. 
}
canvas.addEventListener('mousedown', (event) => {mouse.x=event.x; mouse.y=event.y; drag = false});
canvas.addEventListener('mousemove', () => {drag = true}); // drag => mousedown && mousemove
canvas.addEventListener('mouseup', (event) => {

    let to_be_moved = undefined;
    var initial_click_on_rect = false;

    for(var i=0; i < rectangles.length; i++){
        // check whether the click was inside or outside of a rectangle
        initial_click_on_rect = rectangles[i].check_interior(mouse.x-100, mouse.y-11); 
        if(initial_click_on_rect === true){to_be_moved = rectangles[i]; break;}
    }

    if(drag && initial_click_on_rect===true){
        // code to drag that rectangle
        console.log("User requests to move this element", to_be_moved)
        to_be_moved.move_to(mouse.x-100, mouse.y-11, event.x-100, event.y-11);// canvas coordinates are not the same as window coordinates (as canvas is a subset), therefore shift of origin required.
    }else if(drag && initial_click_on_rect===false){
        // create a new rectangle, mouse was dragged from empty point.
        draw_rectangle(mouse.x-100, mouse.y-11, event.x-100, event.y-11)

    }
});

canvas.onclick =  (event) =>{
    if(event.detail === 2){
        // check for double click
        console.log("Double click");
        let del_index = undefined;
        let deleted = false;
        for(var i =0; i<rectangles.length; i++){
            // find out which rectangle was double clicked.
            if(rectangles[i].check_interior(event.x-100, event.y - 11)){
                deleted = rectangles[i].delete_it();
                del_index = i;
            } 
        }
        if(deleted===true){
            // if there was an element deleted, remove it from the list of rectangle maintained.
            rectangles.splice(del_index,1);
            console.log(rectangles);
        }
    }


}
const clear_button = document.getElementById('clear_button');
clear_button.addEventListener('click', ()=> {

    c.clearRect(0, 0, innerWidth, innerHeight);
    rectangles=[]
});



