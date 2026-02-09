import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { SleepingGelada } from 'app/domain/entities/catalog/pets/hidden/sleeping-gelada.class';


export class Gelada extends Pet {
  name = 'Gelada';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 4;
  health = 5;

  override initAbilities(): void {
    this.addAbility(
      new GeladaAbility(this, this.logService, this.abilityService),
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


export class GeladaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Gelada Ability',
      owner: owner,
      triggers: ['Eat2'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const pearCount = this.level;

    if (pearCount <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const sleepingGelada = new SleepingGelada(
      this.logService,
      this.abilityService,
      owner.parent,
      undefined,
      undefined,
      undefined,
      owner.exp,
    );

    owner.parent.transformPet(owner, sleepingGelada);
    this.feedFriends(pearCount);

    this.logService.createLog({
      message: `${owner.name} transformed into ${sleepingGelada.name} and fed each friend ${pearCount} Pear${pearCount === 1 ? '' : 's'}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  private feedFriends(pears: number): void {
    if (pears <= 0) {
      return;
    }

    const owner = this.owner;
    const player = owner.parent;
    const friends = player.petArray.filter((friend) => friend && friend.alive);

    for (const friend of friends) {
      for (let i = 0; i < pears; i++) {
        friend.increaseAttack(1);
        friend.increaseHealth(1);
        this.abilityService.triggerFoodEvents(friend, 'pear');
      }
    }
  }

  override copy(newOwner: Pet): GeladaAbility {
    return new GeladaAbility(newOwner, this.logService, this.abilityService);
  }
}



