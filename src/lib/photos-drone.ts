// Dronefoto's van Horsey Valley & Klein Lauw
import d1 from "@/assets/drone/drone-1.jpg.asset.json";
import d2 from "@/assets/drone/drone-2.jpg.asset.json";
import d3 from "@/assets/drone/drone-3.jpg.asset.json";
import d4 from "@/assets/drone/drone-4.jpg.asset.json";
import d5 from "@/assets/drone/drone-5.jpg.asset.json";
import d6 from "@/assets/drone/drone-6.jpg.asset.json";
import d7 from "@/assets/drone/drone-7.jpg.asset.json";
import d8 from "@/assets/drone/drone-8.jpg.asset.json";

export type DronePhoto = { url: string; alt: string };

export const dronePhotos: DronePhoto[] = [
  { url: d1.url, alt: "Luchtfoto van de vakantiewoningen Horsey Valley en Klein Lauw" },
  { url: d2.url, alt: "Dronebeeld van de woningen met tuinen en oprit" },
  { url: d3.url, alt: "Luchtfoto van het landelijke omliggende landschap" },
  { url: d4.url, alt: "Dronebeeld van de woningen vanuit een andere hoek" },
  { url: d5.url, alt: "Luchtfoto met zicht op de velden rond de woningen" },
  { url: d6.url, alt: "Dronebeeld van de achtertuinen van beide woningen" },
  { url: d7.url, alt: "Luchtfoto van de omgeving Tongeren-Borgloon" },
  { url: d8.url, alt: "Dronebeeld van de woningen in Belgisch Limburg" },
];
