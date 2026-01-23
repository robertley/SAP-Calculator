import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Inked } from 'app/classes/equipment/ailments/inked.class';


export class Squid extends Pet {
  name = 'Squid';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 5;
  health = 2;
  initAbilities(): void {
    this.addAbility(new SquidAbility(this, this.logService));
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


export class SquidAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SquidAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (owner.parent.trumpets < 1) {
          return false;
        }
        return true;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let hasTarget = false;
    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Inked',
      owner,
    );
    let targetResp = owner.parent.opponent.getFurthestUpPets(
      this.level,
      excludePets,
      owner,
    );
    let targets = targetResp.pets;

    for (let target of targets) {
      if (target == null) {
        break;
      }
      hasTarget = true;
      target.givePetEquipment(new Inked());
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Inked.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetResp.random,
      });
    }

    if (hasTarget) {
      owner.parent.spendTrumpets(1, owner, pteranodon);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SquidAbility {
    return new SquidAbility(newOwner, this.logService);
  }
}
