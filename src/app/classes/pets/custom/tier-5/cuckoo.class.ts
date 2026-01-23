import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { CuckooChick } from 'app/classes/pets/custom/token/cuckoo-chick.class';


export class Cuckoo extends Pet {
  name = 'Cuckoo';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 4;
  override initAbilities(): void {
    this.addAbility(
      new CuckooAbility(this, this.logService, this.abilityService),
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


export class CuckooAbility extends Ability {
  constructor(
    owner: Pet,
    private logService: LogService,
    private abilityService: AbilityService,
  ) {
    super({
      name: 'CuckooAbility',
      owner: owner,
      triggers: ['EnemyFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    const opponent = owner.parent.opponent;

    // Limit 2/4/6 per battle
    const maxUses = this.level * 2;
    if (this.currentUses > maxUses) {
      return;
    }

    let cuckooChick = new CuckooChick(
      this.logService,
      this.abilityService,
      opponent,
    );

    // Initializing stats via initPet
    // Correct order: exp, health, attack, mana, equipment, triggersConsumed
    cuckooChick.initPet(0, 1, 1, 0, null, 0);

    const summonIdx = 0;

    let summonResult = opponent.summonPet(cuckooChick, summonIdx, true, owner);

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned Cuckoo Chick for the enemy Early.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Trigger Tiger execution if needed
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CuckooAbility {
    return new CuckooAbility(newOwner, this.logService, this.abilityService);
  }
}
