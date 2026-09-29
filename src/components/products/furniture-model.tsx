"use client";
import { useEffect } from "react";

export function FurnitureModel({src,poster,alt,ar=false,autoRotate=true,cameraOrbit="0deg 75deg 105%"}:{src:string;poster:string;alt:string;ar?:boolean;autoRotate?:boolean;cameraOrbit?:string}){
  useEffect(()=>{void import("@google/model-viewer")},[]);
  return <model-viewer src={src} poster={poster} alt={alt} camera-controls auto-rotate={autoRotate} camera-orbit={cameraOrbit} ar={ar} ar-modes="webxr scene-viewer quick-look" rotation-per-second="18deg" interaction-prompt="none" shadow-intensity="1" environment-image="neutral" loading="lazy" reveal="auto" style={{width:"100%",height:"100%",background:"linear-gradient(145deg,#f4f1eb,#d9d4ca)"}}/>;
}

export function FurnitureThumbnail({src,alt,cameraOrbit,autoRotate=false}:{src:string;alt:string;cameraOrbit:string;autoRotate?:boolean}){
  useEffect(()=>{void import("@google/model-viewer")},[]);
  return <model-viewer src={src} alt={alt} auto-rotate={autoRotate} camera-orbit={cameraOrbit} rotation-per-second="24deg" interaction-prompt="none" shadow-intensity=".8" environment-image="neutral" loading="eager" reveal="auto" style={{width:"100%",height:"100%",pointerEvents:"none",background:"linear-gradient(145deg,#f4f1eb,#d9d4ca)"}}/>;
}
