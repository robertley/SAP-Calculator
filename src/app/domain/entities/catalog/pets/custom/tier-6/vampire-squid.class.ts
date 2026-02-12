import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class VampireSquid extends Pet {
  name = 'Vampire Squid';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new VampireSquidAbility(this, this.logService));
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


export class VampireSquidAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'VampireSquidAbility',
      owner: owner,
      triggers: ['EndTurn'],
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
    const uniqueAilments = new Map<string, Pet>();

    for (const pet of owner.parent.petArray) {
      if (!pet || pet === owner || !pet.alive || !pet.equipment) {
        continue;
      }
      const equipmentClass =
        (
          pet.equipment as Equipment & {
            equipmentClass?: string;
          }
        ).equipmentClass ?? '';
      if (!equipmentClass.startsWith('ailment')) {
        continue;
      }
      if (!uniqueAilments.has(pet.equipment.name)) {
        uniqueAilments.set(pet.equipment.name, pet);
      }
    }

    if (uniqueAilments.size === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const attackBuff = this.level;
    const healthBuff = this.level * 2;
    const names: string[] = [];

    uniqueAilments.forEach((pet) => {
      pet.increaseAttack(attackBuff);
      pet.increaseHealth(healthBuff);
      names.push(pet.name);
    });

    this.logService.createLog({
      message: `${owner.name} gave ${names.join(', ')} +${attackBuff}/+${healthBuff} at end of turn for having unique ailments.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VampireSquidAbility {
    return new VampireSquidAbility(newOwner, this.logService);
  }
}


