import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Pet } from '../../../pet.class';
import { SalmonOfKnowledge } from 'app/domain/entities/catalog/pets/unicorn/tier-5/salmon-of-knowledge.class';
import { Player } from '../../../player.class';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Nutcracker extends Toy {
  name = 'Nutcracker';
  tier = 4;
  suppressFriendFaintLog = true;
  private pendingSpawn = false;

  friendFaints(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number) {
    if (this.used || this.pendingSpawn) {
      return;
    }
    const alivePets = pet.parent.petArray.filter((p) => p.alive);
    if (alivePets.length > 0) {
      return;
    }

    this.queueSalmonSpawn();
  }

  private queueSalmonSpawn() {
    this.pendingSpawn = true;
    this.abilityService.setCounterEvent({
      priority: 0,
      callback: (_trigger?: unknown, _gameApi?: GameAPI, _triggerPet?: Pet) => {
        this.pendingSpawn = false;
        this.attemptSalmonSpawn();
      },
    });
  }

  private attemptSalmonSpawn() {
    if (this.used) {
      return;
    }

    const alivePets = this.parent.petArray.filter((p) => p.alive);
    if (alivePets.length > 0) {
      return;
    }

    const power = this.level * 6;
    const salmon = new SalmonOfKnowledge(
      this.logService,
      this.abilityService,
      this.parent,
      power,
      power,
      null,
      0,
    );

    if (this.parent.summonPet(salmon, 0).success) {
      this.logService.createLog({
        message: `${this.name} spawned Salmon of Knowledge (${power}/${power})`,
        type: 'ability',
        player: this.parent,
      });
    }

    this.used = true;
  }

  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    protected abilityService: AbilityService,
    parent: Player,
    level: number,
  ) {
    super(logService, toyService, parent, level);
  }
}


export class NutcrackerAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private used: boolean = false;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'NutcrackerAbility',
      owner: owner,
      triggers: [],
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

    // Mirror Nutcracker toy behavior (friendFaints method)
    if (this.used) {
      this.triggerTigerExecution(context);
      return;
    }
    let pets = owner.parent.petArray.filter((p) => p.alive);
    if (pets.length > 0) {
      this.triggerTigerExecution(context);
      return;
    }

    let power = this.level * 6;
    let salmon = new SalmonOfKnowledge(
      this.logService,
      this.abilityService,
      owner.parent,
      power,
      power,
      null,
      0,
    );

    if (owner.parent.summonPet(salmon, 0).success) {
      this.logService.createLog({
        message: `Nutcracker Ability spawned Salmon of Knowledge (${power}/${power})`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.used = true;

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): NutcrackerAbility {
    return new NutcrackerAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}



