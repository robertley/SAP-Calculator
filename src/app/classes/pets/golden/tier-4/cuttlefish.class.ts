import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Inked } from 'app/classes/equipment/ailments/inked.class';


export class Cuttlefish extends Pet {
  name = 'Cuttlefish';
  tier = 4;
  pack: Pack = 'Golden';
  attack = 8;
  health = 4;
  initAbilities(): void {
    this.addAbility(new CuttlefishAbility(this, this.logService));
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


export class CuttlefishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CuttlefishAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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

    let targetsResp = owner.parent.opponent.getLastPets(
      this.level,
      undefined,
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    let power = 3;

    for (let target of targets) {
      target.increaseHealth(-power);
      this.logService.createLog({
        message: `${owner.name} reduced ${target.name} health by ${power}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
    }

    let excludeInkTargets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Inked',
      owner,
    );
    let InkTargetsResp = owner.parent.opponent.getLastPets(
      this.level,
      excludeInkTargets,
      owner,
    );
    let InkTargets = InkTargetsResp.pets;
    if (InkTargets.length == 0) {
      return;
    }

    for (let target of InkTargets) {
      target.givePetEquipment(new Inked());
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Inked.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: InkTargetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CuttlefishAbility {
    return new CuttlefishAbility(newOwner, this.logService);
  }
}
