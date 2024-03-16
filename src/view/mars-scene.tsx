import { Signal } from "@preact/signals";
import { Image, ImgPos } from "./image";

export interface Params {
  alien1Pos: Signal<ImgPos>;
  alien2Pos: Signal<ImgPos>;
  alien3Pos: Signal<ImgPos>;
  catPos: Signal<ImgPos>;
  allowBlasterClick: Signal<boolean>;
  bacteriaPos: Signal<ImgPos>;
  blasters: Signal<Blaster[]>;
}

export interface Blaster {
  pos: Signal<ImgPos>;
  onClick: ()=>void;
}

export function MarsScene(params: Params) {
  const clickable = params.allowBlasterClick.value;
  return <>
    <Image src="/images/mars.jpg" pos={{x: 0, y: 0, scale: 1}}/>
    <Image src="/images/cat.png" pos={params.catPos.value}/>
    <Image src="/images/alien.png" pos={params.alien1Pos.value} />
    <Image src="/images/alien.png" pos={params.alien2Pos.value} flip/>
    <Image src="/images/alien.png" pos={params.alien3Pos.value} flip/>
    <Image src="/images/bacteria.png" pos={params.bacteriaPos.value}/>
    <div class={clickable ? "clickable" : ""}>
      {params.blasters.value.map(blaster => 
        <Image src="/images/blaster-fire.png" pos={blaster.pos.value} onClick={blaster.onClick} />
      )}
    </div>
  </>;
}