import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class BanggaiCardinalfish extends Pet {
  name = 'Banggai Cardinalfish';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 4;
  health = 7;

  initAbilities(): void {
    this.addAbility(new BanggaiCardinalfishAbility(this, this.logService));
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


export class BanggaiCardinalfishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BanggaiCardinalfishAbility',
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let attackReduction = this.level * 6; // 6/12/18 based on level
    let minimumAttack = 4;

    let targetResp = owner.parent.getAll(true, owner, true);
    for (let targetPet of targetResp.pets) {
      let newAttack = Math.max(
        targetPet.attack - attackReduction,
        minimumAttack,
      );

      targetPet.attack = newAttack;
      this.logService.createLog({
        message: `${owner.name} reduced ${targetPet.name} attack by ${attackReduction} to (${newAttack}).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BanggaiCardinalfishAbility {
    return new BanggaiCardinalfishAbility(newOwner, this.logService);
  }
}
