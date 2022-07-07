export class Attributes{
    private _champ_db_stock: String;
    private _champs_event: String;

    public constructor(_champs_event?:String,_champ_db_stock?:String){

}

public get champ_db_stock() {
    return this._champ_db_stock;
}
public get champs_event() {
    return this._champs_event;
}

public set champs_event(tt) {
    this._champs_event = tt;
}

public set champ_db_stock(tt) {
    this.champ_db_stock = tt;
}


}
    