class TurnStateMachine {
    constructor(scene){
        this.scene = scene;
        this.piece;
        this.destinationTile;
        this.state = 0;  // 0 -> awaiting piece pick, 1-> awaiting tile pick, 2->awaiting animation end, -1 -> game start
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

    clean(){
        this.piece = null;
        this.destinationTile = null;
        this.state = 0;
    }
}