import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { MildChili } from 'app/domain/entities/catalog/equipment/puppy/mild-chili.class';


export class Tahr extends Pet {
  name = 'Tahr';
  tier = 4;
  pack: Pack = 'Puppy';
  attack = 5;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new TahrAbility(this, this.logService, this.abilityService),
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


export class TahrAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'TahrAbility',
      owner: owner,
      triggers: ['Faint'],
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

    let excludePets = owner.parent.getPetsWithEquipment('Mild Chili');
    let targetsBehindResp = owner.parent.nearestPetsBehind(
      this.level,
      owner,
      excludePets,
    );
    if (targetsBehindResp.pets.length === 0) {
      return;
    }
    for (let pet of targetsBehindResp.pets) {
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Mild Chili.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsBehindResp.random,
      });
      pet.givePetEquipment(new MildChili(this.logService, this.abilityService));
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TahrAbility {
    return new TahrAbility(newOwner, this.logService, this.abilityService);
  }
}




