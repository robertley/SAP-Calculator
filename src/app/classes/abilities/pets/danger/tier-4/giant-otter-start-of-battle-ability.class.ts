import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GiantOtterStartOfBattleAbility extends Ability {
    private logService: LogService;
    private buffedFriends: Map<Pet, {attack: number, health: number}> = new Map();

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GiantOtterStartOfBattleAbility',
            owner: owner,
            triggers: ['BeforeStartBattle', 'Removed'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    reset(): void {
        this.buffedFriends.clear();
        super.reset();
    }

    removeConditionalBuffs(): void {
        for (let [friend, buffs] of this.buffedFriends) {
            if (friend && friend.alive) {
                friend.increaseAttack(-buffs.attack);
                friend.increaseHealth(-buffs.health);

                this.logService.createLog({
                    message: `${friend.name} lost ${buffs.attack} attack and ${buffs.health} health (Giant Otter removed)`,
                    type: 'ability',
                    player: this.owner.parent
                });
            }
        }
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;
        if (owner.transformed || !owner.alive) {
            if (gameApi.isInStartOfBattleFlag) {
                this.removeConditionalBuffs()
                return;
            } else {
                return;
            }
        }

        let statBonus = this.level * 3; // 3/6/9 based on level

        let targetResp = owner.parent.getAll(false, owner, true);
        let friends = targetResp.pets;

        for (let friend of friends) {
            friend.increaseAttack(statBonus);
            friend.increaseHealth(statBonus);

            // Track the buffs applied (cumulative if pet already buffed)
            let existingBuffs = this.buffedFriends.get(friend);
            if (existingBuffs) {
                this.buffedFriends.set(friend, {
                    attack: existingBuffs.attack + statBonus,
                    health: existingBuffs.health + statBonus
                });
            } else {
                this.buffedFriends.set(friend, {attack: statBonus, health: statBonus});
            }

            this.logService.createLog({
                message: `${owner.name} gave ${friend.name} +${statBonus} attack and +${statBonus} health`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GiantOtterStartOfBattleAbility {
        return new GiantOtterStartOfBattleAbility(newOwner, this.logService);
    }
}