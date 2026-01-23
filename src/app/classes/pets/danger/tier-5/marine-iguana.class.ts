import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Melon } from 'app/classes/equipment/turtle/melon.class';


export class MarineIguana extends Pet {
  name = 'Marine Iguana';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 4;
  health = 5;

  initAbilities(): void {
    this.addAbility(new MarineIguanaAbility(this, this.logService));
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


export class MarineIguanaAbility extends Ability {
  private logService: LogService;
  private targettedFriends: Set<Pet> = new Set();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MarineIguanaAbility',
      owner: owner,
      triggers: ['BeforeFriendAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return !this.targettedFriends.has(triggerPet);
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  reset(): void {
    this.targettedFriends = new Set();
    super.reset();
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let attackingFriend = targetResp.pet;

    if (!attackingFriend) {
      return;
    }

    // Give the friend Melon
    attackingFriend.givePetEquipment(new Melon());

    // Track this friend so we don't target them again this turn
    this.targettedFriends.add(attackingFriend);

    this.logService.createLog({
      message: `${owner.name} gave ${attackingFriend.name} Melon`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MarineIguanaAbility {
    return new MarineIguanaAbility(newOwner, this.logService);
  }
}
