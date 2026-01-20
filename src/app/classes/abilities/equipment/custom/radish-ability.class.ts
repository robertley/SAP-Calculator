import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment/equipment.service";
import { InjectorService } from "app/services/injector.service";
import { DANGERS_AND_USEFUL_POOLS } from "app/data/dangers-and-useful";
import { getRandomInt } from "app/util/helper-functions";

export class RadishAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private equipmentService: EquipmentService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'RadishAbility',
            owner: owner,
            triggers: ['BeforeStartBattle'],
            abilityType: 'Equipment',
            native: true,
            abilitylevel: 1,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.equipment = equipment;
        this.logService = logService;
        this.equipmentService = InjectorService.getInjector().get(EquipmentService);
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        const tier = Math.min(Math.max(owner.tier ?? owner.level ?? 1, 1), 6);
        const pool = DANGERS_AND_USEFUL_POOLS.radish[tier];

        if (!pool || pool.length === 0) {
            return;
        }

        const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
        const availablePerks = pool.filter((name) => equipmentMap.has(name));

        if (availablePerks.length === 0) {
            return;
        }

        const randomIndex = getRandomInt(0, availablePerks.length - 1);
        const perkName = availablePerks[randomIndex];
        const perk = equipmentMap.get(perkName);

        if (!perk) {
            return;
        }

        owner.givePetEquipment(perk);

        this.logService.createLog({
            message: `${owner.name} gained ${perk.name} before battle (Radish).`,
            type: 'equipment',
            player: owner.parent,
            randomEvent: true
        });
    }
}
