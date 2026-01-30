import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from 'app/services/pet/pet.service';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Pteranodon extends Pet {
  name = 'Pteranodon';
  tier = 6;
  pack: Pack = 'Golden';
  attack = 3;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new PteranodonAbility(
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


export class PteranodonAbility extends Ability {
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
      name: 'PteranodonAbility',
      owner: owner,
      triggers: ['PostRemovalFriendFaints'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (triggerPet == null) {
          return false;
        }
        return true;
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

    let summonPet = this.petService.createPet(
      {
        attack: 1,
        health: 1,
        equipment: null,
        exp: triggerPet.exp,
        name: triggerPet.name,
        mana: 0,
      },
      owner.parent,
    );

    let result = owner.parent.summonPetBehind(owner, summonPet);
    if (result.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a 1/1 ${triggerPet.name} behind it.`,
        type: 'ability',
        player: owner.parent,
        randomEvent: result.randomEvent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  reset(): void {
    super.reset();
    this.maxUses = this.level;
  }

  copy(newOwner: Pet): PteranodonAbility {
    return new PteranodonAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}

