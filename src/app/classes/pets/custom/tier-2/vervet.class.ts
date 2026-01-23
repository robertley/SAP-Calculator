import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Vervet extends Pet {
  name = 'Vervet';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 1;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new VervetAbility(this, this.logService));
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


export class VervetAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Vervet Ability',
      owner: owner,
      triggers: ['ThisBought'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;
    const level = this.level;

    const toyName = 'Microwave Oven';
    const toy = (gameApi as any).toyService.createToy(
      toyName,
      owner.parent,
      level,
    );

    if (toy) {
      owner.parent.toy = toy;

      this.logService.createLog({
        message: `${owner.name} was bought and summoned a level ${level} ${toyName}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): VervetAbility {
    return new VervetAbility(newOwner, this.logService);
  }
}
