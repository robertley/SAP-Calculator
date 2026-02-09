import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


// TO DO: Update faint pool, and add all faint pets
export class Orca extends Pet {
  name = 'Orca';
  tier = 6;
  pack: Pack = 'Star';
  attack = 5;
  health = 7;
  initAbilities(): void {
    this.addAbility(
      new OrcaAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
    );
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


export class OrcaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private petService: PetService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
  ) {
    super({
      name: 'OrcaAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    for (let i = 0; i < this.level; i++) {
      let faintPet = this.petService.getRandomFaintPet(
        owner.parent,
        undefined,
        [owner.name, 'Quetzalcoatlus'],
      );
      faintPet.attack = 6;
      faintPet.health = 6;

      let summonResult = owner.parent.summonPet(
        faintPet,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned a 6/6 ${faintPet.name}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          randomEvent: true,
          pteranodon: pteranodon,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OrcaAbility {
    return new OrcaAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}



