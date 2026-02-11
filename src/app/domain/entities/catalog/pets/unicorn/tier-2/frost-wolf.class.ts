import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Cold } from 'app/domain/entities/catalog/equipment/ailments/cold.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class FrostWolf extends Pet {
  name = 'Frost Wolf';
  tier = 2;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new FrostWolfAbility(this, this.logService));
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


export class FrostWolfAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FrostWolfAbility',
      owner: owner,
      triggers: ['Faint'],
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

    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Cold',
      owner,
    );
    let targetResp = owner.parent.opponent.getFurthestUpPet(owner, excludePets);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    const coldAilment = new Cold();
    coldAilment.multiplier += this.level - 1;
    coldAilment.baseMultiplier = coldAilment.multiplier;

    let effectMessage = '.';
    if (this.level === 2) {
      effectMessage = ' twice for double effect.';
    } else if (this.level === 3) {
      effectMessage = ' thrice for triple effect.';
    }

    this.logService.createLog({
      message: `${owner.name} made ${target.name} Cold${effectMessage}`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    target.givePetEquipment(coldAilment);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FrostWolfAbility {
    return new FrostWolfAbility(newOwner, this.logService);
  }
}




