import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Bass extends Pet {
  name = 'Bass';
  tier = 2;
  pack: Pack = 'Star';
  attack = 3;
  health = 3;

  initAbilities(): void {
    this.addAbility(new BassAbility(this, this.logService));
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


export class BassAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BassAbility',
      owner: owner,
      triggers: ['Faint', 'ThisSold'],
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

    const excludePets = owner.parent.petArray.filter((pet) => {
      return pet == owner && !pet.isSellPet() && pet.level < 2;
    });

    let targetResp = owner.parent.getRandomPet(
      excludePets,
      true,
      null,
      null,
      owner,
    );
    const target = targetResp.pet;
    if (target == null) {
      return;
    }

    const expGain = this.level;

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${expGain} experience.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    target.increaseExp(expGain);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BassAbility {
    return new BassAbility(newOwner, this.logService);
  }
}

