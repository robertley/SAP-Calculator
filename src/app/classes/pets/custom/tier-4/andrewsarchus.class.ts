import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { getRandomInt } from 'app/util/helper-functions';
import * as petJson from 'assets/data/pets.json';

const PET_STATS_BY_NAME: Map<string, { attack: number; health: number }> =
  new Map();
const petEntries =
  (petJson as unknown as { default?: any[] }).default ?? (petJson as any[]);
if (Array.isArray(petEntries)) {
  for (const pet of petEntries) {
    if (!pet?.Name) {
      continue;
    }
    const attack = Number(pet.Attack ?? 0);
    const health = Number(pet.Health ?? 0);
    PET_STATS_BY_NAME.set(pet.Name, { attack, health });
  }
}


export class Andrewsarchus extends Pet {
  name = 'Andrewsarchus';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 5;
  health = 4;
  override initAbilities(): void {
    this.addAbility(new AndrewsarchusAbility(this, this.logService));
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


export class AndrewsarchusAbility extends Ability {
  private logService: LogService;
  private pendingAttack = 0;
  private pendingHealth = 0;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Andrewsarchus Ability',
      owner: owner,
      triggers: ['EndTurn', 'StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;

    if (context.trigger === 'StartTurn') {
      if (this.pendingAttack || this.pendingHealth) {
        owner.increaseAttack(-this.pendingAttack);
        owner.increaseHealth(-this.pendingHealth);
        this.pendingAttack = 0;
        this.pendingHealth = 0;
      }
      this.triggerTigerExecution(context);
      return;
    }

    const pool =
      owner.parent === gameApi?.player
        ? gameApi?.playerPetPool
        : gameApi?.opponentPetPool;
    const candidates: string[] = [];
    let maxHealth = -1;

    for (const tierPets of pool?.values() ?? []) {
      for (const petName of tierPets ?? []) {
        const stats = PET_STATS_BY_NAME.get(petName);
        if (!stats) {
          continue;
        }
        if (stats.health > maxHealth) {
          maxHealth = stats.health;
          candidates.length = 0;
          candidates.push(petName);
        } else if (stats.health === maxHealth) {
          candidates.push(petName);
        }
      }
    }

    if (!candidates.length || maxHealth < 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const chosen =
      candidates.length === 1
        ? candidates[0]
        : candidates[getRandomInt(0, candidates.length - 1)];
    const chosenStats = PET_STATS_BY_NAME.get(chosen);
    if (!chosenStats) {
      this.triggerTigerExecution(context);
      return;
    }

    const percent = 0.5 * this.level;
    const attackGain = Math.floor(chosenStats.attack * percent);
    const healthGain = Math.floor(chosenStats.health * percent);

    if (attackGain > 0 || healthGain > 0) {
      owner.increaseAttack(attackGain);
      owner.increaseHealth(healthGain);
      this.pendingAttack += attackGain;
      this.pendingHealth += healthGain;
    }

    this.logService.createLog({
      message: `${owner.name} removed ${chosen} from the shop and gained +${attackGain}/+${healthGain} until next turn.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: candidates.length > 1,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): AndrewsarchusAbility {
    const copy = new AndrewsarchusAbility(newOwner, this.logService);
    copy.pendingAttack = this.pendingAttack;
    copy.pendingHealth = this.pendingHealth;
    return copy;
  }
}
