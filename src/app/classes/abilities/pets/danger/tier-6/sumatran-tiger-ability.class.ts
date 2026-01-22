import { AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetAbility } from '../../pet-ability.class';

export class SumatranTigerAbility extends PetAbility {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      owner,
      name: 'SumatranTigerAbility',
      triggers: ['StartBattle'],
    });
    this.logService = logService;
  }

  protected executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getOppositeEnemyPet(owner);
    let oppositeEnemy = targetResp.pet;

    if (oppositeEnemy) {
      // Jump-attack the opposite enemy
      owner.jumpAttackPrep(oppositeEnemy);
      owner.jumpAttack(oppositeEnemy, tiger, null, targetResp.random);

      // Level 2 and 3: Deal damage to adjacent enemies
      if (owner.level >= 2) {
        let damage = this.level === 2 ? 6 : 12; // 6 for level 2, 12 for level 3
        let adjacentTargets: Pet[] = [];
        if (targetResp.random) {
          adjacentTargets = owner.parent.getRandomLivingPets(2).pets;
        } else {
          // Get pet behind target (higher position number)
          let petBehind = oppositeEnemy.petBehind();
          if (petBehind && petBehind.alive) {
            adjacentTargets.push(petBehind);
          }

          // Get pet in front of target (lower position number)
          let petInFront = oppositeEnemy.petAhead;
          if (petInFront && petInFront.alive) {
            adjacentTargets.push(petInFront);
          }
        }
        // Deal damage to all adjacent enemies
        for (let adjacentTarget of adjacentTargets) {
          owner.snipePet(adjacentTarget, damage, targetResp.random, tiger);
        }
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SumatranTigerAbility {
    return new SumatranTigerAbility(newOwner, this.logService);
  }
}
