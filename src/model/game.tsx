import { Signal } from "@preact/signals";
import { HomeClicks, HomeScene } from "../view/home-scene";
import { JSX } from "preact/jsx-runtime";
import { ImgPos } from "../view/image";
import { preloadImages, preloadSounds } from "./preload";
import { GameOverScene } from "../view/game-over-scene";
import { MountainClicks, MountainScene } from "../view/mountain-scene";
import { loadState, saveState } from "./state";
import { SpaceStationClickHandlers, SpaceStationScene } from "../view/space-station-scene";
import { Blaster, MarsScene } from "../view/mars-scene";

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
				pos.value = {
					...pos.value,
					...endPos
				}
				return resolve();
			}

			const ratio = passedTime / animationTime;

			pos.value = {
				...pos.value,
				x: startPos.x * (1 - ratio) + endPos.x * ratio,
				y: startPos.y * (1 - ratio) + endPos.y * ratio,
				scale: startPos.scale! * (1 - ratio) + endPos.scale! * ratio
			}
			requestAnimationFrame(step);
		}

		requestAnimationFrame(step);
	});
}

function rotateTo(pos: Signal<ImgPos>, endRotation: number, animationTime: number): Promise<void> {
	const startRotation = pos.value.rotation ?? 0;

	let start = 0;
	return new Promise((resolve) => {
		function step(time: number) {
			if (start == 0) {
				start = time;
			}
			
			const passedTime = time - start;
			if (passedTime >= animationTime) {
				pos.value = {
					...pos.value,
					rotation: endRotation
				};
				return resolve();
			}

			const ratio = passedTime / animationTime;
			pos.value = {
				...pos.value,
				rotation: startRotation * (1 - ratio) + endRotation * ratio,
			}
			requestAnimationFrame(step);
		}

		requestAnimationFrame(step);
	});
}

