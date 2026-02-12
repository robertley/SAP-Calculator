import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class BelugaWhale extends Pet {
  name = 'Beluga Whale';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 2;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new BelugaWhaleAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
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
    swallowedPet?: string | null,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    this.belugaSwallowedPet = swallowedPet ?? null;
  }
}


export class BelugaWhaleAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private petService: PetService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
  ) {
    super({
      name: 'BelugaWhaleAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
      ignoreRepeats: true,
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (owner.belugaSwallowedPet == null || owner.alive) {
      return;
    }

    let spawnPet = this.petService.createPet(
      {
        attack: null,
        equipment: null,
        exp: owner.minExpForLevel,
        health: null,
        name: owner.belugaSwallowedPet,
        mana: 0,
      },
      owner.parent,
    );
    const levelMultiplier = owner.level;
    const spawnedBaseAttack = spawnPet.attack - spawnPet.exp;
    const spawnedBaseHealth = spawnPet.health - spawnPet.exp;
    spawnPet.attack = spawnedBaseAttack * levelMultiplier;
    spawnPet.health = spawnedBaseHealth * levelMultiplier;
    spawnPet.originalAttack = spawnPet.attack;
    spawnPet.originalHealth = spawnPet.health;

    let summonResult = owner.parent.summonPet(
      spawnPet,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned ${spawnPet.name} Level ${owner.level}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BelugaWhaleAbility {
    return new BelugaWhaleAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}



