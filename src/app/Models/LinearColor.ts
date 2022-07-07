
export class LinearColor{
    
    public constructor(private _remplissageC?:String,private _colorBor?:String,private _strock?:number){
  
    }

    public get remplissageC() {
        return this._remplissageC;
    }
    public get colorBor() {
        return this._colorBor;
    }
    public get strock() {
        return this._strock;
    }

    public set remplissageC(ee) {
         this._remplissageC = ee;
    }
    public set colorBor(ee) {
         this._colorBor = ee;
    }
    public set strock(ee) {
         this._strock = ee;
    }
   

   public get getObjStyle(){
       return {
        remplissageC: this._remplissageC,
        colorBor : this._colorBor,
        strock : this._strock,
       }
   }
    
}

