import { Signal } from "@preact/signals";

export type Game = ReturnType<typeof createGame>;
export function createGame() {
	const val = new Signal(1);

	setInterval(()=> {
		val.value += 1;
	}, 1000);

	return {val};
}