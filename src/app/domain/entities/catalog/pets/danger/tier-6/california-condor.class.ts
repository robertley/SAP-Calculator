import { PetService } from 'app/integrations/pet/pet.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class CaliforniaCondor extends Pet {
  name = 'California Condor';
  tier = 6;
  pack: Pack = 'Danger';
  attack = 10;
  health = 6;

  initAbilities(): void {
    this.addAbility(new CaliforniaCondorAbility(this, this.logService));
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
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


export class CaliforniaCondorAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CaliforniaCondorAbility',
      owner: owner,
      triggers: ['FriendTransformed'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    let copyPet = triggerPet;

    if (!copyPet) {
      return;
    }

    this.logService.createLog({
      message: `California Condor copied ${copyPet.name}'s level ${owner.level} ability`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });
    owner.gainAbilities(copyPet, 'Pet');
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CaliforniaCondorAbility {
    return new CaliforniaCondorAbility(newOwner, this.logService);
  }
}


