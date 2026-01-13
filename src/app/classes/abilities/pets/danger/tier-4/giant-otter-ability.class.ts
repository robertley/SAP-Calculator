import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Power } from "app/interfaces/power.interface";

// Before battle: Give friends +2 attack and +5 health until after the first non-jump attack.
export class GiantOtterAbility extends Ability {
    private logService: LogService;
    private buffedFriends: Map<Pet, { attack: number, health: number }> = new Map();

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GiantOtterAbility',
            owner: owner,
            triggers: ['BeforeStartBattle', 'AnyoneAttack'],
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
        for (let [originalFriend, stats] of this.buffedFriends) {
            let currentFriend = originalFriend;
            if (currentFriend.transformed && currentFriend.transformedInto) {
                currentFriend = currentFriend.transformedInto;
            }
            if (currentFriend && currentFriend.alive) {
                if (currentFriend.attack > stats.attack) {
                    const debuffAmt = currentFriend.attack - stats.attack
                    currentFriend.increaseAttack(-debuffAmt);
                    this.logService.createLog({
                        message: `${currentFriend.name} lost ${debuffAmt} attack (Giant Otter Buffs removed)`,
                        type: 'ability',
                        player: this.owner.parent
                    });
                }
                if (currentFriend.health > stats.health) {
                    const debuffAmt = currentFriend.health - stats.health
                    currentFriend.increaseHealth(-debuffAmt);
                    this.logService.createLog({
                        message: `${currentFriend.name} lost ${debuffAmt} health (Giant Otter Buffs removed)`,
                        type: 'ability',
                        player: this.owner.parent
                    });
                }
            }
            // Always delete using the original key
            this.buffedFriends.delete(originalFriend);
        }
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        // Inferred Trigger: AnyoneAttack
        // We know triggers are limited to 'BeforeStartBattle' and 'AnyoneAttack'.
        // We ensure 'AnyoneAttack' passes triggerPet (via AbilityService). 'BeforeStartBattle' does not.
        if (triggerPet) {
            // Remove buffs if it's NOT a jump attack
            if (gameApi.FirstNonJumpAttackHappened) {
                this.removeConditionalBuffs();
            }
            return;
        }

        // Inferred Trigger: BeforeStartBattle
        // Proceed to apply buffs logic below.

        let statBonus: Power = {
            attack: this.level * 2,
            health: this.level * 5
        }; // 2/4/6 Attack, 5/10/15 Health

        let targetResp = owner.parent.getAll(false, owner, true);
        let friends = targetResp.pets;

        for (let friend of friends) {
            if (!this.buffedFriends.has(friend)) {
                this.buffedFriends.set(friend, { attack: friend.attack, health: friend.health });
            }

            friend.increaseAttack(statBonus.attack);
            friend.increaseHealth(statBonus.health);

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