import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class SpiderCrab extends Pet {
  name = 'Spider Crab';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 3;
  health = 6;
  initAbilities(): void {
    this.addAbility(new SpiderCrabAbility(this, this.logService));
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


export class SpiderCrabAbility extends Ability {
  private logService: LogService;
  private affectedPets = new Set<Pet>();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Spider Crab Ability',
      owner: owner,
      triggers: ['BeforeFriendAttacks', 'StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { triggerPet, tiger, pteranodon } = context;

    if (context.trigger === 'StartTurn') {
      this.affectedPets.clear();
      this.triggerTigerExecution(context);
      return;
    }

    if (!triggerPet || triggerPet.parent !== owner.parent) {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.affectedPets.has(triggerPet)) {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.affectedPets.size >= this.level) {
      this.triggerTigerExecution(context);
      return;
    }

    triggerPet.increaseHealth(4);
    triggerPet.parent.pushPetToBack(triggerPet);
    this.affectedPets.add(triggerPet);

    this.logService.createLog({
      message: `${owner.name} moved ${triggerPet.name} to the back and gave it +4 health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SpiderCrabAbility {
    return new SpiderCrabAbility(newOwner, this.logService);
  }
}
