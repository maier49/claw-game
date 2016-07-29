import { ComposeFactory } from 'dojo-compose/compose';
import createWidget, { Widget, WidgetState, WidgetOptions } from 'dojo-widgets/createWidget';
import createParentMixin, { ParentMapMixin, ParentMapMixinOptions } from 'dojo-widgets/mixins/createParentMapMixin';
import createRenderableChildrenMixin from 'dojo-widgets/mixins/createRenderableChildrenMixin';
import createStatefulChildrenMixin, { StatefulChildrenState, StatefulChildrenOptions } from 'dojo-widgets/mixins/createStatefulChildrenMixin';
import { Child } from 'dojo-widgets/mixins/interfaces';

import { h, VNode } from 'maquette/maquette';

interface PixelState extends WidgetState, StatefulChildrenState {
	c?: number;
	r?: number;
    color?: string;
}

export type Pixel = Widget<PixelState> & ParentMapMixin<Child>;
export interface PixelOptions extends WidgetOptions<PixelState>, ParentMapMixinOptions<Widget<PixelState>>, StatefulChildrenOptions<Child, PixelState> { }

export interface PixelFactory extends ComposeFactory<Pixel, PixelOptions> { }

function manageChildren() {
//	const gameBoard = <GameBoard> this;
//
//
//
//	label.setState({
//		label: todoItem.state.label
//	});
//
//	editInput.setState({
//		value: todoItem.state.label,
//		focused: todoItem.state.editing
//	});
//
//	checkbox.setState({
//		checked: todoItem.state.completed
//	});
}

const createPixel: PixelFactory = createWidget
	.mixin(createParentMixin)
	.mixin(createRenderableChildrenMixin)
	.mixin(createStatefulChildrenMixin)
	.mixin({
		mixin: createParentMixin
	})
	.mixin({
		mixin: {
            get classes(): string[] {
                const pixel = <Pixel> this;
                const columnClass = 'c' + pixel.state.c;
                const rowClass = 'r' + pixel.state.r;
                return [ 'pixel', columnClass, rowClass, columnClass + rowClass ].concat(
                    pixel.state.color ? [ pixel.state.color ] : []
                );
            },
			getChildrenNodes(): VNode[] {
                return [
                    'top-left',
                    'top',
                    'top-right',
                    'left',
                    'center',
                    'right',
                    'bottom-left',
                    'bottom',
                    'bottom-right'
                ].map(position => h('div.subpixel.' + position, {}));
			}
		}
	})
	.extend({
		tagName: 'div'
	});

export default createPixel;