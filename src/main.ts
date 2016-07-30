import { AnyAction } from 'dojo-actions/createAction';
import createApp from 'dojo-app/createApp';
import createRoute from 'dojo-routing/createRoute';
import createRouter from 'dojo-routing/createRouter';
import createHashHistory from 'dojo-routing/history/createHashHistory';
import createPanel from 'dojo-widgets/createPanel';
import createTextInput from 'dojo-widgets/createTextInput';
import createWidget from 'dojo-widgets/createWidget';

import * as gameActions from './actions/gameActions';
import createMemoryStore from './utils/createLocalMemoryStore';
import createGameBoard from './widgets/createGameBoard';

const router = createRouter();
const history = createHashHistory();

history.on('change', (event) => {
	router.dispatch({}, event.value);
});

const widgetStore = createMemoryStore({
	data: [
		{
			id: 'game-board',
            children: [],
			classes: []
		}
	]
});

const app = createApp({ defaultStore: widgetStore });

Object.keys(gameActions).forEach((actionName) => {
	const action: AnyAction = (<any> gameActions)[actionName];
	app.registerAction(actionName, action);
});

app.loadDefinition({
	widgets: [
		{
			id: 'game-board',
			factory: createGameBoard,
			listeners: {
                keypress: 'startOrTrigger',
                victory: 'victory'
            }
		}
	],
	customElements: [
		{
			name: 'dojo-widget',
			factory: createWidget
		}
	]
});

app.realize(document.body).then(function() {
    const tickRate = 1;
    const msPerFrame = 1000/tickRate;
    let lastLoop = new Date().getTime();
    setInterval(function() {
        const time = new Date().getTime();
        const diff = (time - lastLoop)/msPerFrame;
        const frames = Math.floor(diff);
        lastLoop = time - (diff - frames) * msPerFrame;
        for (let i = 0; i < frames; i++) {
            gameActions.incrementClock.do();
        }
    }, 1000);
});
