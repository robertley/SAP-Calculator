import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Sleepy } from '../../../../equipment/ailments/sleepy.class';

export class BakunawaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Bakunawa Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const opponentPets = owner.parent.opponent.petArray
      .filter((pet) => pet && pet.alive && pet.equipment?.name !== 'Sleepy')
      .sort((a, b) => {
        if (b.attack !== a.attack) {
          return b.attack - a.attack;
        }
        return (a.position ?? 0) - (b.position ?? 0);
      });

    if (opponentPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const targets = opponentPets.slice(
      0,
      Math.min(this.level, opponentPets.length),
    );
    for (const target of targets) {
      const sleepy = new Sleepy();
      sleepy.multiplier += this.level - 1;
      target.givePetEquipment(sleepy);
    }

    const effectMessages = [
      '.',
      ' twice for double effect.',
      ' thrice for triple effect.',
    ];
    const message = `${owner.name} made ${targets.map((pet) => pet.name).join(', ')} Sleepy${effectMessages[Math.min(this.level, effectMessages.length) - 1]}`;

    this.logService.createLog({
      message,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BakunawaAbility {
    return new BakunawaAbility(newOwner, this.logService);
  }
}
