export type PlacementKind="seating"|"table"|"storage";
export type ShowroomProduct={id:string;slug:string;name:string;price:string;model:string;position:[number,number,number];rotation:[number,number,number];scale:number;footprint:[number,number];placementKind:PlacementKind;description:string};
export type ShowroomLayout={position:[number,number,number];rotationY:number};
export const showroomProducts:ShowroomProduct[]=[
 {id:"chair",slug:"aero-lounge-chair",name:"Aero Lounge Chair",price:"৳649",model:"/models/modern-arm-chair.glb",position:[-3.1,0,-1.3],rotation:[0,.65,0],scale:1.15,footprint:[1.45,1.45],placementKind:"seating",description:"Warm oak, deep cushioning and a modern lounge profile."},
 {id:"table",slug:"terra-coffee-table",name:"Terra Wooden Table",price:"৳899",model:"/models/wooden-table.glb",position:[0,0,-2.8],rotation:[0,0,0],scale:1.35,footprint:[2.25,1.35],placementKind:"table",description:"A timeless solid-wood table made for shared moments."},
 {id:"shelf",slug:"rye-sideboard",name:"Rye Display Shelf",price:"৳1,199",model:"/models/wooden-shelves.glb",position:[3.45,0,-3.7],rotation:[0,-.2,0],scale:1.35,footprint:[1.25,.75],placementKind:"storage",description:"Open storage with a warm, architectural rhythm."},
 {id:"stool",slug:"halo-pendant-light",name:"Ember Wooden Stool",price:"৳299",model:"/models/wooden-stool.glb",position:[2.4,0,.2],rotation:[0,-.55,0],scale:1.1,footprint:[.75,.75],placementKind:"seating",description:"Compact natural seating for flexible modern rooms."},
];
export const defaultLayouts=Object.fromEntries(showroomProducts.map(product=>[product.id,{position:[...product.position] as [number,number,number],rotationY:product.rotation[1]}])) as Record<string,ShowroomLayout>;
