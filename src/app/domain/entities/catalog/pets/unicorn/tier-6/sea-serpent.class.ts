import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class SeaSerpent extends Pet {
  name = 'Sea Serpent';
  tier = 6;
  pack: Pack = 'Unicorn';
  attack = 6;
  health = 6;
  initAbilities(): void {
    this.addAbility(new SeaSerpentAbility(this, this.logService));
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


export class SeaSerpentAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SeaSerpentAbility',
      owner: owner,
      triggers: ['Faint'],
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

    const contextState = context as AbilityContext & {
      seaSerpentMana?: number;
    };
    const manaSpent = contextState.seaSerpentMana ?? owner.mana;
    if (manaSpent == 0) {
      return;
    }

    if (contextState.seaSerpentMana == null) {
      contextState.seaSerpentMana = manaSpent;
      owner.mana = 0;
    }

    let power = manaSpent;
    let mana = manaSpent;
    this.logService.createLog({
      message: `${owner.name} spent ${mana} mana.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    // First, snipe the most healthy enemy
    let highestHealthResult = owner.parent.opponent.getHighestHealthPet(
      undefined,
      owner,
    );
    if (highestHealthResult.pet != null) {
      owner.snipePet(
        highestHealthResult.pet,
        power,
        highestHealthResult.random,
        tiger,
        pteranodon,
      );
    }

    // Then snipe level number of random enemies (excluding the first target)
    let randomTargetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      [highestHealthResult.pet],
      null,
      true,
      owner,
    );
    for (let target of randomTargetsResp.pets) {
      if (target != null) {
        owner.snipePet(
          target,
          power,
          randomTargetsResp.random,
          tiger,
          pteranodon,
        );
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SeaSerpentAbility {
    return new SeaSerpentAbility(newOwner, this.logService);
  }
}



