import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class HawaiianMonkSeal extends Pet {
    name = "Hawaiian Monk Seal";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 3;
    health = 4;
    //TO DO: Refactor this into pet memory
    private friendBuffedThisTurn: Set<Pet> = new Set();

    friendAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let targetResp = this.parent.getSpecificPet(this, pet);
        let attackingFriend = targetResp.pet;

        if (!attackingFriend || this.friendBuffedThisTurn.has(attackingFriend)) {
            return;
        }

        // If still standing, give it +2 health per level. Works on three friends per turn.
        if (this.friendBuffedThisTurn.size < 3) {
            if (attackingFriend.alive) {
                let healthBonus = 2 * this.level;
                attackingFriend.increaseHealth(healthBonus);
                this.friendBuffedThisTurn.add(attackingFriend);
                
                this.logService.createLog({
                    message: `${this.name} gave ${attackingFriend.name} ${healthBonus} health`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    randomEvent: targetResp.random
                });
            }
        }
        this.superFriendAttacks(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
    }
    resetPet(): void {
        super.resetPet();
        this.friendBuffedThisTurn.clear();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}