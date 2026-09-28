import { Hero } from "@/components/sections/hero";
import { Loop } from "@/components/sections/loop";
import { Products } from "@/components/sections/products";
// §3 "Most software arrives too late to matter." — parked for now, not deleted.
// Files are still in src/components/sections/villain.tsx and
// src/components/villain/villain-bars.tsx; re-add the import and the element
// below to bring it back.
// import { Villain } from "@/components/sections/villain";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <Villain /> */}
      <Loop />
      <Products />
    </>
  );
}
