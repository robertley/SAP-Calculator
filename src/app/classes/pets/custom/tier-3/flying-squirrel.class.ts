import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { ToyService } from 'app/services/toy/toy.service';
import { InjectorService } from 'app/services/injector.service';


export class FlyingSquirrel extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Flying Squirrel';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 3;
    this.health = 3;
  }

  initAbilities(): void {
    this.abilityList = [new FlyingSquirrelAbility(this, this.logService)];
    super.initAbilities();
  }
}


export class FlyingSquirrelAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FlyingSquirrelAbility',
      owner: owner,
      triggers: ['FriendlyToyBroke'],
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

    let power = this.level * 2;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    target.increaseAttack(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${power} attack`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    if (owner.parent.brokenToy == null) {
      return;
    }
    const newToy = InjectorService.getInjector()
      .get(ToyService)
      .createToy(owner.parent.brokenToy.name, owner.parent);
    newToy.level = Math.min(this.level, owner.parent.brokenToy.level);

    owner.parent.setToy(newToy);
    this.logService.createLog({
      message: `${newToy.name} respawned (Level ${newToy.level})!`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FlyingSquirrelAbility {
    return new FlyingSquirrelAbility(newOwner, this.logService);
  }
}
