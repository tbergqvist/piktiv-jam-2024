export interface ImgPos {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
}

export interface ImgParams {
  src: string;
  pos: ImgPos;
  onClick?: ()=>void;
}

export function Image(params: ImgParams) {
  let style = `position: absolute; top: ${params.pos.y}px; left: ${params.pos.x}px;`;
  if (params.pos.scale !== undefined) {
    style += `scale:${params.pos.scale};`;
  }
  if (params.pos.rotation !== undefined) {
    console.log("rot", params.pos.rotation);
    style += `rotate:${params.pos.rotation}deg;`;
  }
  return <img src={params.src} style={style} draggable={false} onClick={(e) => {
    if (params.onClick !== undefined) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      params.onClick();
    }
  }}>
  </img>
}