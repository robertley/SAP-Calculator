import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { InjectorService } from 'app/services/injector.service';
import { PetFactoryService } from 'app/services/pet/pet-factory.service';
import { PetService } from 'app/services/pet/pet.service';

export class TapirAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TapirAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { tiger, pteranodon } = context;
    const backMostResp = owner.parent.getLastPet(undefined, owner);
    const source = backMostResp.pet;
    if (!source) {
      this.triggerTigerExecution(context);
      return;
    }

    const level = Math.min(3, Math.max(1, this.level));
    const size = level * 10;
    const expValue = level === 1 ? 0 : level === 2 ? 2 : 5;

    const petFactory = InjectorService.getInjector().get(PetFactoryService);
    const petService = InjectorService.getInjector().get(PetService);
    const copy = petFactory.createPet(source, petService, size, size, expValue);
    if (!copy) {
      this.triggerTigerExecution(context);
      return;
    }

    const spawnResult = owner.parent.summonPet(
      copy,
      owner.savedPosition,
      false,
      owner,
    );
    if (spawnResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a ${size}/${size} copy of ${source.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
        randomEvent: spawnResult.randomEvent,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TapirAbility {
    return new TapirAbility(newOwner, this.logService);
  }
}
