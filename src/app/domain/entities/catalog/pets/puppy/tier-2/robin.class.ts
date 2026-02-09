import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Nest } from 'app/domain/entities/catalog/pets/hidden/nest.class';
import { Egg } from 'app/domain/entities/catalog/equipment/puppy/egg.class';


export class Robin extends Pet {
  name = 'Robin';
  tier = 2;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new RobinAbility(this, this.logService, this.abilityService),
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


export class RobinAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'RobinAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let nest = new Nest(
      this.logService,
      this.abilityService,
      owner.parent,
      null,
      null,
      this.minExpForLevel,
      null,
    );
    this.logService.createLog({
      message: `${owner.name} summoned a Nest (level ${this.level}).`,
      type: 'ability',
      player: owner.parent,
      randomEvent: false,
      tiger: tiger,
    });
    let result = owner.parent.summonPetInFront(owner, nest);
    if (result.success) {
      this.logService.createLog({
        message: `${owner.name} gave Nest an Egg.`,
        type: 'ability',
        player: owner.parent,
        randomEvent: result.randomEvent,
        tiger: tiger,
      });

      nest.givePetEquipment(new Egg(this.logService));
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RobinAbility {
    return new RobinAbility(newOwner, this.logService, this.abilityService);
  }
}



