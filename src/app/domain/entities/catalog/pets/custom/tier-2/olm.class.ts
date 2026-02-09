import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';


export class Olm extends Pet {
  name = 'Olm';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 1;
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

  override initAbilities(): void {
    this.addAbility(new OlmAbility(this, this.logService));
    super.initAbilities();
  }
}


export class OlmAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'OlmAbility',
      owner: owner,
      triggers: ['Faint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;

    const rolls =
      owner.parent === gameApi.player
        ? gameApi.playerRollAmount || 0
        : gameApi.opponentRollAmount || 0;
    const excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Spooked',
      owner,
    );
    const targetResp = owner.parent.opponent.getRandomPet(
      excludePets,
      null,
      true,
      null,
      owner,
    );
    const target = targetResp.pet;

    if (!target) {
      return;
    }

    const spooked = new Spooked();
    if (rolls > 0) {
      spooked.multiplier += rolls;
    }
    const multiplierMessage =
      spooked.multiplier > 1 ? ` ${spooked.multiplier}x` : '';
    this.logService.createLog({
      message: `${owner.name} made ${target.name}${multiplierMessage} Spooked.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });
    target.givePetEquipment(spooked);

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OlmAbility {
    return new OlmAbility(newOwner, this.logService);
  }
}




