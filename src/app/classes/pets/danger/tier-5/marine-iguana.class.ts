import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Melon } from "../../../equipment/turtle/melon.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class MarineIguana extends Pet {
    name = "Marine Iguana";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 4;
    health = 5;
    //TO DO: Refactor into pet memory
    private targetsThisTurn: Pet[] = [];

    beforeFriendAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        let targetResp = this.parent.getSpecificPet(this, pet);
        let attackingFriend = targetResp.pet;
        
        if (!attackingFriend) {
            return;
        }

        // Check if we've already given this friend Melon this turn
        if (this.targetsThisTurn.includes(attackingFriend)) {
            return;
        }

        // Give the friend Melon
        attackingFriend.givePetEquipment(new Melon());
        
        // Track this friend so we don't target them again this turn
        this.targetsThisTurn.push(attackingFriend);
        
        this.logService.createLog({
            message: `${this.name} gave ${attackingFriend.name} Melon`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        this.abilityUses++;
        this.superBeforeFriendAttacks(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level; // 1/2/3 different friends per turn based on level
    }
    resetPet(): void {
        super.resetPet();
        this.targetsThisTurn = [];
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