import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Power } from "app/interfaces/power.interface";

export class GiantOtterAbility extends Ability {
    private logService: LogService;
    private buffedFriends: Map<Pet, {attack: number, health: number}> = new Map();

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GiantOtterAbility',
            owner: owner,
            triggers: ['BeforeStartBattle', 'BeforeFirstNonJumpAttack'],
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
            if (buffs.attack == 0 && buffs.health == 0) {
                continue;
            }
            if (friend && friend.alive) {
                friend.increaseAttack(-buffs.attack);
                friend.increaseHealth(-buffs.health);
                this.logService.createLog({
                    message: `${friend.name} lost ${buffs.attack} attack and ${buffs.health} health (Giant Otter Buffs removed)`,
                    type: 'ability',
                    player: this.owner.parent
                });
                this.buffedFriends.delete(friend);
            }
        }
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;
        if (gameApi.FirstNonJumpAttackHappened) {
            this.removeConditionalBuffs()
            return;
        } 
        let statBonus: Power = {
            attack: this.level * 2,
            health: this.level * 6
        }; // 3/6/9 based on level

        let targetResp = owner.parent.getAll(false, owner, true);
        let friends = targetResp.pets;

        for (let friend of friends) {
            friend.increaseAttack(statBonus.attack);
            friend.increaseHealth(statBonus.health);

            // Track the buffs applied (cumulative if pet already buffed)
            let existingBuffs = this.buffedFriends.get(friend);
            if (existingBuffs) {
                this.buffedFriends.set(friend, {
                    attack: existingBuffs.attack + statBonus.attack,
                    health: existingBuffs.health + statBonus.health
                });
            } else {
                this.buffedFriends.set(friend, {attack: statBonus.attack, health: statBonus.health});
            }

            this.logService.createLog({
                message: `${owner.name} gave ${friend.name} +${statBonus.attack} attack and +${statBonus.health} health`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GiantOtterAbility {
        return new GiantOtterAbility(newOwner, this.logService);
    }
}