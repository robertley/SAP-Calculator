import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Falcon extends Pet {
  name = 'Falcon';
  tier = 4;
  pack: Pack = 'Golden';
  attack = 5;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new FalconAbility(
        this,
        this.logService,
        this.petService,
        this.abilityService,
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


export class FalconAbility extends Ability {
  private logService: LogService;
  private petService: PetService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    petService: PetService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'FalconAbility',
      owner: owner,
      triggers: ['KnockOut'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.petService = petService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level * 3;
    let summonPet = this.petService.createPet(
      {
        attack: power,
        health: power,
        name: triggerPet.name,
        exp: owner.minExpForLevel,
        equipment: null,
        mana: 0,
      },
      owner.parent,
    );
    let summonResult = owner.parent.summonPet(
      summonPet,
      owner.savedPosition,
      false,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned ${summonPet.name} ${power}/${power} Level ${this.level}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FalconAbility {
    return new FalconAbility(
      newOwner,
      this.logService,
      this.petService,
      this.abilityService,
    );
  }
}


