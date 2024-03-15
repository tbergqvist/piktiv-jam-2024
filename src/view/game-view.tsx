import { Game } from "../model/game";

export function GameView({game}: {game: Game}) {
	return <div class="">
		{game.val}
	</div>;
}
