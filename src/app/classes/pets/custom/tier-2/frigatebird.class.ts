import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Rice } from 'app/classes/equipment/puppy/rice.class';


export class Frigatebird extends Pet {
  name = 'Frigatebird';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 5;

  initAbilities(): void {
    this.addAbility(new FrigatebirdAbility(this, this.logService));
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

  resetPet(): void {
    super.resetPet();
  }
}


export class FrigatebirdAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FrigatebirdAbility',
      owner: owner,
      triggers: ['FriendGainsAilment'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const equipment = triggerPet?.equipment;
    if (!equipment || !equipment.equipmentClass?.startsWith('ailment')) {
      return;
    }
    triggerPet.removePerk();
    triggerPet.givePetEquipment(new Rice());
    this.logService.createLog({
      message: `${owner.name} removed ${equipment.name} from ${triggerPet.name} and gave ${triggerPet.name} Rice.`,
      type: 'ability',
      player: owner.parent,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  copy(newOwner: Pet): FrigatebirdAbility {
    return new FrigatebirdAbility(newOwner, this.logService);
  }
}
