import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { InjectorService } from 'app/integrations/injector.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { levelToExp } from 'app/runtime/experience';


export class Wombat extends Pet {
  name = 'Wombat';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new WombatAbility(this, this.logService));
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


export class WombatAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Wombat Ability',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    // Find the first enemy with a faint ability
    const opponentPets = owner.parent.opponent.petArray;
    const target = opponentPets.find((p) => p.alive && p.isFaintPet());

    if (target) {
      const petService = InjectorService.getInjector().get(PetService);
      if (!petService) {
        this.triggerTigerExecution(context);
        return;
      }

      const transformedPet = petService.createPet(
        {
          name: target.name,
          attack: null,
          health: null,
          exp: levelToExp(this.level),
          equipment: null,
          mana: null,
        },
        owner.parent,
      );

      owner.parent.transformPet(owner, transformedPet);

      this.logService.createLog({
        message: `${owner.name} transformed into level ${this.level} ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): WombatAbility {
    return new WombatAbility(newOwner, this.logService);
  }
}





