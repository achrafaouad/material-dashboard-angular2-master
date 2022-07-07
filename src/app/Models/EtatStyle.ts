
export class EtatStyle{
    
    public constructor(private _color1?:String,private _color2?:String,private _color3?:String){
  
    }

    public get color1() {
        return this._color1;
    }
    public get color2() {
        return this._color2;
    }
    public get color3() {
        return this._color3;
    }

    public set color1(ee) {
         this._color1 = ee;
    }
    public set color2(ee) {
         this._color2 = ee;
    }
    public set color3(ee) {
         this._color3 = ee;
    }
   

   public get getObjStyle(){
       return {
        color1: this._color1,
        color2 : this._color2,
        color3 : this._color3,
       }
   }
    
}

