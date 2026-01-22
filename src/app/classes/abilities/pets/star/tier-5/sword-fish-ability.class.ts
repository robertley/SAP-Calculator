import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class SwordFishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SwordFishAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const opponent = owner.parent.opponent;
    const highestHealthPetResp = opponent.getHighestHealthPet(undefined, owner);
    const target = highestHealthPetResp.pet;
    const power = owner.attack * this.level;

    if (target) {
      owner.snipePet(
        target,
        power,
        highestHealthPetResp.random,
        tiger,
        pteranodon,
      );
      this.logService.createLog({
        message: `${owner.name} deals ${power} damage to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        sourcePet: owner,
        targetPet: target,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: highestHealthPetResp.random,
      });
    } else {
      this.logService.createLog({
        message: `${owner.name} could not find an enemy to attack.`,
        type: 'ability',
        player: owner.parent,
        sourcePet: owner,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    owner.snipePet(owner, power, false, tiger, pteranodon);
    this.logService.createLog({
      message: `${owner.name} deals ${power} damage to itself.`,
      type: 'ability',
      player: owner.parent,
      sourcePet: owner,
      targetPet: owner,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SwordFishAbility {
    return new SwordFishAbility(newOwner, this.logService);
  }
}
