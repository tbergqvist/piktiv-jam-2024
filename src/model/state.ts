export interface SaveState {
	level: number;
}

export function saveState(state: SaveState) {
  localStorage.setItem("jam-2024", JSON.stringify(state));
}

export function loadState() : SaveState {
  const currentState = localStorage.getItem("jam-2024");
	const item = currentState == undefined ? undefined : JSON.parse(currentState) as SaveState;
  return item ?? { level: 0};
}