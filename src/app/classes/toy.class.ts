import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { LogService } from 'app/services/log.service';
import { ToyService } from 'app/services/toy/toy.service';
import { Pet } from './pet.class';
import { Player } from './player.class';


export class Toy {
  name: string;
  onBreak?(gameApi?: GameAPI, puma?: boolean);
  startOfBattle?(gameApi?: GameAPI, puma?: boolean);
  emptyFromSpace?(
    gameApi?: GameAPI,
    puma?: boolean,
    level?: number,
    priority?: number,
  );
  friendSummoned?(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number);
  friendlyLevelUp?(
    gameApi?: GameAPI,
    pet?: Pet,
    puma?: boolean,
    level?: number,
  );
  friendFaints?(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number);
  friendJumped?(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number);
  allEnemiesFainted?(gameApi?: GameAPI, puma?: boolean);
  parent: Player;
  level: number;
  tier: number;
  used: boolean = false;
  suppressFriendFaintLog = false;
  triggers = 0;
  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    parent: Player,
    level: number,
  ) {
    this.parent = parent;
    this.level = level;
  }
}
