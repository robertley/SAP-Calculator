import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';
import { cloneEquipment } from 'app/runtime/equipment-clone';


export class Pangasius extends Pet {
  name = 'Pangasius';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 4;

  override initAbilities(): void {
    this.addAbility(new PangasiusAbility(this, this.logService));
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

    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    const copies = this.level;
    const sourceEquipment = source?.equipment ?? new Spooked();
    const ailmentClone = cloneEquipment(sourceEquipment);
    if (!ailmentClone) {
      this.triggerTigerExecution(context);
      return;
    }
    if (copies > 1) {
      ailmentClone.multiplier = copies;
      ailmentClone.multiplierMessage = ` x${copies} (Pangasius)`;
    }
    target.givePetEquipment(ailmentClone);

    const effectDescriptions = [
      'copied',
      'copied with double effect',
      'copied with triple effect',
    ];
    const effectNote =
      effectDescriptions[Math.min(copies, effectDescriptions.length) - 1];

    this.logService.createLog({
      message: `${owner.name} ${effectNote} ${source ? `${source.name}'s ${sourceEquipment?.name}` : sourceEquipment?.name} onto ${target.name}.`,
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