function delay(time: number) {
	return new Promise((resolve)=> {
		setTimeout(resolve, time);
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
	const sounds = preloadSounds();

	function setText(text: string | undefined, soundName?: string): Promise<void> {
		currentText.value = text;
		return new Promise((resolver)=> {
			clickPromise = ()=> {
				if (soundName !== undefined) {
					playSound(soundName);
				}
				resolver();
			};
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
	function save(level: number) {
		if (level > currentState.level) {
			currentState.level = level;
			saveState({level});
		}
	}

	function playSound(name: string) {
		const audio = sounds[name];
		audio.play();
	}

	async function runGame() {
		const openedDoor = new Signal(false);
		const catPos = new Signal({x: 320, y:420, scale: 0.6} as ImgPos);
		const clickHandlers: Signal<HomeClicks | undefined> = new Signal(undefined);
		changeScene(<HomeScene openedDoor={openedDoor} catPos={catPos} clickHandlers={clickHandlers} />);
			
		if (currentState.level >= 1) {
			openedDoor.value = true;
			catPos.value = { x: 0, y: 0, scale: 0 };
		} else {
			await setText("You are chilling at home with your cute cat Treasure when suddenly...", "cat");
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

		save(1);
		setText(undefined);
		clickHandlers.value = { door: runMountainScene };
	}

	async function runMountainScene() {
		const ufoPos = new Signal({x: 650, y: 0, scale: 0} as ImgPos);
		const catPos = new Signal({x: 900, y: 350, scale: 0.5} as ImgPos);
		const clickHandlers: Signal<MountainClicks | undefined> = new Signal(undefined);
		changeScene(<MountainScene ufoPos={ufoPos} catPos={catPos} clickHandlers={clickHandlers}/>);
		if (currentState.level >= 2) {
			ufoPos.value = {x: 1300, y: -50, scale: 0.7};
			catPos.value = {x: 1500, y: 150, scale: 0.8};
		} else {
			playSound("spaceship");
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

		setText(undefined);
		save(2);
		clickHandlers.value = {
			bear: async ()=> {
				await setText("Bear: I'm RAD.");
				await setText("Bear: Because I'm radioactive.");
				await setText("Bear: So you should stay away.");
				clickHandlers.value!.bear = async ()=> {
					playSound("scream");
					changeScene(<GameOverScene/>);
					setText("You died from radiation 💀");
					return;
				}
				setText(undefined);
			},
			spaceStation: async()=> {
				await runSpaceStationScene();
			}
		};
	}

	async function runSpaceStationScene() {
		const spaceStationRocket = new Signal(false);
		const astronautVisible = new Signal(true);
		const rocketPos = new Signal({x: 451, y: 285, scale: 1, rotation: 0} as ImgPos);
		const clickHandlers: Signal<SpaceStationClickHandlers> = new Signal({
			astronaut: async ()=> {
				await setText("Astronaut: Hello fellow human!");
				await setText("Astronaut: What a nice day for space travel!");
				setText(undefined);
			},
			spaceRocket: async ()=> {
				const response = await showQuestion("Astronaut: Do you know how to drive one of those rockets?", "Yes", "No");
				if (response) {
					await setText("Astronaut: Cool, here's the keys. Good luck!", "rocket-crash");
					setText(undefined);
					spaceStationRocket.value = true;
					await animateTo(rocketPos, {x: 600, y: -300, scale: 1}, 500);
					await rotateTo(rocketPos, 900, 500);
					await animateTo(rocketPos, {x: 600, y: 400, scale: 1}, 200);
					await setText("Astronaut: LOL! Get rekt", "scream");
					changeScene(<GameOverScene/>);
					setText("You blew up 💀");
				} else {
					await setText("Astronaut: Oki, guess I will drive you then.", "rocket");
					setText(undefined);
					astronautVisible.value = false;
					spaceStationRocket.value = true;
					await animateTo(rocketPos, {x: 451, y: 200, scale: 1}, 500);
					await animateTo(rocketPos, {x: 451, y: -700, scale: 1}, 2000);
					save(3);
					await runMarsScene();
				}
			}
		});

		changeScene(<SpaceStationScene spaceStationRocket={spaceStationRocket} clickHandlers={clickHandlers} rocketPos={rocketPos} astronautVisible={astronautVisible}/>);
	}

	async function runMarsScene() {
		const alien1Pos = new Signal({x: 200, y: 350, scale: 1, rotation: 0} as ImgPos);
		const alien2Pos = new Signal({x: 800, y: 350, scale: 1, rotation: 0} as ImgPos);
		const alien3Pos = new Signal({x: 900, y: 450, scale: 1, rotation: 0} as ImgPos);
		const catPos = new Signal({x: 600, y: 450, scale: 1} as ImgPos);
		const bacteriaPos = new Signal({x: 500, y: 320, scale: 0, rotation: 0} as ImgPos);
		const blasters: Signal<Blaster[]> = new Signal([]);
		const allowBlasterClick = new Signal(true);

		changeScene(<MarsScene catPos={catPos} alien1Pos={alien1Pos} alien2Pos={alien2Pos} alien3Pos={alien3Pos} bacteriaPos={bacteriaPos} blasters={blasters} allowBlasterClick={allowBlasterClick}/>);
		await setText("You arrive on Mars and you see Treasure surrounded by aliens!");
		await animateTo(alien1Pos, {x: 500, y: 350, scale: 1.5}, 1000);
		const response = await showQuestion("The first alien stands in your way. What do you do?", "Use your superior intellect to debate them", "Sneeze on them");
		if (response)
		{
			playSound("blaster1");
			await setText("The alien shoots you with a blaster! 🔫", "scream");
			changeScene(<GameOverScene/>);
			await setText("You got shoot and died 💥");
			return;
		}

		playSound("sneeze");
		await Promise.all([
			setText("You sneeze on the alien"),
			animateTo(bacteriaPos, {...bacteriaPos.value, scale: 1}, 300)
		]);
		playSound("alien-screaming");
		await setText("The alien died!");
		setText(undefined);
		alien1Pos.value = {...alien1Pos.value, scale: 0};
		bacteriaPos.value = {...bacteriaPos.value, scale: 0};
		await animateTo(alien2Pos, {x: 500, y: 350, scale: 1.5}, 1000);
		const response2 = await showQuestion("The second alien steps up and your nose is no longer loaded with biological warfare. What will you do?", "Give them a piece of Liquorice", "Do a dance move");
		if (!response2)
		{
				await setText("You do a sick dance move!");
				await setText("The move had no effect...");
				playSound("blaster1");
				await setText("The alien shoots you with his blaster 🔫");
				await setText("It's super effective!", "scream");
				changeScene(<GameOverScene/>);
				await setText("You died 😢");
				return;
		}
		playSound("alien-screaming");
		await setText("You give a piece of liquorice to the alien and they die instantly since liquorice is disgusting and no living thing could possible survive such a horrible taste.");
		alien2Pos.value = {...alien1Pos.value, scale: 0};
		setText(undefined);
		await animateTo(alien3Pos, {x: 500, y: 350, scale: 1.5}, 1000);
		const response3 = await showQuestion("The final alien steps up and points his blaster at you!", "Parry", "Start crying");
		if (!response3)
		{
			await setText("You start crying.");
			playSound("blaster1");
			await setText("The alien shoots you.", "scream");
			changeScene(<GameOverScene/>);
			await setText("You're dead 👽");
			return;
		}

		function spawnBlaster() : Promise<boolean> {
			let pos = new Signal({x: Math.random() * (1280 - 250), y: Math.random() * (720 - 250), scale: 1});
			const newBlaster: Blaster = {
				pos,
				onClick() {
					pos.value = {
						...pos.value,
						scale: 0
					};
				}
			};
			blasters.value = [...blasters.value, newBlaster];
			return new Promise((resolve)=> {
				setTimeout(() => {
					resolve(newBlaster.pos.value.scale === 0);
				}, 1500);
			})
		}
		setText("Click the blaster fire to parry!");
		const bla1 = spawnBlaster();
		playSound("blaster1");
		await delay(300);
		const bla2 = spawnBlaster();
		playSound("blaster2");
		await delay(200);
		const bla3 = spawnBlaster();
		playSound("blaster3");
		await delay(500);
		const bla4 = spawnBlaster();
		playSound("blaster4");
		const blasterResults = await Promise.all([bla1, bla2, bla3, bla4]);
		if (!blasterResults.every(a => a)) {
			allowBlasterClick.value = false;
			await setText("You failed to parry...", "scream");
			changeScene(<GameOverScene/>);
			await setText("Too slow, git gud 🐌");
			return;
		}
		playSound("alien-screaming");
		await setText("You parry all the shoots and manage to kill the alien!");
		alien3Pos.value = {...alien3Pos.value, scale: 0};
		playSound("cat");
		await Promise.all([
			setText("Treasure jumps up in your lap and you return safely to earth."),
			animateTo(catPos, {...catPos.value, scale: 10}, 1000)
		]);

		await runHomeEndScene();
	}

	async function runHomeEndScene() {
		const openedDoor = new Signal(false);
		const catPos = new Signal({x: 320, y:420, scale: 0.6} as ImgPos);
		const clickHandlers: Signal<HomeClicks | undefined> = new Signal(undefined);
		changeScene(<HomeScene openedDoor={openedDoor} catPos={catPos} clickHandlers={clickHandlers} />);
		playSound("win");
		await setText("You are back home with Treasure and everyone is happy! THE END");
	}

	if (currentState.level >= 3) {
		runMarsScene();
	} else {
		runGame();
	}

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