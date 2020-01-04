class TurnStateMachine {
    constructor(scene){
        this.scene = scene;
        this.piece;
        this.destinationTile;
        // 0-> awaiting piece pick,
        // 1-> awaiting tile pick,
        // 2-> awaiting arc animation start,
        // 3-> awaiting arc animation end,
        // 4-> awaiting grow animation start,
        // 5-> awaiting grow animation end,
        // 6-> 
        // -1-> game start
        this.state = 0;
    }
    getTile() {
        return this.destinationTile;
    }
    getPiece() {
        return this.piece;
    }
    pickPiece(piece){
        if(this.state == 0){
            this.piece = piece;
            this.state = 1;
        }
        else if(this.state == 1){
            this.piece = null;
            this.state = 0;
        }
    }

    pickTile(tile){
        if(this.state == 1){
            this.destinationTile = tile;
            this.state = 2;
        }
    }

    startAnimation() {
        if(this.state == 2){
            this.state = 3;
        }
    }

    clean(){
        this.piece = null;
        this.destinationTile = null;
        this.state = 0;
    }
}