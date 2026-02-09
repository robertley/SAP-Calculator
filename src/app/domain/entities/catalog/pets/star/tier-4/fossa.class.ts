import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Fossa extends Pet {
  name = 'Fossa';
  tier = 4;
  pack: Pack = 'Star';
  attack = 6;
  health = 5;

  initAbilities(): void {
    this.addAbility(new FossaAbility(this, this.logService));
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


export class FossaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FossaAbility',
      owner: owner,
      triggers: ['StartBattle'],
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

    const isPlayer = owner.parent === gameApi.player;
    const rollAmount = isPlayer
      ? gameApi.playerRollAmount
      : gameApi.opponentRollAmount;

    if (rollAmount <= 0) {
      return;
    }

    const healthToRemove = this.level * rollAmount;

    let targetResp = owner.parent.opponent.getFurthestUpPets(
      2,
      undefined,
      owner,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }

    for (let target of targets) {
      this.logService.createLog({
        message: `${owner.name} removed ${healthToRemove} health from ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });

      target.increaseHealth(-healthToRemove);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FossaAbility {
    return new FossaAbility(newOwner, this.logService);
  }
}


