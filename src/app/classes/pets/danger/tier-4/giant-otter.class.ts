import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class GiantOtter extends Pet {
    name = "Giant Otter";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 4;
    health = 3;

    // Track which friends received buffs and how much
    private buffedFriends: Map<Pet, {attack: number, health: number}> = new Map();

    beforeStartOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let statBonus = this.level * 3; // 3/6/9 based on level
        
        let targetResp = this.parent.getAll(false, this, true); 
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
                message: `${this.name} gave ${friend.name} +${statBonus} attack and +${statBonus} health`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }
        
        this.superBeforeStartOfBattle(gameApi, tiger);
    }

    private removeConditionalBuffs(): void {
        for (let [friend, buffs] of this.buffedFriends) {
            if (friend && friend.alive) {
                friend.increaseAttack(-buffs.attack);
                friend.increaseHealth(-buffs.health);
                
                this.logService.createLog({
                    message: `${friend.name} lost ${buffs.attack} attack and ${buffs.health} health (Giant Otter removed)`,
                    type: 'ability',
                    player: this.parent
                });
            }
        }
    }
    friendTransformed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        // If Giant Otter is being transformed during start of battle, remove buffs
        if (pet === this && gameApi?.isInStartOfBattleFlag) {
            this.removeConditionalBuffs();
        }
        
        this.superFriendTransformed(gameApi, pet, tiger);
    }

    // Override faint to remove buffs if Giant Otter dies during start of battle
    afterFaint(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (gameApi?.isInStartOfBattleFlag) {
            this.removeConditionalBuffs();
        }
        
        this.superAfterFaint(gameApi, tiger, pteranodon);
    }
    resetPet(): void {
        super.resetPet();
        this.buffedFriends.clear(); // Clear buff tracking between battles
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