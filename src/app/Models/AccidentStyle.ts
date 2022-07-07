export class ACCIDENTStyle{
    
    public constructor(private _radius?:number,private _color?:String,private _Ocolor?:String ,private _strokWidht?:number,private _minRadius?:number,private _maxRadius?:number){
  
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
        
    public get maxRadius() {
        return this._maxRadius;
    }
        
    public get minRadius() {
        return this._minRadius;
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
        
    public set maxRadius(ele) {
         this._maxRadius = ele;
    }
        
    public set minRadius(ele) {
         this._minRadius = ele;
    }
        
   

   public get getObjStyle(){
       return {
        radius: this._radius,
        color : this._color,
        Ocolor : this._Ocolor,
        strokWidht : this._strokWidht,
        minRadius:this._minRadius,
        maxRadius: this._maxRadius
        
       }
   }
    
}

