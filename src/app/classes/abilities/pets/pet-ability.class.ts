import {
  Ability,
  AbilityContext,
  AbilityCondition,
  AbilityTrigger,
} from '../../ability.class';
import { Pet } from '../../pet.class';

export interface PetAbilityConfig {
  owner: Pet;
  name: string;
  triggers: AbilityTrigger[];
  maxUses?: number;
  abilityLevel?: number;
  native?: boolean;
  ignoreRepeats?: boolean;
  alwaysIgnorePetLevel?: boolean;
  condition?: AbilityCondition;
}

export abstract class PetAbility extends Ability {
  constructor(config: PetAbilityConfig) {
    super({
      name: config.name,
      owner: config.owner,
      triggers: config.triggers,
      abilityType: 'Pet',
      maxUses: config.maxUses,
      abilitylevel: config.abilityLevel,
      native: config.native ?? true,
      ignoreRepeats: config.ignoreRepeats,
      alwaysIgnorePetLevel: config.alwaysIgnorePetLevel,
      condition: config.condition,
      abilityFunction: (context: AbilityContext) => {
        this.executeAbility(context);
      },
    });
  }

  protected abstract executeAbility(context: AbilityContext): void;
}
