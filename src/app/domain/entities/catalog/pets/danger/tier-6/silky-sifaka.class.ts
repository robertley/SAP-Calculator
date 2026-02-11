import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class SilkySifaka extends Pet {
  name = 'Silky Sifaka';
  tier = 6;
  pack: Pack = 'Danger';
  attack = 4;
  health = 6;

  initAbilities(): void {
    this.addAbility(
      new SilkySifakaAbility(this, this.logService, this.petService),
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


export class SilkySifakaAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'SilkySifakaAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let sifakaPool = [
      'Mammoth',
      'Lionfish',
      'Orca',
      'Sabertooth Tiger',
      'Warthog',
      'Hydra',
      'Phoenix',
      'Bay Cat',
      'Walrus',
      'Ammonite',
    ];

    let targetsResp = owner.parent.nearestPetsBehind(2, owner);
    let petsBehind = targetsResp.pets;

    for (let targetPet of petsBehind) {
      const choice = chooseRandomOption(
        {
          key: 'pet.silky-sifaka-transform',
          label: formatPetScopedRandomLabel(
            owner,
            `Silky Sifaka transform for ${targetPet.name}`,
          ),
          options: sifakaPool.map((name) => ({ id: name, label: name })),
        },
        () => getRandomInt(0, sifakaPool.length - 1),
      );
      let randomPetName = sifakaPool[choice.index];
      let newPet = this.petService.createPet(
        {
          name: randomPetName,
          attack: targetPet.attack,
          health: targetPet.health,
          mana: targetPet.mana,
          exp: owner.minExpForLevel,
          equipment: targetPet.equipment,
        },
        owner.parent,
      );

      owner.parent.transformPet(targetPet, newPet);

      this.logService.createLog({
        message: `${owner.name} transformed ${targetPet.name} into level ${owner.level} ${newPet.name}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: choice.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SilkySifakaAbility {
    return new SilkySifakaAbility(newOwner, this.logService, this.petService);
  }
}


