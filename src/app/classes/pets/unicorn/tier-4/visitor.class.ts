import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Icky } from 'app/classes/equipment/ailments/icky.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Visitor extends Pet {
  name = 'Visitor';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 7;
  health = 5;
  initAbilities(): void {
    this.addAbility(new VisitorAbility(this, this.logService));
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


export class VisitorAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'VisitorAbility',
      owner: owner,
      triggers: ['Faint'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getPetsWithinXSpaces(owner, this.level);
    let targets = targetResp.pets.filter(
      (pet) => pet.equipment?.name !== 'Icky',
    );
    if (targets.length == 0) {
      return;
    }

    for (let target of targets) {
      target.givePetEquipment(new Icky());
      this.logService.createLog({
        message: `${owner.name} made ${target.name} Icky.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VisitorAbility {
    return new VisitorAbility(newOwner, this.logService);
  }
}

