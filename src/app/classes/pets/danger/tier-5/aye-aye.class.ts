import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Lemur } from 'app/classes/pets/puppy/tier-2/lemur.class';


export class AyeAye extends Pet {
  name = 'Aye-aye';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 3;
  health = 5;

  initAbilities(): void {
    this.addAbility(
      new AyeAyeAbility(this, this.logService, this.abilityService),
    );
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


export class AyeAyeAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'AyeAyeAbility',
      owner: owner,
      triggers: ['EnemyAttacked8'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    // Summon two Lemurs
    for (let i = 0; i < 2; i++) {
      let lemurAttack = 3; // Base Lemur stats
      let lemurHealth = 3; // Base Lemur stats
      let lemur = new Lemur(
        this.logService,
        this.abilityService,
        owner.parent,
        lemurHealth,
        lemurAttack,
        0,
        0,
      );

      let summonResult = owner.parent.summonPet(
        lemur,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} summoned a ${lemurAttack}/${lemurHealth} ${lemur.name}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          randomEvent: summonResult.randomEvent,
        });
      }
    }

    // Give all friends +attack and +health
    let statGain = this.level * 3; // 3/6/9 based on level
    let friendsResp = owner.parent.getAll(false, owner, true); // excludeSelf = true
    for (let friend of friendsResp.pets) {
      friend.increaseAttack(statGain);
      friend.increaseHealth(statGain);
      this.logService.createLog({
        message: `${owner.name} gave ${friend.name} +${statGain} attack and +${statGain} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: friendsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AyeAyeAbility {
    return new AyeAyeAbility(newOwner, this.logService, this.abilityService);
  }
}
