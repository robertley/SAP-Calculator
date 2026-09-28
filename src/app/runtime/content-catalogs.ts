import { catalogs } from 'sap-battle-engine';
// Consumers receive mutable metadata copies for existing form and parser APIs.
type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T;
export const pets = structuredClone(catalogs.pets) as Mutable<typeof catalogs.pets>;
export const toys = structuredClone(catalogs.toys) as Mutable<typeof catalogs.toys>;
export const food = structuredClone(catalogs.food) as Mutable<typeof catalogs.food>;
export const perks = structuredClone(catalogs.perks) as Mutable<typeof catalogs.perks>;
