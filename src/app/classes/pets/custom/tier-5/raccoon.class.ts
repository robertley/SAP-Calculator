import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Raccoon extends Pet {
  name = 'Raccoon';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(new RaccoonAbility(this, this.logService));
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


export class RaccoonAbility extends Ability {
  private logService: LogService;

  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RaccoonAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let opponent = owner.parent.opponent;
    let target = opponent.getPetAtPosition(0);
    if (target == null) {
      return;
    }
    if (target.equipment == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} stole ${target.name}'s equipment. (${target.equipment.name})`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });
    owner.givePetEquipment(target.equipment);
    target.removePerk();

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RaccoonAbility {
    return new RaccoonAbility(newOwner, this.logService);
  }
}
