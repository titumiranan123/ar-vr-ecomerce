import type { DetailedHTMLProps, HTMLAttributes } from "react";
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>,HTMLElement> & {
        src?:string; poster?:string; alt?:string; "camera-controls"?:boolean; "auto-rotate"?:boolean; "camera-orbit"?:string; ar?:boolean; "ar-modes"?:string;
        "ios-src"?:string; scale?:string; orientation?:string; "ar-scale"?:"auto"|"fixed"; "ar-placement"?:"floor"|"wall"; "xr-environment"?:boolean;
        exposure?:string; "shadow-softness"?:string; slot?:string;
        "rotation-per-second"?:string; "interaction-prompt"?:string; "shadow-intensity"?:string;
        "environment-image"?:string; loading?:"auto"|"lazy"|"eager"; reveal?:"auto"|"interaction"|"manual";
      };
    }
  }
}
export {};
