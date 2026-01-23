import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Guava } from 'app/classes/equipment/custom/guava.class';


export class BettaFish extends Pet {
  name = 'Betta Fish';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 2;
  health = 3;

  initAbilities(): void {
    this.addAbility(new BettaFishAbility(this, this.logService));
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


export class BettaFishAbility extends Ability {
  private logService: LogService;
  private targetedPets: Set<Pet> = new Set();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Betta Fish Ability',
      owner: owner,
      triggers: ['FriendLostPerk'],
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

  reset(): void {
    this.maxUses = this.level;
    this.targetedPets.clear();
    super.reset();
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (!triggerPet || triggerPet == owner) {
      return;
    }

    // Check if we already targeted this pet this turn (for "different friends" logic)
    if (this.targetedPets.has(triggerPet)) {
      return;
    }

    this.targetedPets.add(triggerPet);

    triggerPet.givePetEquipment(new Guava());

    this.logService.createLog({
      message: `${owner.name} gave ${triggerPet.name} Guava.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BettaFishAbility {
    return new BettaFishAbility(newOwner, this.logService);
  }
}
