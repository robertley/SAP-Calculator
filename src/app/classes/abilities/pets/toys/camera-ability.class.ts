import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { getOpponent } from 'app/util/helper-functions';

export class CameraAbility extends Ability {
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CameraAbility',
      triggers: ['StartBattle'],
      owner: owner,
      abilityType: 'Pet',
      abilityFunction: (context: AbilityContext) => {
        const { gameApi, puma } = context;
        let opponent = getOpponent(gameApi, owner.parent);
        for (let i = 0; i < this.abilityLevel; i++) {
          let highestAttackPetResp = opponent.getHighestAttackPet();
          let target = highestAttackPetResp.pet;
          if (target == null) {
            return;
          }
          let power = 0.3;
          let reducedTo = Math.max(1, Math.floor(target.attack * (1 - power)));
          target.attack = reducedTo;
          logService.createLog({
            message: `${owner.name} reduced ${target.name} attack by ${power * 100}% (${reducedTo}) (Camera)`,
            type: 'ability',
            player: owner.parent,
            puma: puma,
            randomEvent: highestAttackPetResp.random,
          });
        }
      },
    });
  }
}
