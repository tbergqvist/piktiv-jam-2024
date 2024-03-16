import { Signal } from "@preact/signals";
import { Image, ImgPos } from "./image";

export interface Params {
  openedDoor: Signal<boolean>;
  catPos: Signal<ImgPos>;
  clickHandlers: Signal<HomeClicks | undefined>;
}

export interface HomeClicks {
  door: ()=>void;
}

export function HomeScene(params: Params) {
  return <>
    <Image src="./images/home.jpg" pos={{x: 0, y: 0, scale: 1}}/>
    {params.openedDoor.value && <Image src="./images/open-door.jpg" pos={{x: 1040, y: 270}} onClick={()=> {params.clickHandlers.value?.door()}}/>}
		<Image src="./images/cat.png" pos={params.catPos.value}/>
  </>;
}