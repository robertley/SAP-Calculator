import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PetService } from 'app/integrations/pet/pet.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import {
  getPetAbilityText,
  getPetIconPath,
  getEquipmentAbilityText,
  getEquipmentIconPath,
  getToyAbilityText,
  getToyIconPath,
  getPackIconPath,
} from 'app/runtime/asset-catalog';
import { PACK_NAMES } from 'app/runtime/pack-names';
import { ToyService } from 'app/integrations/toy/toy.service';
import { AbstractControl, FormArray, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TooltipPositionDirective } from './tooltip-position.directive';
import { TeamPreset } from 'app/integrations/team-presets.service';
import {
  SelectionItem,
  SelectionType,
} from './item-selection-dialog.types';
export type {
  SelectionItem,
  SelectionItemType,
  SelectionType,
} from './item-selection-dialog.types';

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
export class ItemSelectionDialogComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() type: SelectionType = 'pet';
  @Input() currentPack: string = 'Turtle';
  @Input() showTokenPets = false;
  @Input() showAllPets = false;
  @Input() customPacks: AbstractControl | null = null;
  @Input() savedTeams: TeamPreset[] = [];

  @Output() select = new EventEmitter<unknown>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  searchQuery = '';
  selectedPack = 'All';
  availablePacks = ['All', ...PACK_NAMES, 'Tokens'];

  items: SelectionItem[] = [];
  filteredItems: SelectionItem[] = [];

  private customPacksSubscription: Subscription | null = null;
  private basePetItems: SelectionItem[] | null = null;
  private tokenItems: SelectionItem[] = [];
  private equipmentItems: SelectionItem[] | null = null;
  private toyItems: SelectionItem[] | null = null;
  private hardToyItems: SelectionItem[] | null = null;
  private searchDebounceHandle: ReturnType<typeof setTimeout> | null = null;

  trackByPack(index: number, pack: string): string {
    return pack ?? String(index);
  }

  trackByItem(index: number, item: SelectionItem): string | number {
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
    this.updateAvailablePacks();

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
      this.searchInput?.nativeElement?.select();
    });
  }

  ngOnDestroy(): void {
    if (this.customPacksSubscription) {
      this.customPacksSubscription.unsubscribe();
    }
    if (this.searchDebounceHandle) {
      clearTimeout(this.searchDebounceHandle);
      this.searchDebounceHandle = null;
    }
  }

  private updateAvailablePacks() {
    this.availablePacks = ['All', ...PACK_NAMES, 'Tokens'];

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
    const allPets: SelectionItem[] = [];

    if (!this.basePetItems) {
      const basePets: SelectionItem[] = [];
      for (const pack of PACK_NAMES) {
        const packPets = this.petService.basePackPetsByName[pack];
        if (packPets) {
          for (const [tier, pets] of packPets) {
            pets.forEach((name) => {
              basePets.push({
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
      this.basePetItems = basePets;
    }
    allPets.push(...this.basePetItems);

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

    this.tokenItems = this.buildTokenItems();
    allPets.push(...this.tokenItems);

    const byName = new Map<string, SelectionItem>();
    allPets.forEach((item) => {
      const existing = byName.get(item.name);
      if (!existing) {
        byName.set(item.name, item);
        return;
      }
      const existingIsToken = existing.pack === 'Tokens';
      const incomingIsToken = item.pack === 'Tokens';
      if (existingIsToken && !incomingIsToken) {
        byName.set(item.name, item);
      }
    });
    this.items = Array.from(byName.values());
  }

  loadEquipment() {
    if (!this.equipmentItems) {
      const allEquip: SelectionItem[] = [];
      const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
      const ailmentMap = this.equipmentService.getInstanceOfAllAilments();

      equipmentMap.forEach((equip, name) => {
        if (equip?.name === 'Corncob' || equip?.name === 'Mana Potion') {
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

      this.equipmentItems = allEquip;
    }
    this.items = this.equipmentItems;
  }

  private loadTeams() {
    const teams = Array.isArray(this.savedTeams) ? this.savedTeams : [];
    this.items = teams.map<SelectionItem>((team) => {
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
    const cache = isHard ? this.hardToyItems : this.toyItems;
    if (!cache) {
      const allToys: SelectionItem[] = [];
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

      if (isHard) {
        this.hardToyItems = allToys;
      } else {
        this.toyItems = allToys;
      }
    }
    this.items = isHard ? this.hardToyItems : this.toyItems;
  }

  loadPacks() {
    const packItems: SelectionItem[] = [];

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
      if (this.selectedPack === 'Tokens') {
        filtered = this.tokenItems;
      } else if (this.selectedPack !== 'All') {
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

    this.filteredItems = [...filtered].sort((a, b) => {
      if (a.category === 'Ailments' && b.category !== 'Ailments') return 1;
      if (a.category !== 'Ailments' && b.category === 'Ailments') return -1;

      if (a.category !== b.category)
        return a.category.localeCompare(b.category);
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.name.localeCompare(b.name);
    });
  }

  onSearchChange() {
    if (this.searchDebounceHandle) {
      clearTimeout(this.searchDebounceHandle);
    }
    this.searchDebounceHandle = setTimeout(() => {
      this.searchDebounceHandle = null;
      this.filterItems();
    }, 50);
  }

  selectPack(pack: string) {
    this.selectedPack = pack;
    this.filterItems();
  }

  onItemClick(item: SelectionItem | null) {
    if (!item) {
      this.select.emit(null);
      return;
    }
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

  private buildTokenItems(): SelectionItem[] {
    const tokenItems: SelectionItem[] = [];
    for (const [tier, pets] of this.petService.tokenPetsMap) {
      pets.forEach((name) => {
        tokenItems.push({
          name,
          displayName: name,
          tier,
          pack: 'Tokens',
          icon: getPetIconPath(name),
          tooltip: getPetAbilityText(name),
          type: 'pet',
          category: 'Tokens',
        });
      });
    }
    return tokenItems;
  }
}

