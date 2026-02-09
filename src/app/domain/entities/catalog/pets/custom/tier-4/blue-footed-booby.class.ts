import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { MelonSlice } from 'app/domain/entities/catalog/equipment/custom/melon-slice.class';


export class BlueFootedBooby extends Pet {
  name = 'Blue-Footed Booby';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 2;
  health = 5;
  override initAbilities(): void {
    this.addAbility(new BlueFootedBoobyAbility(this, this.logService));
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


export class BlueFootedBoobyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Blue-Footed Booby Ability',
      owner,
      triggers: ['PostRemovalFaint'],
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
    const trumpetsCost = 4;

    if (owner.parent.trumpets < trumpetsCost) {
      this.triggerTigerExecution(context);
      return;
    }

    const targets = owner.getPetsBehind(1, 'Melon Slice');
    const friendBehind = targets[0];

    if (!friendBehind || !friendBehind.alive) {
      this.triggerTigerExecution(context);
      return;
    }

    owner.parent.spendTrumpets(trumpetsCost, owner);

    const melon = new MelonSlice();
    melon.uses = this.level;
    melon.originalUses = melon.uses;
    friendBehind.givePetEquipment(melon);

    this.logService.createLog({
      message: `${owner.name} spent ${trumpetsCost} trumpets to give ${friendBehind.name} a Melon Slice (${melon.uses} uses).`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): BlueFootedBoobyAbility {
    return new BlueFootedBoobyAbility(newOwner, this.logService);
  }
}




