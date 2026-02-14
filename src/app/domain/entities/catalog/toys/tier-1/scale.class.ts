import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Pet } from '../../../pet.class';
import { Toy } from '../../../toy.class';


export class Scale extends Toy {
  name = 'Scale';
  tier = 1;

  private abominationHasBehemoth(pet: Pet): boolean {
    if (pet?.name !== 'Abomination') {
      return false;
    }
    return [1, 2, 3].some((slot) => {
      const swallowed = (pet as unknown as Record<string, unknown>)[
        `abominationSwallowedPet${slot}`
      ];
      return swallowed === 'Behemoth';
    });
  }

  private getAttackCap(pet: Pet): number {
    return pet?.name === 'Behemoth' || this.abominationHasBehemoth(pet) ? 100 : 50;
  }

  private getHealthCap(pet: Pet): number {
    return pet?.name === 'Behemoth' || pet?.name === 'Giant Tortoise' || this.abominationHasBehemoth(pet)
      ? 100
      : 50;
  }

  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const turnNumber = gameApi?.turnNumber ?? 1;
    for (const pet of this.parent.petArray) {
      const targetAttack = Math.min(turnNumber, this.getAttackCap(pet));
      const targetHealth = Math.min(turnNumber, this.getHealthCap(pet));
      const attackDelta = targetAttack - pet.attack;
      const healthDelta = targetHealth - pet.health;
      if (attackDelta !== 0) {
        pet.increaseAttack(attackDelta);
      }
      if (healthDelta !== 0) {
        pet.increaseHealth(healthDelta);
      }
      this.logService.createLog({
        message: `${this.name} set ${pet.name} to ${targetAttack}/${targetHealth}.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}
