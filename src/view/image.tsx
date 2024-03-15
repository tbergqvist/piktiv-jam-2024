export interface ImgPos {
  x: number;
  y: number;
  scale?: number;
}

export interface ImgParams {
  src: string;
  pos: ImgPos;
  onClick?: ()=>void;
}

export function Image(params: ImgParams) {
  let style = `position: absolute; top: ${params.pos.y}px; left: ${params.pos.x}px;`;
  if (params.pos.scale !== undefined) {
    style += `scale:${params.pos.scale}`;
  }
  return <img src={params.src} style={style} onClick={params.onClick}>
  </img>
}