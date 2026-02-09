import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class SwordFish extends Pet {
  name = 'Swordfish';
  tier = 5;
  pack: Pack = 'Star';
  attack = 6;
  health = 9;

  initAbilities(): void {
    this.addAbility(new SwordFishAbility(this, this.logService));
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


export class SwordFishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SwordFishAbility',
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const opponent = owner.parent.opponent;
    const highestHealthPetResp = opponent.getHighestHealthPet(undefined, owner);
    const target = highestHealthPetResp.pet;
    const power = owner.attack * this.level;

    if (target) {
      owner.snipePet(
        target,
        power,
        highestHealthPetResp.random,
        tiger,
        pteranodon,
      );
      this.logService.createLog({
        message: `${owner.name} deals ${power} damage to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        sourcePet: owner,
        targetPet: target,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: highestHealthPetResp.random,
      });
    } else {
      this.logService.createLog({
        message: `${owner.name} could not find an enemy to attack.`,
        type: 'ability',
        player: owner.parent,
        sourcePet: owner,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    owner.snipePet(owner, power, false, tiger, pteranodon);
    this.logService.createLog({
      message: `${owner.name} deals ${power} damage to itself.`,
      type: 'ability',
      player: owner.parent,
      sourcePet: owner,
      targetPet: owner,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SwordFishAbility {
    return new SwordFishAbility(newOwner, this.logService);
  }
}


