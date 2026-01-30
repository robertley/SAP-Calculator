import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability } from 'app/classes/ability.class';
import { AbilityContext } from 'app/classes/ability.class';


export class Ant extends Pet {
  name = 'Ant';
  tier = 1;
  pack: Pack = 'Turtle';
  health = 2;
  attack = 2;
  initPet(
    exp: number,
    health: number,
    attack: number,
    mana: number,
    equipment: Equipment,
    triggersConsumed?: number,
  ): void {
    this.addAbility(new AntAbility(this, this.logService));
    super.initPet(exp, health, attack, mana, equipment, triggersConsumed);
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


export class AntAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AntAbility',
      owner: owner,
      triggers: ['Faint'],
      abilityType: 'Pet',
      native: true, // Pet abilities are native
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

    // Use ability level - Tiger system will override this.level during second execution
    const power = this.level;

    const boostResp = owner.parent.getRandomPet(
      [owner],
      true,
      false,
      true,
      owner,
    );
    if (boostResp.pet == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${boostResp.pet.name} ${power} attack and ${power} health.`,
      type: 'ability',
      randomEvent: boostResp.random,
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    boostResp.pet.increaseAttack(power);
    boostResp.pet.increaseHealth(power);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AntAbility {
    return new AntAbility(newOwner, this.logService);
  }
}

