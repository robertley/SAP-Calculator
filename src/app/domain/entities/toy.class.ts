import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { LogService } from 'app/integrations/log.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Pet } from './pet.class';
import { Player } from './player.class';
import { installLogServiceFallback } from 'app/runtime/log-service-fallback';


export class Toy {
  name: string;
  onBreak?(gameApi?: GameAPI, puma?: boolean): void;
  startOfBattle?(gameApi?: GameAPI, puma?: boolean): void;
  emptyFromSpace?(
    gameApi?: GameAPI,
    puma?: boolean,
    level?: number,
    priority?: number,
  ): void;
  friendSummoned?(
    gameApi?: GameAPI,
    pet?: Pet,
    puma?: boolean,
    level?: number,
  ): void;
  friendlyLevelUp?(
    gameApi?: GameAPI,
    pet?: Pet,
    puma?: boolean,
    level?: number,
  ): void;
  friendFaints?(
    gameApi?: GameAPI,
    pet?: Pet,
    puma?: boolean,
    level?: number,
  ): void;
  friendJumped?(
    gameApi?: GameAPI,
    pet?: Pet,
    puma?: boolean,
    level?: number,
  ): void;
  allEnemiesFainted?(gameApi?: GameAPI, puma?: boolean): void;
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
    installLogServiceFallback(this);
    this.parent = parent;
    this.level = level;
  }
}

