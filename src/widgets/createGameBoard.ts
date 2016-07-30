import { ComposeFactory } from 'dojo-compose/compose';
import createButton from 'dojo-widgets/createButton';
import createWidget, { Widget, WidgetState, WidgetOptions } from 'dojo-widgets/createWidget';
import createParentMixin, { ParentListMixin, ParentListMixinOptions } from 'dojo-widgets/mixins/createParentListMixin';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createVNodeEvented from 'dojo-widgets/mixins/createVNodeEvented';
import createStatefulChildrenMixin, { StatefulChildrenState, StatefulChildrenOptions } from 'dojo-widgets/mixins/createStatefulChildrenMixin';
import { Child } from 'dojo-widgets/mixins/interfaces';

import { h, VNode } from 'maquette/maquette';
import { VNodeProperties } from 'maquette/maquette';

import createPixel, { Pixel } from './createPixel';
import createRectangle, { Rectangle, RectangleOptions, Point, createPoint } from '../utils/createRectangle';

export interface GameBoardState extends WidgetState, StatefulChildrenState {
	started?: boolean;
    triggered?: boolean;
	stage?: number;
    topOffset?: number;
    sideOffset?: number;
}

interface Stage {
    targetBlock: Rectangle;
    leftBound: Rectangle;
    rightBound: Rectangle;
}

export type GameBoard = Widget<GameBoardState> & ParentListMixin<Child>;

export interface GameBoardFactory extends ComposeFactory<GameBoard, any> { }

const numColumns = 6;
const numRows = 15;

function createStage(stage?: number): Stage {
    stage = stage || 1;
    switch (stage) {
        case 1:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 7)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 8),
                    bottomRight: createPoint(1, 14)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 8),
                    bottomRight: createPoint(6, 14)
                })
            };
        case 2:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 6)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 7),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 7),
                    bottomRight: createPoint(6, 12)
                })
            };
        case 3:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 5)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 8),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 8),
                    bottomRight: createPoint(6, 12)
                })
            };
        case 4:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 4)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 9),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 9),
                    bottomRight: createPoint(6, 12)
                })
            };
        case 5:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 3)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 10),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 10),
                    bottomRight: createPoint(6, 12)
                })
            };
        case 6:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 2)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 10),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 10),
                    bottomRight: createPoint(6, 12)
                })
            };
        case 7:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 2)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 11),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 11),
                    bottomRight: createPoint(6, 12)
                })
            };
        case 8:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 1)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 11),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 11),
                    bottomRight: createPoint(6, 12)
                })
            };
        case 9:
            return {
                targetBlock: createRectangle({
                    topLeft: createPoint(3, 1),
                    bottomRight: createPoint(4, 1)
                }),
                leftBound: createRectangle({
                    topLeft: createPoint(1, 12),
                    bottomRight: createPoint(1, 12)
                }),
                rightBound: createRectangle({
                    topLeft: createPoint(6, 12),
                    bottomRight: createPoint(6, 12)
                })
            };
    }
}

function manageChildren() {
	const gameBoard = <GameBoard> this;
    const stageBounds = createStage(gameBoard.state.stage);
    if (!stageBounds) {
        gameBoard.emit({ type: 'victory' });
        return;
    }
    const adjustedBounds = {
        targetBlock: stageBounds.targetBlock.moveVertical(gameBoard.state.topOffset || 0),
        leftBound: stageBounds.leftBound.moveHorizontal(gameBoard.state.sideOffset || 0),
        rightBound: stageBounds.rightBound.moveHorizontal(-1 * (gameBoard.state.sideOffset || 0))
    };
    gameBoard.children.forEach(function(child) {
        const pixel = <Pixel> child;
        if (adjustedBounds.targetBlock.contains(<Point> pixel.state)) {
            pixel.setState({
                c: pixel.state.c,
                r: pixel.state.r,
                color: 'yellow'
            });
        } else if (adjustedBounds.leftBound.contains(<Point> pixel.state) || adjustedBounds.rightBound.contains(<Point> pixel.state)) {
            pixel.setState({
                c: pixel.state.c,
                r: pixel.state.r,
                color: 'blue'
            });
        } else {
            pixel.setState({
                c: pixel.state.c,
                r: pixel.state.r,
                color: null
            });
        }
    });
}

export function isWinningState(gameBoard: GameBoardState) {
    const stageBounds = createStage(gameBoard.stage);
    const adjustedBounds = {
        targetBlock: stageBounds.targetBlock.moveVertical(gameBoard.topOffset || 0),
        leftBound: stageBounds.leftBound.moveHorizontal(1 + (gameBoard.sideOffset || 0))
    };

    return adjustedBounds.leftBound.intersects(adjustedBounds.targetBlock);
}

const createGameBoard: GameBoardFactory = createWidget
	.mixin(createParentMixin)
	.mixin(createRenderableChildrenMixin)
	.mixin(createStatefulChildrenMixin)
	.mixin({
		mixin: createParentMixin,
		initialize(instance) {
            const children =
                Array(numRows).fill(null).map((_, i) => i + 1).reduce((prev, next) => prev.concat(
                    Array(numColumns).fill(null).map((_, i) => createPixel({ state: { c: (i + 1), r: next } }))
                ), []);
            instance.append(children);
            instance.on('statechange', manageChildren);
		},
        aspectAdvice: {
            before: {
                getNodeAttributes(overrides: VNodeProperties = {}) {
                    overrides.tabIndex = 1;
                    return [ overrides ];
                }
            }
        }
	})
    .mixin(createVNodeEvented)
	.extend({
		tagName: 'div',
        get classes(): string[] {
            return [ 'lights' ];
        },
        getChildrenNodes(): VNode[] {
            const gameBoard = <GameBoard> this;
            return gameBoard.children.toArray().map(_ => _.render());
        }
	});

export default createGameBoard;
