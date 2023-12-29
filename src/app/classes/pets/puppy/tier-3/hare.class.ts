import { cloneDeep, eq } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { EquipmentService } from "../../../../services/equipment.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hare extends Pet {
    name = "Hare";
    tier = 3;
    pack: Pack = 'Puppy';
    health = 3;
    attack = 4;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        // get all equipment from enemy pets
        let enemyPets = this.parent.opponent.petArray;
        let equipmentPets: Pet[] = [];
        for (let pet of enemyPets) {
            if (pet.equipment) {
                equipmentPets.push(pet);
            }
        }
        if (equipmentPets.length == 0) {
            return;
        }
        // get random equipment
        let randomEquipmentPet = equipmentPets[Math.floor(Math.random() * equipmentPets.length)];
        // let equipment = this.equipmentService.getInstanceOfAllEquipment().get(randomEquipmentPet.equipment.name);
        let equipment = cloneDeep(randomEquipmentPet.equipment);
        equipment.reset();

        this.logService.createLog({
            message: `${this.name} copied ${equipment.name} from ${randomEquipmentPet.name}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: equipmentPets.length > 0
        })

        this.givePetEquipment(equipment);
        this.abilityUses++;
        this.superBeforeAttack(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}