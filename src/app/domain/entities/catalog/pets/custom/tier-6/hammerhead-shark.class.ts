import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class HammerheadShark extends Pet {
  name = 'Hammerhead Shark';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 5;
  health = 5;
  initAbilities(): void {
    this.addAbility(new HammerheadSharkAbility(this, this.logService));
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


export class HammerheadSharkAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Hammerhead Shark Ability',
      owner: owner,
      triggers: ['StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const hasLevel3Friend = owner.parent.petArray.some(
      (pet) => pet && pet !== owner && pet.level === 3,
    );
    if (!hasLevel3Friend) {
      this.triggerTigerExecution(context);
      return;
    }

    const goldGain = this.level * 3;
    const player = owner.parent;
    player.gold = (player.gold ?? 0) + goldGain;

    this.logService.createLog({
      message: `${owner.name} gained +${goldGain} gold from level 3 friends.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HammerheadSharkAbility {
    return new HammerheadSharkAbility(newOwner, this.logService);
  }
}


