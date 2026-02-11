import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';


export class Kakapo extends Pet {
  name = 'Kakapo';
  tier = 4;
  pack: Pack = 'Danger';
  attack = 4;
  health = 4;

  initAbilities(): void {
    this.addAbility(new KakapoAbility(this, this.logService));
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


// After first attack: Make the highest attack enemy Spooked and push it to the back.
export class KakapoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'KakapoAbility',
      owner: owner,
      triggers: ['ThisFirstAttack'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.timesAttacked <= 1;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    // Effect 1: Spooked
    let spookTargetsResp = owner.parent.opponent.getHighestAttackPets(
      this.level,
      undefined,
      owner,
    );
    for (let target of spookTargetsResp.pets) {
      target.givePetEquipment(new Spooked());
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Spooked.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: spookTargetsResp.random,
      });
    }
    // Effect 2: Push
    let pushTargetsResp = owner.parent.opponent.getHighestAttackPets(
      this.level,
      undefined,
      owner,
    );
    const pushTargets = [...pushTargetsResp.pets].sort(
      (a, b) => a.attack - b.attack,
    );
    for (let target of pushTargets) {
      target.parent.pushPetToBack(target);
      this.logService.createLog({
        message: `${owner.name} pushed ${target.name} to the back.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: pushTargetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KakapoAbility {
    return new KakapoAbility(newOwner, this.logService);
  }
}



