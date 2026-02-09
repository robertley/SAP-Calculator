import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ant } from '../../turtle/tier-1/ant.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Anteater extends Pet {
  name = 'Anteater';
  tier = 3;
  pack: Pack = 'Star';
  attack = 2;
  health = 2;

  initAbilities(): void {
    this.addAbility(
      new AnteaterAbility(this, this.logService, this.abilityService),
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


export class AnteaterAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'AnteaterAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    for (let i = 0; i < this.level; i++) {
      let ant = new Ant(
        this.logService,
        this.abilityService,
        owner.parent,
        1,
        1,
        0,
        5,
      );

      let summonResult = owner.parent.summonPet(
        ant,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned 1/1 Ant level 3`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: summonResult.randomEvent,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AnteaterAbility {
    return new AnteaterAbility(newOwner, this.logService, this.abilityService);
  }
}



