import { AnyAction } from 'dojo-actions/createAction';
import createApp from 'dojo-app/createApp';
import createRoute from 'dojo-routing/createRoute';
import createRouter from 'dojo-routing/createRouter';
import createHashHistory from 'dojo-routing/history/createHashHistory';
import createPanel from 'dojo-widgets/createPanel';
import createTextInput from 'dojo-widgets/createTextInput';
import createWidget from 'dojo-widgets/createWidget';

import * as storeTodoActions from './actions/storeTodoActions';
import * as uiTodoActions from './actions/uiTodoActions';
import * as widgetTodoActions from './actions/widgetTodoActions';
import createMemoryStore from './utils/createLocalMemoryStore';
import createCheckboxInput from './widgets/createCheckboxInput';
import createTodoList from './widgets/createTodoList';
import createGameBoard from './widgets/createGameBoard';

const router = createRouter();
const history = createHashHistory();

history.on('change', (event) => {
	router.dispatch({}, event.value);
});

const todoStore = createMemoryStore({
	data: []
});

const widgetStore = createMemoryStore({
	data: [
		{
			id: 'title',
			label: 'Claw game pre game'
		},
		{
			id: 'game-board',
            children: [],
			classes: ['new-todo']
//			placeholder: 'What needs to be done?'
		}
	]
});

const app = createApp({ defaultStore: widgetStore });

app.registerStore('widget-store', widgetStore);

//Object.keys(storeTodoActions).forEach((actionName) => {
//	const action: AnyAction = (<any> storeTodoActions)[actionName];
//	app.registerAction(actionName, action);
//});
//
//Object.keys(uiTodoActions).forEach((actionName) => {
//	const action: AnyAction = (<any> uiTodoActions)[actionName];
//	app.registerAction(actionName, action);
//});
//
//Object.keys(widgetTodoActions).forEach((actionName) => {
//	const action: AnyAction = (<any> widgetTodoActions)[actionName];
//	action.configure(widgetStore);
//});

//todoStore.observe().subscribe((options: any) => {
//	const { puts, deletes } = options;
//	widgetTodoActions.updateHeaderAndFooter.do(options);
//
//	if (deletes.length) {
//		widgetTodoActions.deleteTodo.do(options);
//	}
//
//	if (puts.length) {
//		widgetTodoActions.putTodo.do(options);
//	}
//});

app.loadDefinition({
	widgets: [
		{
			id: 'game-board',
			factory: createGameBoard
//			listeners: {
//				keypress: 'todoInput'
//			},
		}
	],
	customElements: [
		{
			name: 'dojo-widget',
			factory: createWidget
		}
	]
});

app.realize(document.body);
