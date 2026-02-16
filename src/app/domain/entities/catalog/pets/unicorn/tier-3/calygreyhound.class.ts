import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Calygreyhound extends Pet {
  name = 'Calygreyhound';
  tier = 3;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new CalygreyhoundAbility(this, this.logService));
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


export class CalygreyhoundAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CalygreyhoundAbility',
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

    if (owner.mana == 0) {
      return;
    }

    let targetsResp = owner.parent.opponent.getHighestHealthPets(
      2,
      undefined,
      owner,
    );
    let power = this.level * owner.mana;

    for (let target of targetsResp.pets) {
      target.health = Math.max(1, target.health - power);
      this.logService.createLog({
        message: `${owner.name} reduced ${target.name}'s health by ${power} to ${target.health}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    owner.mana = 0;

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CalygreyhoundAbility {
    return new CalygreyhoundAbility(newOwner, this.logService);
  }
}



