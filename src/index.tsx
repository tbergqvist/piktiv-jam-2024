import { hydrate } from 'preact';
import { GameView } from './view/game-view';
import { createGame } from './model/game';
import "./index.css";

const game = createGame();

export function App() {
	return (
		<GameView game={game}/>
	);
}

hydrate(<App />, document.getElementsByTagName("body")[0]);
