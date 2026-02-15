import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class SarcasticFringehead extends Pet {
  name = 'Sarcastic Fringehead';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 7;

  override initAbilities(): void {
    this.addAbility(
      new SarcasticFringeheadAbility(this, this.logService, this.petService),
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


export class SarcasticFringeheadAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'SarcasticFringeheadAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.petService = petService;
  }

  private spawnForOpponent(context: AbilityContext): void {
    const owner = this.owner;
    const opponent = owner.parent.opponent;

    if ((owner.swallowedPets?.length ?? 0) === 0) {
      const swallowedName = owner.sarcasticFringeheadSwallowedPet;
      if (swallowedName) {
        const swallowedPet = this.petService.createPet(
          {
            name: swallowedName,
            attack: 1,
            health: 1,
            exp: owner.minExpForLevel,
            equipment: null,
            mana: 0,
          },
          owner.parent,
        );
        if (swallowedPet) {
          owner.swallowedPets.push(swallowedPet);
        }
      }
    }

    while (owner.swallowedPets.length > 0) {
      const swallowedPet = owner.swallowedPets.shift();
      if (!swallowedPet) {
        continue;
      }
      swallowedPet.parent = opponent;
      const summonResult = opponent.summonPet(swallowedPet, 0, false);
      if (!summonResult.success) {
        continue;
      }
      this.logService.createLog({
        message: `${owner.name} spawned ${swallowedPet.name} for the opponent.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        randomEvent: summonResult.randomEvent,
      });
    }
  }

  private executeAbility(context: AbilityContext): void {
    this.spawnForOpponent(context);
    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SarcasticFringeheadAbility {
    return new SarcasticFringeheadAbility(
      newOwner,
      this.logService,
      this.petService,
    );
  }
}



