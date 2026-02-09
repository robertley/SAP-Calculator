import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { getAdjacentAlivePets, logAbility } from 'app/domain/entities/ability-resolution';


export class LeafySeaDragon extends Pet {
  name = 'Leafy Sea Dragon';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 7;
  health = 2;

  override initAbilities(): void {
    this.addAbility(new LeafySeaDragonAbility(this, this.logService));
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


export class LeafySeaDragonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Leafy Sea Dragon Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const expGain = this.level;
    const adjacent = getAdjacentAlivePets(owner);

    adjacent.forEach((friend) => {
      friend.increaseExp(expGain);
    });

    owner.health = 0;
    owner.parent.handleDeath(owner);
    owner.parent.removeDeadPets();

    const message = `${owner.name} gave ${adjacent.length} adjacent friend${adjacent.length === 1 ? '' : 's'} +${expGain} experience and removed itself.`;
    logAbility(this.logService, owner, message, tiger, pteranodon);

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): LeafySeaDragonAbility {
    return new LeafySeaDragonAbility(newOwner, this.logService);
  }
}




