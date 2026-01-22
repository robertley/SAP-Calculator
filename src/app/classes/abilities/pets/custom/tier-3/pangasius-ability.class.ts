import { cloneDeep } from 'lodash-es';
import { Ability, AbilityContext } from '../../../../ability.class';
import { Equipment } from '../../../../equipment.class';
import { Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { LogService } from 'app/services/log.service';

export class PangasiusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Pangasius Ability',
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
    const source = this.getFriendWithAilment(owner.parent);
    const target = this.getFirstEnemy(owner.parent.opponent);

    if (!source || !target) {
      this.triggerTigerExecution(context);
      return;
    }

    const copies = this.level;
    const sourceEquipment = source.equipment;
    if (!sourceEquipment) {
      this.triggerTigerExecution(context);
      return;
    }
    for (let i = 0; i < copies; i++) {
      const ailmentClone = cloneDeep(sourceEquipment);
      target.givePetEquipment(ailmentClone);
    }

    const effectDescriptions = [
      'copied',
      'copied with double effect',
      'copied with triple effect',
    ];
    const effectNote =
      effectDescriptions[Math.min(copies, effectDescriptions.length) - 1];

    this.logService.createLog({
      message: `${owner.name} ${effectNote} ${source.name}'s ${sourceEquipment?.name ?? 'ailment'} onto ${target.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  private getFriendWithAilment(player: Player): Pet | null {
    const candidates = player.petArray
      .filter(
        (pet) =>
          pet.alive && pet.equipment && this.isAilmentEquipment(pet.equipment),
      )
      .sort((a, b) => a.position - b.position);
    return candidates[0] ?? null;
  }

  private getFirstEnemy(opponent: Player): Pet | null {
    return opponent.petArray.find((pet) => pet.alive) ?? null;
  }

  private isAilmentEquipment(equipment: Equipment): boolean {
    return (
      equipment.equipmentClass === 'ailment-attack' ||
      equipment.equipmentClass === 'ailment-defense' ||
      equipment.equipmentClass === 'ailment-other'
    );
  }

  override copy(newOwner: Pet): PangasiusAbility {
    return new PangasiusAbility(newOwner, this.logService);
  }
}
