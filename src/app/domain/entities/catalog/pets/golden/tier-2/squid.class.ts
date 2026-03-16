import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Inked } from 'app/domain/entities/catalog/equipment/ailments/inked.class';


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
      triggers: ['Faint'],
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
    const owner = this.owner;

    let hasTarget = false;
    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Inked',
      owner,
    );
    let targetResp = owner.parent.opponent.getFurthestUpPets(
      1,
      excludePets,
      owner,
    );
    let targets = targetResp.pets;

    for (let target of targets) {
      if (target == null) {
        break;
      }
      hasTarget = true;
      const equipment = new Inked();
      equipment.power *= this.level;
      equipment.originalPower = equipment.power;
      target.givePetEquipment(equipment);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Inked.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: targetResp.random,
      });
    }

    if (hasTarget) {
      owner.parent.spendTrumpets(1, owner, context.pteranodon);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SquidAbility {
    return new SquidAbility(newOwner, this.logService);
  }
}




