import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Baku extends Pet {
  name = 'Baku';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 1;
  health = 4;
  initAbilities(): void {
    this.addAbility(new BakuAbility(this, this.logService, this.abilityService));
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


export class BakuAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BakuAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const turnNumber = context.gameApi?.turnNumber ?? 0;
    if (turnNumber % 2 !== 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const candidates = owner.parent.petArray.filter(
      (pet) =>
        pet.alive && pet.equipment?.equipmentClass?.startsWith('ailment'),
    );
    if (candidates.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const targets: Pet[] = [];
    const pool = [...candidates];
    while (targets.length < 2 && pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      targets.push(pool[index]);
      pool.splice(index, 1);
    }

    const healthGain = this.level;
    for (const target of targets) {
      target.removePerk();
      target.increaseHealth(healthGain);
    }

    this.logService.createLog({
      message: `${owner.name} replaced ailments with +${healthGain} health on ${targets.map((pet) => pet.name).join(', ')}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: candidates.length > targets.length,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BakuAbility {
    return new BakuAbility(newOwner, this.logService, this.abilityService);
  }
}
