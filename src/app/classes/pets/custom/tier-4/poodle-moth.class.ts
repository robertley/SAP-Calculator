import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class PoodleMoth extends Pet {
  name = 'Poodle Moth';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 3;
  health = 5;

  override initAbilities(): void {
    this.addAbility(new PoodleMothAbility(this, this.logService));
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


export class PoodleMothAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Poodle Moth Ability',
      owner: owner,
      triggers: ['FriendTransformed'],
      abilityType: 'Pet',
      maxUses: owner.level,
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (!triggerPet || triggerPet.parent !== owner.parent) {
      this.triggerTigerExecution(context);
      return;
    }

    const expGain = 3;
    triggerPet.increaseExp(expGain);
    this.logService.createLog({
      message: `${owner.name} gave ${triggerPet.name} +${expGain} experience after transforming.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): PoodleMothAbility {
    return new PoodleMothAbility(newOwner, this.logService);
  }
}
