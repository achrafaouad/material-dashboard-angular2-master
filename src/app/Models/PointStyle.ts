export class PointStyle{
    
    public constructor(private _radius?:number,private _color?:String,private _Ocolor?:String ,private _strokWidht?:number){
  
    }

    public get radius() {
        return this._radius;
    }
    public get color() {
        return this._color;
    }
    public get Ocolor() {
        return this._Ocolor;
    }
    public get strokWidht() {
        return this._strokWidht;
    }
        
 

    public set radius(ele) {
         this._radius = ele;
    }
    public set color(ele) {
         this._color = ele;
    }
    public set Ocolor(ele) {
         this._Ocolor = ele;
    }
    public set strokWidht(ele) {
         this._strokWidht = ele;
    }
        

   

   public get getObjStyle(){
       return {
        radius: this._radius,
        color : this._color,
        Ocolor : this._Ocolor,
        strokWidht : this._strokWidht,

       }
   }
    
}

