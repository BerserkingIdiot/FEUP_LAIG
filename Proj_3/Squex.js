class Squex {
    constructor() {
        this.app = new CGFapplication(document.body);
        this.app.init();

        this.startMenu();
    }
    startMenu() {
        this.interface = new MyInterface(false);
        this.scene = new MainMenuScene(this.interface, this);
        this.refresh();
    }
    startGame(player1, player2) {
        this.interface = new MyInterface(true);
        this.scene = new GameScene(this.interface, this, player1, player2);
        this.refresh();
    }
    startEndMenu(gameScene, playerWon, rtt) {
        this.interface = new MyInterface(false);
        this.scene = new EndMenuScene(this.interface, this, gameScene, playerWon, rtt);
        this.refresh();
    }
    refresh() {
        this.app.setScene(this.scene);
        this.app.setInterface(this.interface);
    }
    run() {
        this.app.run();
    }
}