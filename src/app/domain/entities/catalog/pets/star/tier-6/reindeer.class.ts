import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Melon } from 'app/domain/entities/catalog/equipment/turtle/melon.class';


export class Reindeer extends Pet {
  name = 'Reindeer';
  tier = 6;
  pack: Pack = 'Star';
  attack = 9;
  health = 6;
  initAbilities(): void {
    this.addAbility(new ReindeerAbility(this, this.logService));
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


export class ReindeerAbility extends Ability {
  private logService: LogService;
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ReindeerAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    target.givePetEquipment(new Melon());
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Melon.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ReindeerAbility {
    return new ReindeerAbility(newOwner, this.logService);
  }
}



