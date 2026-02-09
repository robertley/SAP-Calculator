import { LogService } from 'app/integrations/log.service';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Equipment } from '../../../../equipment.class';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Mosquito extends Pet {
  name = 'Mosquito';
  tier = 1;
  pack: Pack = 'Turtle';
  health = 2;
  attack = 2;
  initAbilities(): void {
    this.addAbility(new MosquitoAbility(this, this.logService));
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


export class MosquitoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MosquitoAbility',
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

    let targetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      null,
      null,
      true,
      owner,
    );
    for (let target of targetsResp.pets) {
      if (target != null) {
        owner.snipePet(target, 1, targetsResp.random, tiger);
      }
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MosquitoAbility {
    return new MosquitoAbility(newOwner, this.logService);
  }
}


