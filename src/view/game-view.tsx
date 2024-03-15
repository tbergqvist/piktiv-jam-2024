import { Game, Question } from "../model/game";

export function QuestionView({question}: {question: Question | undefined}) {
	if (question === undefined) {
		return <></>;
	}

	return <div class="question">
		<button onClick={() => question.callback(true)}>
			{question.yesText}
		</button>
		<button onClick={() => question.callback(false)}>
			{question.noText}
		</button>
	</div>;
}

export function GameView({game}: {game: Game}) {
	return <div class="game-area" onClick={game.sceneClicked}>
		{game.currentScene}
		<QuestionView question={game.currentQuestion.value}/>
		{game.currentText.value && <div class="text-area">
			<div class="text-background"></div>
			<span dangerouslySetInnerHTML={{__html: game.currentText.value ?? ""}}></span>
		</div>}
	</div>;
}
