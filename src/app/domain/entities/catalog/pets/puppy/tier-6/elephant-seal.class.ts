import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class ElephantSeal extends Pet {
  name = 'Elephant Seal';
  tier = 6;
  pack: Pack = 'Puppy';
  attack = 4;
  health = 8;
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

  initAbilities(): void {
    this.addAbility(new ElephantSealAbility(this, this.logService));
    super.initAbilities();
  }
}


export class ElephantSealAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ElephantSealAbility',
      owner: owner,
      triggers: ['ThisGainedPerk'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level * 4;
    let targetsResp = owner.parent.getRandomPets(
      3,
      [owner],
      true,
      false,
      owner,
    );
    for (let target of targetsResp.pets) {
      if (target != null) {
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
          message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          randomEvent: targetsResp.random,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ElephantSealAbility {
    return new ElephantSealAbility(newOwner, this.logService);
  }
}


