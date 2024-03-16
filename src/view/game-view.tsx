import { Game, Question } from "../model/game";

export function QuestionView({question}: {question: Question | undefined}) {
	if (question === undefined) {
		return <></>;
	}

	function handleClick(val: boolean) {
		return (e: Event)=> {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			question!.callback(val);
		}
	}

	return <div class="question">
		<button onClick={handleClick(true)}>
			{question.yesText}
		</button>
		<button onClick={handleClick(false)}>
			{question.noText}
		</button>
	</div>;
}

export function GameView({game}: {game: Game}) {
	const style = game.currentText.value !== undefined ? "pointer-events:none;" : "";
	return <div class="game-area" onClick={game.sceneClicked}>
		<div style={style}>
			{game.currentScene}
			<QuestionView question={game.currentQuestion.value}/>
			{game.currentText.value && <div class="text-area">
				<div class="text-background"></div>
				<span dangerouslySetInnerHTML={{__html: game.currentText.value ?? ""}}></span>
			</div>}
		</div>
	</div>;
}
