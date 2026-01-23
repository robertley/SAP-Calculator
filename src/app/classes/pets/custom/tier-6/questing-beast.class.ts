import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { InjectorService } from 'app/services/injector.service';
import { ToyService } from 'app/services/toy/toy.service';
import { getRandomInt } from 'app/util/helper-functions';


export class QuestingBeast extends Pet {
  name = 'Questing Beast';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 7;
  health = 9;
  initAbilities(): void {
    this.addAbility(new QuestingBeastAbility(this, this.logService));
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


export class QuestingBeastAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'QuestingBeastAbility',
      owner: owner,
      triggers: ['ThisSold'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const level = Math.max(1, Math.min(3, this.level));
    const toyService = InjectorService.getInjector().get(ToyService);
    const availableToys = toyService.toys.get(level) ?? [];
    if (availableToys.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const toyName = availableToys[getRandomInt(0, availableToys.length - 1)];
    const newToy = toyService.createToy(toyName, owner.parent, level);
    if (!newToy) {
      this.triggerTigerExecution(context);
      return;
    }

    owner.parent.toy = newToy;
    owner.parent.toy.used = false;
    owner.parent.toy.triggers = 0;

    this.logService.createLog({
      message: `${owner.name} created a level ${level} ${toyName} toy.`,
      type: 'ability',
      player: owner.parent,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): QuestingBeastAbility {
    return new QuestingBeastAbility(newOwner, this.logService);
  }
}
