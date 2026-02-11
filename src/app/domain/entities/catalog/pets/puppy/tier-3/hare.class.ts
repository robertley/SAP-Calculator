import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { InjectorService } from 'app/integrations/injector.service';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class Hare extends Pet {
  name = 'Hare';
  tier = 3;
  pack: Pack = 'Puppy';
  health = 4;
  attack = 4;
  initAbilities(): void {
    this.addAbility(new HareAbility(this, this.logService));
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


export class HareAbility extends Ability {
  private logService: LogService;

  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HareAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
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

    // get all equipment from enemy pets
    let enemyPets = owner.parent.opponent.petArray;
    let equipmentPets: Pet[] = [];
    for (let pet of enemyPets) {
      if (pet.equipment) {
        if (
          InjectorService.getInjector()
            .get(EquipmentService)
            .isUsefulPerk(pet.equipment.name)
        ) {
          equipmentPets.push(pet);
        }
      }
    }
    if (equipmentPets.length == 0) {
      return;
    }
    // get random equipment
    const choice = chooseRandomOption(
      {
        key: 'pet.hare-copy-equipment',
        label: formatPetScopedRandomLabel(owner, 'Hare copied equipment source'),
        options: equipmentPets.map((pet) => ({
          id: `${pet.savedPosition + 1}:${pet.name}`,
          label: `O${pet.savedPosition + 1} ${pet.name}`,
        })),
      },
      () => getRandomInt(0, equipmentPets.length - 1),
    );
    let randomEquipmentPet = equipmentPets[choice.index];
    let equipment = randomEquipmentPet.equipment;

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    owner.givePetEquipment(equipment);
    this.logService.createLog({
      message: `${owner.name} copied ${equipment.name} to ${target.name} from ${randomEquipmentPet.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: choice.randomEvent,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HareAbility {
    return new HareAbility(newOwner, this.logService);
  }
}


