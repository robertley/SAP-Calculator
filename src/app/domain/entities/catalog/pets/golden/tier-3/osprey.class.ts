import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Groundhog } from '../tier-1/groundhog.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Osprey extends Pet {
  name = 'Osprey';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new OspreyAbility(this, this.logService, this.abilityService),
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


export class OspreyAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'OspreyAbility',
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

    for (let i = 0; i < owner.level; i++) {
      let groundhog = new Groundhog(
        this.logService,
        this.abilityService,
        owner.parent,
        null,
        null,
        0,
        0,
      );

      let summonResult = owner.parent.summonPet(
        groundhog,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} summoned a 2/1 Groundhog`,
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

  copy(newOwner: Pet): OspreyAbility {
    return new OspreyAbility(newOwner, this.logService, this.abilityService);
  }
}



