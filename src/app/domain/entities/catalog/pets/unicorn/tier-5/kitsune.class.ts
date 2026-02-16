import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Kitsune extends Pet {
  name = 'Kitsune';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 7;
  initAbilities(): void {
    this.addAbility(new KitsuneAbility(this, this.logService));
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


export class KitsuneAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'KitsuneAbility',
      owner: owner,
      triggers: ['FriendFaints'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    const buffTarget = owner.petAhead;
    if (!buffTarget || !buffTarget.alive) {
      return;
    }

    let mana = 0;
    const friendsWithMana = owner.parent.petArray.filter(
      (pet) => pet.mana > 0 && pet !== owner && pet !== buffTarget,
    );
    for (let pet of friendsWithMana) {
      const drainedMana = pet.mana;
      mana += drainedMana;
      pet.mana = 0;
      this.logService.createLog({
        message: `${owner.name} took ${drainedMana} mana from ${pet.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });
    }

    this.logService.createLog({
      message: `${owner.name} gave ${buffTarget.name} +${mana + owner.level * 2} mana.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    buffTarget.increaseMana(mana + owner.level * 2);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KitsuneAbility {
    return new KitsuneAbility(newOwner, this.logService);
  }
}


