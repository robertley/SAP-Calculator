import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { InjectorService } from 'app/services/injector.service';

export class DesertRainFrogAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DesertRainFrogAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const owner = this.owner;
        return owner.parent.trumpets >= 1;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const petService = InjectorService.getInjector().get(PetService);
    let targetTier = Math.min(6, owner.tier + this.level);
    let transformedPet = petService.getRandomFaintPet(owner.parent, targetTier);

    this.logService.createLog({
      message: `${owner.name} transformed into ${transformedPet.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: true,
    });

    owner.parent.spendTrumpets(1, owner, pteranodon);
    owner.parent.transformPet(owner, transformedPet);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DesertRainFrogAbility {
    return new DesertRainFrogAbility(newOwner, this.logService);
  }
}
