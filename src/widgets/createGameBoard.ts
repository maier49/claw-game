import { ComposeFactory } from 'dojo-compose/compose';
import createButton from 'dojo-widgets/createButton';
import createWidget, { Widget, WidgetState, WidgetOptions } from 'dojo-widgets/createWidget';
import createParentMixin, { ParentListMixin, ParentListMixinOptions } from 'dojo-widgets/mixins/createParentListMixin';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createStatefulChildrenMixin, { StatefulChildrenState, StatefulChildrenOptions } from 'dojo-widgets/mixins/createStatefulChildrenMixin';
import { Child } from 'dojo-widgets/mixins/interfaces';

import { h, VNode } from 'maquette/maquette';

import createPixel, { Pixel } from './createPixel';
import { todoRemove, todoToggleComplete, todoEdit, todoSave, todoEditInput }  from './../actions/uiTodoActions';

interface GameBoardState extends WidgetState, StatefulChildrenState {
	running?: boolean;
	stage?: number;
}

export type GameBoard = Widget<GameBoardState> & ParentListMixin<Child>;

export interface GameBoardFactory extends ComposeFactory<GameBoard, any> { }

const numColumns = 6;
const numRows = 15;

function stageToBounds(stage?: number) {
    //TODO - handle multiple stages and create 'rectangle' interface/factory
    return {
        yellow: [{
            topLeft: {
                c: 2,
                r: 1
            },
            bottomRight: {
                c: 5,
                r: 5
            }
        }],
        blue: [
            {
                topLeft: {
                    c: 1,
                    r: 8
                },
                bottomRight: {
                    c: 1,
                    r: 12
                }
            },
            {
                topLeft: {
                    c: 6,
                    r: 8
                },
                bottomRight: {
                    c: 6,
                    r: 12
                }
            }
        ]
    }
}

function isPointInRect(
    rectangle: { topLeft: { c: number; r: number; }; bottomRight: { c: number; r: number}},
    point: { c?: number; r?: number; }) {
    return rectangle.topLeft.c <= point.c && point.c <= rectangle.bottomRight.c &&
        rectangle.topLeft.r <= point.r && point.r <= rectangle.bottomRight.r;
}

function manageChildren() {
	const gameBoard = <GameBoard> this;
    const bounds = stageToBounds(gameBoard.state.stage);
    gameBoard.children.forEach(function(child) {
        const pixel = <Pixel> child;
        if (bounds.yellow.some(rectangle => isPointInRect(<any> rectangle, pixel.state))) {
            pixel.setState({
                c: pixel.state.c,
                r: pixel.state.r,
                color: 'yellow'
            });
        } else if (bounds.blue.some(rectangle => isPointInRect(<any> rectangle, pixel.state))) {
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
		}
	})
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
