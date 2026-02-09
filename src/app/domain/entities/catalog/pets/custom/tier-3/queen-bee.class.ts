import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class QueenBee extends Pet {
  name = 'Queen Bee';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 2;
  health = 6;

  override initAbilities(): void {
    this.addAbility(new QueenBeeAbility(this, this.logService));
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


export class QueenBeeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Queen Bee Ability',
      owner: owner,
      triggers: ['BeeSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon, triggerPet } = context;
    const owner = this.owner;
    const bee = triggerPet;

    if (!bee || bee.name !== 'Bee') {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = this.level * 3;
    bee.increaseAttack(buff);
    bee.increaseHealth(buff);

    const removedCount = this.removeOtherQueenBees(owner);

    this.logService.createLog({
      message: `${owner.name} gave ${bee.name} +${buff}/+${buff} and removed ${removedCount} other Queen Bees.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  private removeOtherQueenBees(owner: Pet): number {
    const toProcess = [owner.parent, owner.parent.opponent];
    let removed = 0;

    for (const player of toProcess) {
      for (const pet of [...player.petArray]) {
        if (pet !== owner && pet.alive && pet.name === 'Queen Bee') {
          pet.health = 0;
          player.handleDeath(pet);
          removed++;
        }
      }
      player.removeDeadPets();
    }

    return removed;
  }

  override copy(newOwner: Pet): QueenBeeAbility {
    return new QueenBeeAbility(newOwner, this.logService);
  }
}


