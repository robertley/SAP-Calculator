import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class RedLippedBatfish extends Pet {
  name = 'Red Lipped Batfish';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 5;
  health = 3;

  initAbilities(): void {
    this.addAbility(
      new RedLippedBatfishAbility(this, this.logService, this.petService),
    );
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
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


export class RedLippedBatfishAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'Red Lipped Batfish Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const opponent = owner.parent.opponent;
    if (!opponent) {
      this.triggerTigerExecution(context);
      return;
    }

    const target = opponent.getPetAtPosition(owner.position);
    if (!target || !target.alive) {
      this.triggerTigerExecution(context);
      return;
    }

    const targetTier = Math.max(1, 4 - this.level);
    const newPet = this.petService.getRandomFaintPet(opponent, targetTier);
    opponent.transformPet(target, newPet);

    this.logService.createLog({
      message: `${owner.name} transformed ${target.name} into ${newPet.name} (tier ${targetTier}).`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): RedLippedBatfishAbility {
    return new RedLippedBatfishAbility(
      newOwner,
      this.logService,
      this.petService,
    );
  }
}


