import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../equipment.class';
import { Pack, Pet } from '../../pet.class';
import { Player } from '../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class MimicOctopus extends Pet {
  name = 'Mimic Octopus';
  tier = 6;
  pack: Pack = 'Star';
  attack = 4;
  health = 7;

  initAbilities(): void {
    this.addAbility(new MimicOctopusAbility(this, this.logService));
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


export class MimicOctopusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MimicOctopusAbility',
      owner: owner,
      triggers: ['ThisAttacked'],
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

    let targetsResp = owner.parent.opponent.getLowestHealthPets(
      owner.level,
      undefined,
      owner,
    );

    for (let target of targetsResp.pets) {
      let damage = 4;
      owner.snipePet(target, damage, targetsResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MimicOctopusAbility {
    return new MimicOctopusAbility(newOwner, this.logService);
  }
}
