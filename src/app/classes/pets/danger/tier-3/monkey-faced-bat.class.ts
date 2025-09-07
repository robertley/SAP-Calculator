import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class MonkeyFacedBat extends Pet {
    name = "Monkey-Faced Bat";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 3;
    health = 4;

    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        // Check if hurt pet is behind this pet (higher position index)
        if (!pet || pet.position <= this.position) {
            return;
        }

        // Get 2 random friends (excluding self)
        let targetsResp = this.parent.getRandomPets(2, [this], true, false, this);
        
        for (let target of targetsResp.pets) {
            if (target != null) {
                let power = this.level; // 1/2/3 based on level
                target.increaseAttack(power);
                target.increaseHealth(power);
                
                this.logService.createLog({
                    message: `${this.name} gave ${target.name} ${power} attack and ${power} health`,
                    type: 'ability',
                    player: this.parent,
                    randomEvent: targetsResp.random,
                    tiger: tiger
                });
            }
        }

        this.abilityUses++;
        this.superFriendHurt(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 3; // 3 times per battle
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