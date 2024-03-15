import { Signal } from "@preact/signals";
import { HomeClicks, HomeScene } from "../view/home-scene";
import { JSX } from "preact/jsx-runtime";
import { ImgPos } from "../view/image";
import { preloadImages } from "./preload";
import { GameOverScene } from "../view/game-over-scene";
import { MountainScene } from "../view/mountain-scene";
import { loadState, saveState } from "./state";

function animateTo(pos: Signal<ImgPos>, endPos: ImgPos, animationTime: number): Promise<void> {
	const startPos = {
		x: pos.value.x,
		y: pos.value.y,
		scale: pos.value.scale,
	};

	let start = 0;
	return new Promise((resolve) => {
		function step(time: number) {
			if (start == 0) {
				start = time;
			}
			
			const passedTime = time - start;
			if (passedTime >= animationTime) {
				pos.value = endPos;
				return resolve();
			}

			const ratio = passedTime / animationTime;

			pos.value = {
				x: startPos.x * (1 - ratio) + endPos.x * ratio,
				y: startPos.y * (1 - ratio) + endPos.y * ratio,
				scale: startPos.scale! * (1 - ratio) + endPos.scale! * ratio,
			}
			requestAnimationFrame(step);
		}

		requestAnimationFrame(step);
	});
}

export interface Question {
	yesText: string;
	noText: string;
	callback: (response: boolean) => void;
}

export type Game = ReturnType<typeof createGame>;
export function createGame() {
	const currentScene: Signal<JSX.Element | undefined> = new Signal(undefined);
	const currentQuestion: Signal<Question | undefined> = new Signal(undefined);
	const currentText: Signal<string | undefined> = new Signal(undefined);
	let clickPromise: (()=>void) | undefined = undefined;

	preloadImages();

	function setText(text: string | undefined): Promise<void> {
		currentText.value = text;
		return new Promise((resolver)=> {
			clickPromise = resolver;
		});
	}

	function changeScene(scene: JSX.Element) {
		currentScene.value = scene;
	}

	function showQuestion(message: string, yesText: string, noText:string) {
		setText(message);
		return new Promise((resolve)=> {
			currentQuestion.value = {yesText, noText, callback: (val)=> {
				currentQuestion.value = undefined;
				resolve(val);
			}};
		});
	}

	const currentState = loadState();

	async function runGame() {
		const openedDoor = new Signal(false);
		const catPos = new Signal({x: 320, y:420, scale: 0.6} as ImgPos);
		const clickHandlers: Signal<HomeClicks | undefined> = new Signal(undefined);
		changeScene(<HomeScene openedDoor={openedDoor} catPos={catPos} clickHandlers={clickHandlers} />);
			
		if (currentState.level >= 1) {
			openedDoor.value = true;
			catPos.value = { x: 0, y: 0, scale: 0 };
		} else {
			await setText("You are chilling at home with your cute cat Treasure when suddenly...");
			openedDoor.value = true;
			setText("The door opens!");
			await animateTo(catPos, {x: 1050, y: 400, scale: 0.4}, 1000);
			catPos.value = { x: 0, y: 0, scale: 0 };
			await setText("Oh NO!!! Treasure has escaped!");
			const response = await showQuestion("Will you <i>Lost and Found: Lost treasure await rediscovery</i>?", "Of course, I love my cat!", "kbry lol");
			if (!response) {
				setText("You and your cat died thanks to your bad attitude. 🤡");
				changeScene(<GameOverScene/>);
				return;
			}
		}

		saveState({level: 1});
		setText(undefined);
		clickHandlers.value = { door: runMountainScene};
	}

	async function runMountainScene() {
		const ufoPos = new Signal({x: 650, y: 0, scale: 0} as ImgPos);
		const catPos = new Signal({x: 900, y: 350, scale: 0.5} as ImgPos);
		changeScene(<MountainScene ufoPos={ufoPos} catPos={catPos} />);
		await animateTo(ufoPos, {x: 700, y: 100, scale: 0.4}, 1000);
		await Promise.all([
			animateTo(ufoPos, {x: 700, y: -50, scale: 0.5}, 1000),
			animateTo(catPos, {x: 900, y: 150, scale: 0.5}, 1000)
		]);

		await Promise.all([
			animateTo(ufoPos, {x: 1300, y: -50, scale: 0.7}, 1000),
			animateTo(catPos, {x: 1500, y: 150, scale: 0.8}, 1000)
		]);

		await setText("Treasure was just abducted by aliens! 😿");
	}
	
	runGame();

	return {
		currentScene,
		currentText,
		currentQuestion,
		sceneClicked() {
			if (clickPromise !== undefined) {
				clickPromise();
			}
		}
	};
}