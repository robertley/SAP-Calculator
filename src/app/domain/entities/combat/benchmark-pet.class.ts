import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Pet } from '../pet.class';
import { Player } from '../player.class';

/**
 * A deliberately featureless combatant used to calibrate board strength.
 * It is not registered content and must never appear in normal pet selection.
 */
export class BenchmarkPet extends Pet {
  name = 'Benchmark Pet';
  baseName = 'Benchmark Pet';
  tier = 0;
  pack = 'Custom' as const;
  hidden = true;

  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
    attack: number,
    health: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(0, health, attack, 0);
  }
}
