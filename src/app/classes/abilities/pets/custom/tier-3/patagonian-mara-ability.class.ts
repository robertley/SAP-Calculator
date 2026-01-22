import { Ability, AbilityContext } from '../../../../ability.class';
import { AbilityService } from 'app/services/ability/ability.service';
import { InjectorService } from 'app/services/injector.service';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { GoldenRetriever } from '../../../../pets/hidden/golden-retriever.class';

export class PatagonianMaraAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Patagonian Mara Ability',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const player = owner.parent;
    const trumpetsGained = 4 * this.level;

    player.gainTrumpets(trumpetsGained, owner, pteranodon);

    const abilityService = InjectorService.getInjector().get(AbilityService);
    const retriever = new GoldenRetriever(
      this.logService,
      abilityService,
      player,
      this.level,
      this.level,
    );
    player.summonPet(retriever, owner.position);

    this.logService.createLog({
      message: `${owner.name} gained ${trumpetsGained} trumpets and summoned a Golden Retriever.`,
      type: 'ability',
      player: player,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): PatagonianMaraAbility {
    return new PatagonianMaraAbility(newOwner, this.logService);
  }
}
