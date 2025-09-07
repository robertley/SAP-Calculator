import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Velociraptor extends Pet {
    name = "Velociraptor";
    tier = 6;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;

    friendAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        // Find the pet ahead (to the left) with Strawberry
        let targetPet: Pet | undefined;
        let petIndex = this.parent.petArray.indexOf(this);
        
        for (let i = petIndex - 1; i >= 0; i--) {
            let checkPet = this.parent.petArray[i];
            if (checkPet.alive && checkPet.equipment && checkPet.equipment.name === 'Strawberry') {
                targetPet = checkPet;
                break;
            }
        }

        if (!targetPet) {
            return;
        }

        // Remove the Strawberry equipment
        if (targetPet && targetPet.equipment && targetPet.equipment.name === 'Strawberry') {
            targetPet.removePerk();
            this.logService.createLog({
                message: `${this.name} removed Strawberry from ${targetPet.name}`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });

            let attackBonus = this.level * 2;
            let healthBonus = this.level * 3;
            
            // Give all friends the bonus
            let friendlyPetsResp = this.parent.getRandomPets(5, null, null, null, this);
            let friendlyPets = friendlyPetsResp.pets;
            for (let friendPet of friendlyPets) {
                friendPet.increaseAttack(attackBonus);
                friendPet.increaseHealth(healthBonus);
                
                this.logService.createLog({
                    message: `${this.name} gave ${friendPet.name} +${attackBonus} attack and +${healthBonus} health`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    randomEvent: friendlyPetsResp.random
                });
            }
        }

        this.superFriendAttacks(gameApi, pet, tiger);
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