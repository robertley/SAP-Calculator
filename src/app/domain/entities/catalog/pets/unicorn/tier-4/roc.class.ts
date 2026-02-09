import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Roc extends Pet {
  name = 'Roc';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new RocAbility(this, this.logService));
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


export class RocAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RocAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const petsAheadResp = owner.parent.nearestPetsAhead(5, owner);
    let petsAhead = petsAheadResp.pets;
    if (petsAhead.length == 0) {
      return;
    }

    let excludePets = owner.parent.petArray.filter(
      (pet) => pet == owner || !petsAhead.includes(pet),
    );
    //TO DO: Make it spread evenly
    for (let i = 0; i < this.level * 3; i++) {
      let targetResp = owner.parent.getRandomPet(
        excludePets,
        true,
        false,
        false,
        owner,
      );
      if (targetResp.pet == null) {
        break;
      }
      this.logService.createLog({
        message: `${owner.name} gave ${targetResp.pet.name} 2 mana.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });

      targetResp.pet.increaseMana(2);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RocAbility {
    return new RocAbility(newOwner, this.logService);
  }
}


