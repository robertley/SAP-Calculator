import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class TabbyCat extends Pet {
  name = 'Tabby Cat';
  tier = 2;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new TabbyCatAbility(this, this.logService));
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


export class TabbyCatAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TabbyCatAbility',
      owner: owner,
      triggers: ['FriendlyGainsPerk'],
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

    let targetsResp = owner.parent.getRandomPets(
      2,
      [owner],
      true,
      false,
      owner,
    );
    if (targetsResp.pets.length == 0) {
      return;
    }
    for (let target of targetsResp.pets) {
      if (target != null) {
        this.logService.createLog({
          message: `${owner.name} increased ${target.name}'s health by ${this.level}.`,
          type: 'ability',
          player: owner.parent,
          randomEvent: targetsResp.random,
          tiger: tiger,
        });
        target.increaseHealth(this.level);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TabbyCatAbility {
    return new TabbyCatAbility(newOwner, this.logService);
  }
}
