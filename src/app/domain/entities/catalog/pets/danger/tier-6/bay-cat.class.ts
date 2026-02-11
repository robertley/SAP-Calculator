import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { DANGERS_AND_USEFUL_POOLS } from 'app/domain/dangers-and-useful';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class BayCat extends Pet {
  name = 'Bay Cat';
  tier = 6;
  pack: Pack = 'Danger';
  attack = 7;
  health = 5;

  initAbilities(): void {
    this.addAbility(
      new BayCatAbility(
        this,
        this.logService,
        this.petService,
        this.abilityService,
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
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


export class BayCatAbility extends Ability {
  private logService: LogService;
  private petService: PetService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    petService: PetService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BayCatAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.petService = petService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let bayPool = DANGERS_AND_USEFUL_POOLS.bayCat;

    for (let i = 0; i < owner.level; i++) {
      const choice = chooseRandomOption(
        {
          key: 'pet.bay-cat-summon',
          label: formatPetScopedRandomLabel(owner, 'Bay Cat summon', i + 1),
          options: bayPool.map((name) => ({ id: name, label: name })),
        },
        () => getRandomInt(0, bayPool.length - 1),
      );
      let petName = bayPool[choice.index];
      let summonedPet = this.petService.createPet(
        {
          name: petName,
          attack: null,
          health: null,
          equipment: null,
          mana: 0,
          exp: 0,
        },
        owner.parent,
      );

      let summonResult = owner.parent.summonPet(
        summonedPet,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} summoned ${summonedPet.name}`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: choice.randomEvent,
        });

        // Activate start of battle ability
        if (summonedPet.hasAbility('StartBattle')) {
          this.logService.createLog({
            message: `${summonedPet.name} activated its start of battle ability`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
          });
          summonedPet.activateAbilities('StartBattle', gameApi, 'Pet');
        }
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BayCatAbility {
    return new BayCatAbility(
      newOwner,
      this.logService,
      this.petService,
      this.abilityService,
    );
  }
}




