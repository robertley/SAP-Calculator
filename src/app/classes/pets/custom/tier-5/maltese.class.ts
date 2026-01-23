import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Maltese extends Pet {
  name = 'Maltese';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new MalteseAbility(this, this.logService));
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


export class MalteseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Maltese Ability',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const player = owner.parent;
    const targetFriend = owner.petBehind();
    if (!targetFriend) {
      this.triggerTigerExecution(context);
      return;
    }

    const trumpetsAvailable = player.trumpets;
    if (trumpetsAvailable > 0) {
      player.spendTrumpets(trumpetsAvailable, owner, context.pteranodon);
    }

    const baseMana = 3 * this.level;
    const perTrumpet = this.level;
    const totalMana = baseMana + trumpetsAvailable * perTrumpet;
    targetFriend.increaseMana(totalMana);

    this.logService.createLog({
      message: `${owner.name} spent ${trumpetsAvailable} trumpets to give ${targetFriend.name} +${totalMana} mana.`,
      type: 'ability',
      player: player,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MalteseAbility {
    return new MalteseAbility(newOwner, this.logService);
  }
}
