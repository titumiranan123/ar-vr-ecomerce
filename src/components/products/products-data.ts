export type ArProductConfig = {
  scale: string;
  dimensions: string;
  placement: "floor";
  iosModel?: string;
};

export type Product = {
  name: string;
  category: string;
  price: number;
  color: string;
  material: string;
  image: string;
  model: string;
  slug: string;
  ar: ArProductConfig;
};

export const products: Product[] = [
  {name:"Luna Curve Sofa",category:"Sofas",price:1799,color:"White",material:"Fabric",image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",model:"/models/modern-arm-chair.glb",slug:"luna-curve-sofa",ar:{scale:"1 1 1",dimensions:"210 × 96 × 86 cm",placement:"floor"}},
  {name:"Aero Lounge Chair",category:"Chairs",price:649,color:"Green",material:"Fabric",image:"https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=900&q=85",model:"/models/modern-arm-chair.glb",slug:"aero-lounge-chair",ar:{scale:"1 1 1",dimensions:"82 × 90 × 96 cm",placement:"floor"}},
  {name:"Terra Round Coffee Table",category:"Tables",price:899,color:"Beige",material:"Stone",image:"https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=900&q=85",model:"/models/wooden-table.glb",slug:"terra-coffee-table",ar:{scale:"0.9 0.58 0.9",dimensions:"102 × 64 × 46 cm",placement:"floor"}},
  {name:"Nexa Platform Bed",category:"Beds",price:1499,color:"Brown",material:"Wood",image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",model:"/models/wooden-shelves.glb",slug:"nexa-platform-bed",ar:{scale:"1 1 1",dimensions:"168 × 218 × 92 cm",placement:"floor"}},
  {name:"Rye Sideboard",category:"Storage",price:1199,color:"Brown",material:"Wood",image:"https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=85",model:"/models/steel-shelves.glb",slug:"rye-sideboard",ar:{scale:"0.085 0.085 0.085",dimensions:"94 × 42 × 182 cm",placement:"floor"}},
  {name:"Halo Pendant Light",category:"Lighting",price:299,color:"Black",material:"Metal",image:"https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=85",model:"/models/wooden-stool.glb",slug:"halo-pendant-light",ar:{scale:"2.4 2.4 2.4",dimensions:"64 × 64 × 44 cm",placement:"floor"}},
  {name:"Ember Accent Chair",category:"Chairs",price:579,color:"White",material:"Fabric",image:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85",model:"/models/plastic-chair.glb",slug:"ember-accent-chair",ar:{scale:"1 1 1",dimensions:"64 × 63 × 88 cm",placement:"floor"}},
  {name:"Orion Dining Table",category:"Tables",price:1299,color:"Brown",material:"Wood",image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=85",model:"/models/wooden-table.glb",slug:"orion-dining-table",ar:{scale:"1.45 0.94 1.45",dimensions:"164 × 102 × 75 cm",placement:"floor"}},
  {name:"Sol Outdoor Lounger",category:"Outdoor",price:799,color:"White",material:"Rattan",image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",model:"/models/plastic-chair.glb",slug:"sol-outdoor-lounger",ar:{scale:"1.05 1.05 1.05",dimensions:"68 × 78 × 92 cm",placement:"floor"}},
];
