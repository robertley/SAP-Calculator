import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';
import { canApplyAilment } from 'app/domain/entities/ability-resolution';


export class QuestionMarks extends Pet {
  name = '???';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new QuestionMarksAbility(this, this.logService, this.abilityService),
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


export class QuestionMarksAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'QuestionMarksAbility',
      owner: owner,
      triggers: ['EndTurn'],
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
    const target = owner.petAhead;
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    const attackGain = this.level;
    target.increaseAttack(attackGain);
    if (canApplyAilment(target, 'Spooked')) {
      const spooked = new Spooked();
      spooked.power = -1;
      spooked.originalPower = -1;
      target.givePetEquipment(spooked);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${attackGain} attack and Spooked until next turn.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): QuestionMarksAbility {
    return new QuestionMarksAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}




