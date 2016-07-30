import createAction, { AnyAction } from 'dojo-actions/createAction';
import { isWinningState, GameBoardState } from '../widgets/createGameBoard';
import { assign } from 'dojo-core/lang';
import { Widget } from 'dojo-widgets/createWidget';

function configure (app: any) {
    const action = <any> this;
    action.app = app;
}

function patch(widget: any, properties: any) {
    widget.setState(assign(widget.state, properties));
}

const yVel = 1;
const xVel = 1;
let countdown = -1;
export const incrementClock: AnyAction = createAction({
    configure,
    do() {
        const { app } = <any> this;
        app.getWidget('game-board').then(function(gameBoard: Widget<GameBoardState>) {
            if (gameBoard.state.started) {
                countdown ++;
                if (countdown < 0) {
                    return;
                } else if (isWinningState(gameBoard.state)) {
                    countdown = -1;
                    patch(gameBoard, {
                        stage: (gameBoard.state.stage || 1) + 1,
                        triggered: false,
                        topOffset: 0,
                        sideOffset: 0
                    });
                } else if (countdown > 15) {
                    countdown = -1;
                    patch(gameBoard, {
                        started: false,
                        triggered: false,
                        stage: 1,
                        topOffset: 0,
                        sideOffset: 0
                    });
                } else {
                    const currentTopOffset = gameBoard.state.topOffset || 0;
                    const currentSideOffset = gameBoard.state.sideOffset || 0;
                    patch(gameBoard, {
                        topOffset: gameBoard.state.started ? currentTopOffset + yVel : currentTopOffset,
                        sideOffset: gameBoard.state.triggered ? currentSideOffset + xVel : currentSideOffset
                    });
                }
            }
        });
    }
});

export const startOrTrigger: AnyAction = createAction({
    configure,
    do(options: any) {
        const { app } = <any> this;
        if (options.event.keyCode !== 32) {
            return;
        }
        app.getWidget('game-board').then(function(gameBoard: Widget<GameBoardState>) {
           if (gameBoard.state.started) {
               patch(gameBoard, {
                   triggered: true
               });
           } else {
               patch(gameBoard, {
                   started: true
               });
           }
       });
    }
});

export const victory: AnyAction = createAction({
    configure,
    do() {
        document.body.textContent = 'A winner is you!';
    }
});
