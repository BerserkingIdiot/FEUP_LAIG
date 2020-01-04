class TurnStateMachine {
    constructor(scene){
        this.scene = scene;
        this.piece;
        this.destinationTile;
        // 0-> awaiting piece pick (drop animation finished)
        // 1-> awaiting tile pick
        // 2-> starting arc animation and play request
        // 3-> play request returned; awaiting animation end
        // 4-> arc animation end; awaiting request return
        // 5-> arc animation and play request returned; starting grow animation and checkGameEnd request
        // 6-> checkGameEnd returned; awaiting animation end
        // 7-> grow animation ended; awaiting request return
        // 8-> grow animation and checkGameEnd returned; starting updateTurns request
        // 9-> updateTurns returned; starting drop animation
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

    arcAnimationOver() {
        if(this.state == 2) {
            this.state = 4;
        }
        else if (this.state == 3) {
            this.state = 5;
        }
    }

    playRequestOver() {
        if(this.state == 2) {
            this.state = 3;
        }
        else if (this.state == 4) {
            this.state = 5;
        }
    }

    growAnimationOver() {
        if(this.state == 5) {
            this.state = 7;
        }
        else if (this.state == 6) {
            this.state = 8;
        }
    }

    checkGameEndRequestOver() {
        if(this.state == 5) {
            this.state = 6;
        }
        else if (this.state == 7) {
            this.state = 8;
        }
    }

    updateTurnsRequestOver() {
        if(this.state == 8) {
            this.state = 9;
        }
    }

    dropAnimationOver() {
        if(this.state == 9) {
            this.reset();
        }
    }

    reset(){
        this.piece = null;
        this.destinationTile = null;
        this.state = 0;
    }
}