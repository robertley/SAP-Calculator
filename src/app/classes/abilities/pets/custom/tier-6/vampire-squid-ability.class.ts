import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

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
      const equipmentClass = (pet.equipment as any).equipmentClass ?? '';
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
