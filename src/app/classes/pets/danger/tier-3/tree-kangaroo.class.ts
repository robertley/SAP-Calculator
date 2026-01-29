import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Silly } from 'app/classes/equipment/ailments/silly.class';


export class TreeKangaroo extends Pet {
  name = 'Tree Kangaroo';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 3;
  health = 5;

  initAbilities(): void {
    this.addAbility(new TreeKangarooAbility(this, this.logService));
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


export class TreeKangarooAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TreeKangarooAbility',
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

    let petsWithPerk = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'perk',
      owner,
    );
    let opponentTreeKangaroos = owner.parent.opponent.petArray.filter((pet) => {
      return pet.name == 'Tree Kangaroo';
    });
    let playerTreeKangaroos = owner.parent.petArray.filter((pet) => {
      return pet.name == 'Tree Kangaroo';
    });
    let excludePets = [
      ...petsWithPerk,
      ...opponentTreeKangaroos,
      ...playerTreeKangaroos,
    ];
    let targetResp = owner.parent.opponent.getLastPet(excludePets, owner);
    let targetPet = targetResp.pet;

    if (targetPet) {
      targetPet.givePetEquipment(new Silly());
      this.logService.createLog({
        message: `${owner.name} gave ${targetPet.name} Silly`,
        type: 'ability',
        tiger: tiger,
        player: owner.parent,
        randomEvent: targetResp.random,
      });
    }
    for (let i = 0; i < this.level; i++) {
      let activationTargetResp = owner.parent.getSpecificPet(owner, targetPet);
      let activationTarget = activationTargetResp.pet;
      if (activationTarget) {
        this.logService.createLog({
          message: `${owner.name} activated ${targetPet.name}'s ability.`,
          type: 'ability',
          tiger: tiger,
          player: owner.parent,
          randomEvent: targetResp.random,
        });
        for (const ability of activationTarget.abilityList) {
          ability.execute(gameApi, activationTarget, tiger, pteranodon);
        }
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TreeKangarooAbility {
    return new TreeKangarooAbility(newOwner, this.logService);
  }
}
