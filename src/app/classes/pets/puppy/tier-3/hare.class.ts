import { cloneDeep, eq } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { EquipmentService } from "../../../../services/equipment.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Blackberry } from "../../../equipment/puppy/blackberry.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hare extends Pet {
    name = "Hare";
    tier = 3;
    pack: Pack = 'Puppy';
    health = 4;
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
                if (this.isUsefulPerk(pet.equipment.name)) {
                    equipmentPets.push(pet);
                }
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
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }

    private static readonly USEFUL_PERKS: Map<string, number> = new Map([
        // T2
        ['Lime', 2], 
        ['Meat Bone', 2], 
        ['Cherry', 2], 
        ['Fairy Dust', 2],
        // T3  
        ['Garlic', 3], 
        ['Gingerbread Man', 3], 
        ['Fig', 3], 
        ['Cucumber', 3], 
        ['Croissant', 3],
        ['Squash', 3],
        // T4
        ['Banana', 4], 
        ['Love Potion', 4], 
        ['Pie', 4], 
        ['Grapes', 4], 
        ['Cheese', 4], 
        ['Cod Roe', 4],
        ['Salt', 4], 
        ['Fortune Cookie', 4],
        // T5
        ['Easter Egg', 5], 
        ['Magic Beans', 5], 
        ['Chili', 5], 
        ['Lemon', 5], 
        ['Durian', 5],
        ['Honeydew Melon', 5],
        ['Maple Syrup', 5],
        ['Cocoa Bean', 5],
        ['White Okra', 5],
        // T6
        ['Popcorn', 6], 
        ['Steak', 6], 
        ['Pancakes', 6], 
        ['Yggdrasil Fruit', 6], 
        ['Melon', 6], 
        ['Tomato', 6], 
        ['Sudduth Tomato', 6],
        ['Pita Bread', 6],
        // Hidden
        ['Seaweed', 5],
        // Golden  
        ['Caramel', 4]
    ]);

    private isUsefulPerk(equipmentName: string): boolean {
        return Hare.USEFUL_PERKS.has(equipmentName);
    }
}