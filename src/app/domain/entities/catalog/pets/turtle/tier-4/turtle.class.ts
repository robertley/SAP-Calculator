import { Melon } from 'app/domain/entities/catalog/equipment/turtle/melon.class';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Turtle extends Pet {
  name = 'Turtle';
  tier = 4;
  pack: Pack = 'Turtle';
  attack = 2;
  health = 5;
  initAbilities(): void {
    this.addAbility(new TurtleAbility(this, this.logService));
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


export class TurtleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TurtleAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let excludePets = owner.parent.getPetsWithEquipment('Melon');
    let targetsBehindResp = owner.parent.nearestPetsBehind(
      this.level,
      owner,
      excludePets,
    );
    if (targetsBehindResp.pets.length == 0) {
      return;
    }

    for (let targetPet of targetsBehindResp.pets) {
      this.logService.createLog({
        message: `${owner.name} gave ${targetPet.name} Melon.`,
        type: 'ability',
        tiger: tiger,
        player: owner.parent,
        pteranodon: pteranodon,
        randomEvent: targetsBehindResp.random,
      });
      targetPet.givePetEquipment(new Melon());
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TurtleAbility {
    return new TurtleAbility(newOwner, this.logService);
  }
}




