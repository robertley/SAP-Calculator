import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { PetService } from '../../services/pet/pet.service';
import { EquipmentService } from '../../services/equipment/equipment.service';
import { Equipment } from '../../classes/equipment.class';
import { getPetIconPath, getEquipmentIconPath, getToyIconPath, getPackIconPath } from '../../util/asset-utils';
import { PACK_NAMES } from '../../util/pack-names';
import { ToyService } from '../../services/toy/toy.service';
import { AbstractControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';

export type SelectionType = 'pet' | 'equipment' | 'swallowed-pet' | 'toy' | 'hard-toy' | 'pack';

@Component({
    selector: 'app-item-selection-dialog',
    templateUrl: './item-selection-dialog.component.html',
    styleUrls: ['./item-selection-dialog.component.scss']
})
export class ItemSelectionDialogComponent implements OnInit, OnDestroy {
    @Input() type: SelectionType = 'pet';
    @Input() currentPack: string = 'Turtle';
    @Input() showTokenPets = false;
    @Input() showAllPets = false;
    @Input() customPacks: AbstractControl | null = null;

    @Output() select = new EventEmitter<any>();
    @Output() close = new EventEmitter<void>();

    searchQuery = '';
    selectedPack = 'All';
    availablePacks = ['All', ...PACK_NAMES, 'Tokens'];

    items: any[] = [];
    filteredItems: any[] = [];

    private customPacksSubscription: Subscription | null = null;

    constructor(
        private petService: PetService,
        private equipmentService: EquipmentService,
        private toyService: ToyService
    ) { }

    ngOnInit(): void {
        // Update availablePacks to include custom packs
        this.updateAvailablePacks();

        // Subscribe to custom packs changes
        if (this.customPacks && this.customPacks instanceof FormArray) {
            this.customPacksSubscription = (this.customPacks as FormArray).valueChanges.subscribe(() => {
                this.updateAvailablePacks();
                this.loadItems();
            });
        }

        if (this.showAllPets) {
            this.selectedPack = 'All';
        } else if (this.currentPack && this.currentPack !== 'custom') {
            this.selectedPack = this.currentPack;
        }
        this.loadItems();
    }

    ngOnDestroy(): void {
        if (this.customPacksSubscription) {
            this.customPacksSubscription.unsubscribe();
        }
    }

    private updateAvailablePacks() {
        this.availablePacks = ['All', ...PACK_NAMES.filter(p => p !== 'Custom'), 'Tokens'];

        // Add custom packs to availablePacks
        if (this.customPacks && this.customPacks instanceof FormArray) {
            const customPacksArray = this.customPacks as FormArray;
            for (const control of customPacksArray.controls) {
                const packName = control.get('name')?.value;
                if (packName && control.valid) {
                    this.availablePacks.push(packName);
                }
            }
        }
    }

    loadItems() {
        if (this.type === 'pet' || this.type === 'swallowed-pet') {
            this.loadPets();
        } else if (this.type === 'equipment') {
            this.loadEquipment();
        } else if (this.type === 'toy') {
            this.loadToys(false);
        } else if (this.type === 'hard-toy') {
            this.loadToys(true);
        } else if (this.type === 'pack') {
            this.loadPacks();
        }
        this.filterItems();
    }

    loadPets() {
        const allPets: any[] = [];

        // Base Pack Pets
        for (const pack of PACK_NAMES) {
            if (pack === 'Custom') continue;
            const packPets = this.petService.basePackPetsByName[pack];
            if (packPets) {
                for (const [tier, pets] of packPets) {
                    pets.forEach(name => {
                        allPets.push({
                            name,
                            displayName: name,
                            tier,
                            pack,
                            icon: getPetIconPath(name),
                            type: 'pet',
                            category: `Tier ${tier}`
                        });
                    });
                }
            }
        }

        // Custom Pack Pets
        if (this.customPacks && this.customPacks instanceof FormArray) {
            const customPacksArray = this.customPacks as FormArray;
            for (const control of customPacksArray.controls) {
                const packName = control.get('name')?.value;
                if (!packName || !control.valid) continue;

                const customPackPets = this.petService.playerCustomPackPets.get(packName);
                if (customPackPets) {
                    for (const [tier, pets] of customPackPets) {
                        pets.forEach(name => {
                            allPets.push({
                                name,
                                displayName: name,
                                tier,
                                pack: packName,
                                icon: getPetIconPath(name),
                                type: 'pet',
                                category: `Tier ${tier}`
                            });
                        });
                    }
                }
            }
        }

        // Token Pets
        const tokenPetsList = [
            'Bee', 'Bus', 'Chick', 'Dirty Rat', 'Lizard Tail', 'Ram', 'Smaller Slug', 'Smallest Slug',
            'Zombie Cricket', 'Zombie Fly', 'Chimera Goat', 'Chimera Lion', 'Chimera Snake', 'Daycrawler',
            'Head', 'Monty', 'Nessie?', 'Smaller Slime', 'Young Phoenix', 'Good Dog', 'Adult Flounder',
            'Burbel', 'Cooked Roach', 'Cuckoo Chick', 'Fake Nessie', 'Guinea Piglet', 'Hydra Head',
            'Moby Dick', 'Quail', 'Sleeping Gelada', 'Tand and Tand'
        ];

        tokenPetsList.forEach(name => {
            allPets.push({
                name,
                displayName: name,
                tier: 0,
                pack: 'Tokens',
                icon: getPetIconPath(name),
                type: 'pet',
                category: 'Tokens'
            });
        });

        // De-duplicate
        const seen = new Set();
        this.items = allPets.filter(item => {
            const duplicate = seen.has(item.name);
            seen.add(item.name);
            return !duplicate;
        });
    }

    loadEquipment() {
        const allEquip: any[] = [];
        const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
        const ailmentMap = this.equipmentService.getInstanceOfAllAilments();

        equipmentMap.forEach((equip, name) => {
            allEquip.push({
                name,
                displayName: equip.name,
                tier: equip.tier || 0,
                icon: getEquipmentIconPath(equip.name),
                type: 'equipment',
                category: equip.tier ? `Tier ${equip.tier}` : 'Perks',
                item: equip
            });
        });

        ailmentMap.forEach((ailment, name) => {
            allEquip.push({
                name,
                displayName: ailment.name,
                tier: 0,
                icon: getEquipmentIconPath(ailment.name, true),
                type: 'ailment',
                category: 'Ailments',
                item: ailment
            });
        });

        this.items = allEquip;
    }

    loadToys(isHard: boolean) {
        const allToys: any[] = [];
        const toyMap = this.toyService.getToysByType(isHard ? 1 : 0);

        toyMap.forEach((toyNames, tier) => {
            toyNames.forEach(name => {
                allToys.push({
                    name,
                    displayName: name,
                    tier,
                    icon: getToyIconPath(name),
                    type: isHard ? 'hard-toy' : 'toy',
                    category: `Tier ${tier}`,
                    item: name
                });
            });
        });

        this.items = allToys;
    }

    loadPacks() {
        const packItems: any[] = [];

        // Add base packs
        for (const name of PACK_NAMES) {
            if (name === 'Custom') continue;
            packItems.push({
                name,
                displayName: name,
                tier: 0,
                icon: getPackIconPath(name),
                type: 'pack',
                category: 'Packs'
            });
        }

        // Add custom packs
        if (this.customPacks && this.customPacks instanceof FormArray) {
            const customPacksArray = this.customPacks as FormArray;
            for (const control of customPacksArray.controls) {
                const packName = control.get('name')?.value;
                if (packName && control.valid) {
                    const firstPet = this.getFirstCustomPackPet(control);
                    packItems.push({
                        name: packName,
                        displayName: packName,
                        tier: 0,
                        icon: firstPet ? getPetIconPath(firstPet) : getPackIconPath(packName),
                        type: 'pack',
                        category: 'Custom Packs'
                    });
                }
            }
        }

        // Add "Add Custom Pack" option
        packItems.push({
            name: 'Add Custom Pack',
            displayName: '+ Add Custom Pack',
            tier: 0,
            icon: getPetIconPath('White Tiger'),
            type: 'pack',
            category: 'Custom Packs'
        });

        this.items = packItems;
    }

    filterItems() {
        let filtered = this.items;

        if (this.type === 'pet' || this.type === 'swallowed-pet') {
            if (this.selectedPack !== 'All') {
                filtered = filtered.filter(item => item.pack === this.selectedPack);
            }
        }

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.displayName && item.displayName.toLowerCase().includes(query))
            );
        }

        // Sort by category (to group them), then tier, then name
        this.filteredItems = filtered.sort((a, b) => {
            // Special handling for Ailments to be at the bottom
            if (a.category === 'Ailments' && b.category !== 'Ailments') return 1;
            if (a.category !== 'Ailments' && b.category === 'Ailments') return -1;

            if (a.category !== b.category) return a.category.localeCompare(b.category);
            if (a.tier !== b.tier) return a.tier - b.tier;
            return a.name.localeCompare(b.name);
        });
    }

    onSearchChange() {
        this.filterItems();
    }

    selectPack(pack: string) {
        this.selectedPack = pack;
        this.filterItems();
    }

    onItemClick(item: any) {
        if (this.type === 'pet' || this.type === 'swallowed-pet' || this.type === 'pack') {
            this.select.emit(item.name);
        } else {
            this.select.emit(item.item);
        }
    }

    onCancel() {
        this.close.emit();
    }

    private getFirstCustomPackPet(control: AbstractControl): string | null {
        for (let tier = 1; tier <= 6; tier++) {
            const pets = control.get(`tier${tier}Pets`)?.value as string[] | null | undefined;
            if (Array.isArray(pets)) {
                const firstPet = pets.find((pet) => Boolean(pet));
                if (firstPet) {
                    return firstPet;
                }
            }
        }
        return null;
    }
}
