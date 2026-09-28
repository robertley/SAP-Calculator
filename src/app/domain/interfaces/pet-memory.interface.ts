import type { PetConfig } from 'sap-battle-engine';
/** The editor carries the exact swallowed/copied state accepted by the engine. */
export type PetMemoryState = Pick<PetConfig, Extract<keyof PetConfig,
  'belugaSwallowedPet' | 'sarcasticFringeheadSwallowedPet' |
  `abominationSwallowedPet${string}` | `parrotCopyPet${string}`
>>;
