/**
 * Created by Xin on 11/05/2017.
 */

class Controller {
  constructor(view, board) {
    this.view = view;   // view obj
    this.board = board; // this is a model obj, not a view obj
    this.evaluator = new Evaluator({ board });
    this.playerI = new Player({
      id: 'o',
    });
    this.playerII = new Master({
      level: 'easy',
      id: 'x',
      evaluator: this.evaluator,
      opponentId: this.playerI.id,
    });
    this.evaluator.setDepth(1);
  }

  init() {
    const { view, board } = this;
    view.addBoardClickListener(this.handleBoardClick.bind(this));
    view.addNewRoundClickListener(this.handleNewRoundBtnClick.bind(this));
    view.addUndoBtnClickListener(this.handleUndoBtnClick.bind(this));
    view.addRedoBtnClickListener(this.handleRedoBtnClick.bind(this));
    board.addMovedListener(this.handleMoved.bind(this));
    board.addWinNotifiedListener(this.handleWinNotified.bind(this));
    board.addPointRemovedListener(this.handlePointRemoved.bind(this));
    this.newRound();
  }

  newRound() {
    let { view, board, playerI, playerII } = this;
    playerI.setStoneType('circle');
    playerII.setStoneType('cross');
    view.newRound();

    board.newRound();
    board.addPlayer(playerI);
    board.addPlayer(playerII);

    board.setCurrentPlayer(playerI);

    console.log('New round!');

    // board.setCurrentPlayer(playerII);
    // playerII.move(7, 7);
  }

  turnover(player) {

    console.log('turnover..');

    const { view, board, playerI, playerII } = this;
    const nextPlayer = player === playerI ? playerII : playerI;
    board.setCurrentPlayer(nextPlayer);
    if (nextPlayer instanceof Master) {
      const move = nextPlayer.think(board.points);
      nextPlayer.move(move.column, move.row);
    }
  }

  handleMoved(point) {

    console.log('handleMoved ', point);

    const self = this;
    const { view, board } = this;
    const { column, row, playerId } = point;
    const player = board.getPlayer(playerId);
    view.addStone(column, row, player.getStoneType());
    // setTimeout(() => {
      if(!board.hasWinner()){
        this.turnover(player);
      }
    // }, 1000);

  }

  handleWinNotified(playerId, sameRowStones) {
    this.view.notifyWin(playerId, sameRowStones);
  }

  handlePointRemoved({ column, row }) {
    this.view.undo(column, row);
  }

  handleBoardClick(column, row) {
    const { board } = this;
    const currentPlayer = board.getCurrentPlayer();
    currentPlayer.move(column, row);
  }

  handleNewRoundBtnClick() {
    this.newRound();
  }

  handleUndoBtnClick() {
    const { board, view } = this;
    const hasCrossLine = board.hasWinner();
    if (hasCrossLine) {
      const sameRowPoints = board.getSameRowPoints();
      const player = board.getPlayer(sameRowPoints[0].playerId);
      view.removeCrossLine(sameRowPoints, player.getStoneType());
    }
    board.undo();
  }

  handleRedoBtnClick() {
    const { board } = this;
    board.redo();
  }
}