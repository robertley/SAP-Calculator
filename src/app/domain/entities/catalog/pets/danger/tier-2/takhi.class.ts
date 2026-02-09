import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Takhi extends Pet {
  name = 'Takhi';
  tier = 2;
  pack: Pack = 'Danger';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new TakhiAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
    );
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
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


export class TakhiAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private petService: PetService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
  ) {
    super({
      name: 'TakhiAbility',
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
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let attackValue = this.level * 3;
    let healthValue = this.level * 2;

    let africanWildDog = this.petService.createPet(
      {
        name: 'African Wild Dog',
        attack: attackValue,
        health: healthValue,
        exp: 0,
        mana: 0,
        equipment: null,
      },
      owner.parent,
    );

    if (africanWildDog) {
      let summonResult = owner.parent.summonPet(
        africanWildDog,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} summoned a ${africanWildDog.attack}/${africanWildDog.health} ${africanWildDog.name}`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: summonResult.randomEvent,
        });
        africanWildDog.activateAbilities('StartBattle', gameApi, 'Pet');
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TakhiAbility {
    return new TakhiAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}



