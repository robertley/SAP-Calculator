import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class ShimaEnaga extends Pet {
  name = 'Shima Enaga';
  tier = 2;
  pack: Pack = 'Star';
  attack = 2;
  health = 3;

  initAbilities(): void {
    this.addAbility(
      new ShimaEnagaAbility(
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


export class ShimaEnagaAbility extends Ability {
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
      name: 'ShimaEnagaAbility',
      owner: owner,
      triggers: ['FriendDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return triggerPet && triggerPet.equipment?.name == 'Strawberry';
      },
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

    let power = this.level * 2;

    let newPet = this.petService.createPet(
      {
        name: owner.name,
        attack: power,
        health: power,
        equipment: null,
        exp: 0,
        mana: 0,
      },
      owner.parent,
    );

    let summonResult = owner.parent.summonPet(
      newPet,
      triggerPet.position,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a (${power}/${power}) Shima Enaga`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: true,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ShimaEnagaAbility {
    return new ShimaEnagaAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}
