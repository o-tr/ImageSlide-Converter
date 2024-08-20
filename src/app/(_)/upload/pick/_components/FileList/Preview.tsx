import {FC, useEffect, useRef} from "react";

export const Preview: FC<{ canvas: HTMLCanvasElement }> = ({ canvas }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(()=>{
    canvas.classList.add("object-contain","max-h-32","max-w-32");
    ref.current?.append(canvas);
    return ()=>void ref.current?.removeChild(canvas);
  },[]);
  
  return <div className={"w-128 text-center"} ref={ref}/>
};
