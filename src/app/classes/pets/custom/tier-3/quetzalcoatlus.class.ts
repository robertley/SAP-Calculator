import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Quetzalcoatlus extends Pet {
  name = 'Quetzalcoatlus';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 6;

  override initAbilities(): void {
    this.addAbility(new QuetzalcoatlusAbility(this, this.logService));
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


export class QuetzalcoatlusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Quetzalcoatlus Ability',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (!triggerPet || !triggerPet.alive) {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = this.level;
    const targets = triggerPet.parent.petArray.filter((p) => p.alive);

    for (const target of targets) {
      target.increaseAttack(buff);
      target.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} (Faint) gave +${buff}/+${buff} to ${triggerPet.name} and its friends.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): QuetzalcoatlusAbility {
    return new QuetzalcoatlusAbility(newOwner, this.logService);
  }
}

