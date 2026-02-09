import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { cloneDeep } from 'lodash-es';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Dunkleosteus extends Pet {
  name = 'Dunkleosteus';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 6;
  health = 8;
  initAbilities(): void {
    this.addAbility(new DunkleosteusAbility(this, this.logService));
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


export class DunkleosteusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Dunkleosteus Ability',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const ailment = owner.equipment;
    if (!ailment || !this.isAilmentEquipment(ailment)) {
      this.triggerTigerExecution(context);
      return;
    }

    const opponentPets = owner.parent.opponent.petArray.filter(
      (pet) => pet && pet.alive,
    );
    if (opponentPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const copiedAilment = cloneDeep(ailment);
    owner.removePerk(true);

    const targets = opponentPets.slice(0, Math.min(2, opponentPets.length));
    for (const target of targets) {
      const ailmentClone = cloneDeep(copiedAilment);
      ailmentClone.multiplier += this.level - 1;
      target.givePetEquipment(ailmentClone);
    }

    const effectNotes = [
      '.',
      ' with double effect.',
      ' with triple effect.',
    ];
    const message = `${owner.name} moved ${copiedAilment.name} to ${targets.map((pet) => pet.name).join(', ')}${effectNotes[Math.min(this.level, effectNotes.length) - 1]}`;

    this.logService.createLog({
      message,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  private isAilmentEquipment(equipment: Equipment): boolean {
    return (
      equipment.equipmentClass === 'ailment-attack' ||
      equipment.equipmentClass === 'ailment-defense' ||
      equipment.equipmentClass === 'ailment-other'
    );
  }

  copy(newOwner: Pet): DunkleosteusAbility {
    return new DunkleosteusAbility(newOwner, this.logService);
  }
}


