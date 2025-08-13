import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { SparrowBuffedStrawberry } from "../../../equipment/hidden/sparrow-buffed-strawberry.class";
import { Strawberry } from "../../../equipment/star/strawberry.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Sparrow extends Pet {
    name = "Sparrow";
    tier = 4;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;
    buffedPets: Pet[] = [];

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        const friendsWithStrawberries = this.parent.petArray.filter(
            pet => pet.equipment instanceof Strawberry
        ) as Pet[];

        if (friendsWithStrawberries.length > 0) {
            const reductionAmount = this.level * 5;

            this.logService.createLog({
                message: `${this.name} enhances its friends' Strawberries, making them take ${reductionAmount} less damage, twice.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });

            for (const pet of friendsWithStrawberries) {
                const buffedStrawberry = new SparrowBuffedStrawberry(reductionAmount, pet.equipment as Strawberry, this.logService, this.abilityService);
                pet.givePetEquipment(buffedStrawberry);
                this.buffedPets.push(pet);
            }
        }

        this.superStartOfBattle(gameApi, tiger);
    }

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (const pet of this.buffedPets) {
            // Check if the pet still has the buffed strawberry (it might have been replaced).
            if (pet.equipment instanceof SparrowBuffedStrawberry) {
                this.logService.createLog({
                    message: `${this.name} fainted, so ${pet.name}'s Strawberry lost its defensive buff.`,
                    type: 'ability',
                    player: this.parent
                });
                pet.givePetEquipment((pet.equipment as SparrowBuffedStrawberry).originalEquipment);
            }
        }
        
        this.buffedPets = [];
        
        this.superFaint(gameApi, tiger);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.buffedPets = [];
    }
}