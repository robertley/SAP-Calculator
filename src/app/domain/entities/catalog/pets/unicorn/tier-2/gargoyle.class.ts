import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Gargoyle extends Pet {
  name = 'Gargoyle';
  tier = 2;
  pack: Pack = 'Unicorn';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new GargoyleAbility(this, this.logService));
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


export class GargoyleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GargoyleAbility',
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

    let power = owner.mana * this.level;
    power = power + 2 * this.level;

    let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
    if (targetsBehindResp.pets.length === 0) {
      return;
    }
    let target = targetsBehindResp.pets[0];

    this.logService.createLog({
      message: `${owner.name} spent ${owner.mana} mana and gave ${power} health to ${target.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetsBehindResp.random,
    });

    target.increaseHealth(power);
    owner.mana = 0;

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GargoyleAbility {
    return new GargoyleAbility(newOwner, this.logService);
  }
}



