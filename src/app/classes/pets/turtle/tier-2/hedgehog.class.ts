import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hedgehog extends Pet {
    name = "Hedgehog";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 3;
    faint(gameApi: GameAPI, tiger) {
        let targetPets = gameApi.player.petArray.filter((pet) => {
            return pet != this && pet.alive;
        })
        targetPets.reverse();
        targetPets = [
            ...targetPets,
            ...gameApi.opponet.petArray.filter((pet) => {
                return pet.alive;
            })
        ];
        let damage = this.level * 2;
        for (let pet of targetPets) {
            this.snipePet(pet, damage, false, tiger);
        }

        super.superFaint(gameApi, tiger);
        this.done = true;
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}