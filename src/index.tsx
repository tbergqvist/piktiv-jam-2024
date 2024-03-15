import { hydrate } from 'preact';
import { GameView } from './view/game-view';
import { createGame } from './model/game';
import "./index.css";

const game = createGame();

export function App() {
	return (
		<div class="everything">
			<GameView game={game}/>
		</div>
	);
}

hydrate(<App />, document.getElementsByTagName("body")[0]);
