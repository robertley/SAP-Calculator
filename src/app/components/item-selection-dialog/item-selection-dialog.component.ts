import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PetService } from '../../services/pet/pet.service';
import { EquipmentService } from '../../services/equipment/equipment.service';
import {
  getPetAbilityText,
  getPetIconPath,
  getEquipmentAbilityText,
  getEquipmentIconPath,
  getToyAbilityText,
  getToyIconPath,
  getPackIconPath,
} from '../../util/asset-utils';
import { PACK_NAMES } from '../../util/pack-names';
import { ToyService } from '../../services/toy/toy.service';
import { AbstractControl, FormArray, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TooltipPositionDirective } from './tooltip-position.directive';
import { TeamPreset } from '../../services/team-presets.service';

export type SelectionType =
  | 'pet'
  | 'equipment'
  | 'swallowed-pet'
  | 'toy'
  | 'hard-toy'
  | 'pack'
  | 'team';

@Component({
  selector: 'app-item-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    TooltipPositionDirective,
  ],
  templateUrl: './item-selection-dialog.component.html',
  styleUrls: ['./item-selection-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSelectionDialogComponent implements OnInit, OnDestroy {
  @Input() type: SelectionType = 'pet';
  @Input() currentPack: string = 'Turtle';
  @Input() showTokenPets = false;
  @Input() showAllPets = false;
  @Input() customPacks: AbstractControl | null = null;
  @Input() savedTeams: TeamPreset[] = [];

  @Output() select = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  searchQuery = '';
  selectedPack = 'All';
  availablePacks = ['All', ...PACK_NAMES, 'Tokens'];

  items: any[] = [];
  filteredItems: any[] = [];

  private customPacksSubscription: Subscription | null = null;

  trackByPack(index: number, pack: string): string {
    return pack ?? String(index);
  }

  trackByItem(index: number, item: any): string | number {
    return item?.id ?? item?.name ?? index;
  }

  trackByIndex(index: number): number {
    return index;
  }

  constructor(
    private petService: PetService,
    private equipmentService: EquipmentService,
    private toyService: ToyService,
  ) {}

  ngOnInit(): void {
    // Update availablePacks to include custom packs
    this.updateAvailablePacks();

    // Subscribe to custom packs changes
    if (this.customPacks && this.customPacks instanceof FormArray) {
      this.customPacksSubscription = (
        this.customPacks as FormArray
      ).valueChanges.subscribe(() => {
        this.updateAvailablePacks();
        this.loadItems();
      });
    }

    if (this.showAllPets) {
      this.selectedPack = 'All';
    } else if (this.currentPack && this.currentPack !== 'custom') {
      this.selectedPack = this.currentPack;
    }
    if (!this.availablePacks.includes(this.selectedPack)) {
      this.selectedPack = 'All';
    }
    this.loadItems();
  }

  ngOnDestroy(): void {
    if (this.customPacksSubscription) {
      this.customPacksSubscription.unsubscribe();
    }
  }

  private updateAvailablePacks() {
    // Include Custom so registry-only custom pets can be filtered in the picker
    this.availablePacks = ['All', ...PACK_NAMES, 'Tokens'];

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

    if (!this.availablePacks.includes(this.selectedPack)) {
      this.selectedPack = 'All';
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
    } else if (this.type === 'team') {
      this.loadTeams();
    }
    this.filterItems();
  }

  loadPets() {
    const allPets: any[] = [];

    // Base Pack Pets
    for (const pack of PACK_NAMES) {
      const packPets = this.petService.basePackPetsByName[pack];
      if (packPets) {
        for (const [tier, pets] of packPets) {
          pets.forEach((name) => {
            allPets.push({
              name,
              displayName: name,
              tier,
              pack,
              icon: getPetIconPath(name),
              tooltip: getPetAbilityText(name),
              type: 'pet',
              category: `Tier ${tier}`,
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

        const customPackPets =
          this.petService.playerCustomPackPets.get(packName);
        if (customPackPets) {
          for (const [tier, pets] of customPackPets) {
            pets.forEach((name) => {
              allPets.push({
                name,
                displayName: name,
                tier,
                pack: packName,
                icon: getPetIconPath(name),
                tooltip: getPetAbilityText(name),
                type: 'pet',
                category: `Tier ${tier}`,
              });
            });
          }
        }
      }
    }

    // Token Pets
    const tokenPetsList = [
      'Adult Flounder',
      'Angry Pygmy Hog',
      'Baby Urchin',
      'Bee',
      'Bus',
      'Butterfly',
      'Chick',
      'Chimera Goat',
      'Chimera Lion',
      'Chimera Snake',
      'Cooked Roach',
      'Cracked Egg',
      'Cuckoo Chick',
      'Daycrawler',
      'Dirty Rat',
      'Fairy Ball',
      'Fake Nessie',
      'Fire Pup',
      'Giant Eyes Dog',
      'Golden Retriever',
      'Good Dog',
      'Great One',
      'Head',
      'Lizard Tail',
      'Loyal Chinchilla',
      'Mimic Octopus',
      'Moby Dick',
      'Monty',
      'Nessie?',
      'Nest',
      'Quail',
      'Ram',
      'Rock',
      'Salmon',
      'Sleeping Gelada',
      'Smaller Slime',
      'Smaller Slug',
      'Smallest Slug',
      'Tand and Tand',
      'Young Phoenix',
      'Zombie Cricket',
      'Zombie Fly',
    ];

    tokenPetsList.forEach((name) => {
      allPets.push({
        name,
        displayName: name,
        tier: 0,
        pack: 'Tokens',
        icon: getPetIconPath(name),
        tooltip: getPetAbilityText(name),
        type: 'pet',
        category: 'Tokens',
      });
    });

    // De-duplicate
    const byName = new Map<string, any>();
    allPets.forEach((item) => {
      const existing = byName.get(item.name);
      // Prefer token classification if duplicates exist
      const isToken = item.pack === 'Tokens';
      if (!existing || isToken) {
        byName.set(item.name, item);
      }
    });
    this.items = Array.from(byName.values());
  }

  loadEquipment() {
    const allEquip: any[] = [];
    const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
    const ailmentMap = this.equipmentService.getInstanceOfAllAilments();

    equipmentMap.forEach((equip, name) => {
      if (equip?.name === 'Corncob') {
        return;
      }
      allEquip.push({
        name,
        displayName: equip.name,
        tier: equip.tier || 0,
        icon: getEquipmentIconPath(equip.name),
        tooltip: getEquipmentAbilityText(equip.name),
        type: 'equipment',
        category: equip.tier ? `Tier ${equip.tier}` : 'Perks',
        item: equip,
      });
    });

    ailmentMap.forEach((ailment, name) => {
      allEquip.push({
        name,
        displayName: ailment.name,
        tier: 0,
        icon: getEquipmentIconPath(ailment.name, true),
        tooltip: getEquipmentAbilityText(ailment.name),
        type: 'ailment',
        category: 'Ailments',
        item: ailment,
      });
    });

    this.items = allEquip;
  }

  private loadTeams() {
    const teams = Array.isArray(this.savedTeams) ? this.savedTeams : [];
    this.items = teams.map((team) => {
      const petNames = (team.pets || [])
        .map((p) => p?.name)
        .filter(Boolean)
        .slice(0, 5);
      const icons = petNames.map((name) => getPetIconPath(name));
      return {
        id: team.id,
        name: team.name,
        displayName: team.name,
        tier: 0,
        icon: null,
        icons,
        tooltip: petNames.join(', '),
        type: 'team',
        category: 'Saved Teams',
      };
    });
  }

  loadToys(isHard: boolean) {
    const allToys: any[] = [];
    const toyMap = this.toyService.getToysByType(isHard ? 1 : 0);

    toyMap.forEach((toyNames, tier) => {
      toyNames.forEach((name) => {
        allToys.push({
          name,
          displayName: name,
          tier,
          icon: getToyIconPath(name),
          tooltip: getToyAbilityText(name),
          type: isHard ? 'hard-toy' : 'toy',
          category: `Tier ${tier}`,
          item: name,
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
        category: 'Packs',
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
            icon: firstPet
              ? getPetIconPath(firstPet)
              : getPackIconPath(packName),
            type: 'pack',
            category: 'Custom Packs',
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
      category: 'Custom Packs',
    });

    this.items = packItems;
  }

  filterItems() {
    let filtered = this.items;

    if (this.type === 'pet' || this.type === 'swallowed-pet') {
      if (this.selectedPack !== 'All') {
        filtered = filtered.filter(
          (item) =>
            item.pack === this.selectedPack ||
            (this.type === 'swallowed-pet' && item.pack === 'Tokens'),
        );
      }
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.displayName && item.displayName.toLowerCase().includes(query)),
      );
    }

    // Sort by category (to group them), then tier, then name
    this.filteredItems = filtered.sort((a, b) => {
      // Special handling for Ailments to be at the bottom
      if (a.category === 'Ailments' && b.category !== 'Ailments') return 1;
      if (a.category !== 'Ailments' && b.category === 'Ailments') return -1;

      if (a.category !== b.category)
        return a.category.localeCompare(b.category);
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
    if (this.type === 'team') {
      this.select.emit(item.id || item.name);
      return;
    }
    if (
      this.type === 'pet' ||
      this.type === 'swallowed-pet' ||
      this.type === 'pack'
    ) {
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
      const pets = control.get(`tier${tier}Pets`)?.value as
        | string[]
        | null
        | undefined;
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
