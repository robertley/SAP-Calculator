import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { InjectorService } from 'app/services/injector.service';
import { ToyService } from 'app/services/toy/toy.service';
import { getRandomInt } from 'app/util/helper-functions';
import { logAbility } from 'app/classes/ability-helpers';


export class Ferret extends Pet {
  name = 'Ferret';
  tier = 1;
  pack: Pack = 'Puppy';
  attack = 1;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new FerretAbility(this, this.logService, this.abilityService),
    );
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


export class FerretAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'FerretAbility',
      owner: owner,
      triggers: ['StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const toyService = InjectorService.getInjector().get(ToyService);
    const tier = Math.max(1, Math.min(3, this.level));
    const availableToys = toyService.toys.get(tier) ?? [];

    if (availableToys.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const toyName = availableToys[getRandomInt(0, availableToys.length - 1)];
    const newToy = toyService.createToy(toyName, owner.parent, tier);
    if (!newToy) {
      this.triggerTigerExecution(context);
      return;
    }

    owner.parent.toy = newToy;
    owner.parent.toy.used = false;
    owner.parent.toy.triggers = 0;

    logAbility(
      this.logService,
      owner,
      `${owner.name} chose a level ${tier} ${toyName} toy.`,
      context.tiger,
      context.pteranodon,
    );
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FerretAbility {
    return new FerretAbility(newOwner, this.logService, this.abilityService);
  }
}

