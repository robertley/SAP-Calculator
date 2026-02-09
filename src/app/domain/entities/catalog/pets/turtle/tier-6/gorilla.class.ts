import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Coconut } from 'app/domain/entities/catalog/equipment/turtle/coconut.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Gorilla extends Pet {
  name = 'Gorilla';
  tier = 6;
  pack: Pack = 'Turtle';
  attack = 7;
  health = 10;
  initAbilities(): void {
    this.addAbility(new GorillaAbility(this, this.logService));
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


export class GorillaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GorillaAbility',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.alive;
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

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    target.givePetEquipment(new Coconut());
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} a Coconut.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }

  copy(newOwner: Pet): GorillaAbility {
    const newAbility = new GorillaAbility(newOwner, this.logService);
    // Update maxUses based on new owner's level
    newAbility.maxUses = newOwner.level;
    return newAbility;
  }
}



