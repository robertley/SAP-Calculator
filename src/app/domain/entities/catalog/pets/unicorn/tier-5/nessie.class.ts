import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { NessieQ } from '../../hidden/nessie-q.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Nessie extends Pet {
  name = 'Nessie';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 3;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new NessieAbility(this, this.logService, this.abilityService),
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


export class NessieAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'NessieAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let isPlayer = owner.parent === gameApi.player;
    let rolls = isPlayer
      ? gameApi.playerRollAmount
      : gameApi.opponentRollAmount;

    const baseAttack = this.level * 3;
    const baseHealth = this.level * 3;
    let attack = baseAttack;
    let health = baseHealth;
    let firstBoatMessage = '';

    const isFirstBoatThisBattle = !owner.parent.summonedBoatThisBattle;
    if (isFirstBoatThisBattle) {
      const bonusPerRoll = this.level;
      const bonusStats = rolls * bonusPerRoll;
      attack += bonusStats;
      health += bonusStats;
      owner.parent.summonedBoatThisBattle = true;
    }

    attack = Math.min(50, attack);
    health = Math.min(50, health);

    if (isFirstBoatThisBattle) {
      const gainedAttack = Math.max(0, attack - baseAttack);
      const gainedHealth = Math.max(0, health - baseHealth);
      firstBoatMessage = ` It's the first Boat, so it gains +${gainedAttack}/+${gainedHealth}!`;
    }

    let nessieQ = new NessieQ(
      this.logService,
      this.abilityService,
      owner.parent,
      health,
      attack,
      0,
    );

    let summonResult = owner.parent.summonPet(
      nessieQ,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned a Nessie? ${attack}/${health}${firstBoatMessage}`,
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

  copy(newOwner: Pet): NessieAbility {
    return new NessieAbility(newOwner, this.logService, this.abilityService);
  }
}



