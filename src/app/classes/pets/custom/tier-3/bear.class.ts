import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Honey } from 'app/classes/equipment/turtle/honey.class';


export class Bear extends Pet {
  name = 'Bear';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new BearAbility(this, this.logService, this.abilityService),
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


export class BearAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BearAbility',
      owner: owner,
      triggers: ['Faint'],
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
    const range = this.level;
    const bearPosition = owner.savedPosition;
    const targets: Pet[] = [];

    // Check friend pets
    for (const pet of owner.parent.petArray) {
      if (pet.alive) {
        const distance = Math.abs(pet.position - bearPosition);
        if (distance > 0 && distance <= range) {
          targets.push(pet);
        }
      }
    }

    // Check opponent pets
    for (const pet of owner.parent.opponent.petArray) {
      if (pet.alive) {
        const distance = bearPosition + pet.position + 1;
        if (distance <= range) {
          targets.push(pet);
        }
      }
    }

    for (let target of targets) {
      target.givePetEquipment(new Honey(this.logService, this.abilityService));
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Honey.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BearAbility {
    return new BearAbility(newOwner, this.logService, this.abilityService);
  }
}

