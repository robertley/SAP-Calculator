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
import {
  getPackIconPath,
  getPetIconPath,
} from 'app/runtime/asset-catalog';
import { PACK_NAMES } from 'app/runtime/pack-names';
import { AbstractControl, FormArray, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TooltipPositionDirective } from './tooltip-position.directive';
import { TeamPreset } from 'app/integrations/team-presets.service';
import {
  SelectionItem,
  SelectionType,
} from './item-selection-dialog.types';
import {
  IndexedSelectionItem,
  ItemSelectionCatalogService,
  sortItemsByTrigger,
  TriggerFilterEntry,
  getTriggerFilterEntries,
} from './item-selection-catalog.service';
export type {
  SelectionItem,
  SelectionItemType,
  SelectionType,
} from './item-selection-dialog.types';

type ItemSelectorSortMode = 'default' | 'trigger';

const ITEM_SELECTOR_WIDTH_STORAGE_KEY = 'sapItemSelectorWidthPx';
const ITEM_SELECTOR_DEFAULT_WIDTH_PX = 840;
const ITEM_SELECTOR_MIN_WIDTH_PX = 560;
const ITEM_SELECTOR_VIEWPORT_GUTTER_PX = 32;

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
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() type: SelectionType = 'pet';
  @Input() currentPack: string = 'Turtle';
  @Input() showTokenPets = false;
  @Input() showAllPets = false;
  @Input() customPacks: AbstractControl | null = null;
  @Input() savedTeams: TeamPreset[] = [];
  @Input() lockAbilityLevel = false;
  @Input() initialLevel = 1;

  @Output() select = new EventEmitter<unknown>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('selectionDialog') selectionDialog?: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  searchQuery = '';
  selectedPack = 'All';
  availablePacks = ['All', ...PACK_NAMES, 'Tokens'];
  selectedItemCategory = 'All';
  availableItemCategories = ['All'];
  selectedTriggerCategory = 'All';
  selectedLevel = 1;
  selectedSortMode: ItemSelectorSortMode = 'default';

  items: IndexedSelectionItem[] = [];
  filteredItems: IndexedSelectionItem[] = [];
  triggerFilterEntries: TriggerFilterEntry[] = [];
  dialogWidthPx = this.getInitialDialogWidth();
  isResizing = false;
  suppressOverlayClose = false;

  private customPacksSubscription: Subscription | null = null;
  private searchDebounceHandle: ReturnType<typeof setTimeout> | null = null;
  private resizeStartX = 0;
  private resizeStartWidth = ITEM_SELECTOR_DEFAULT_WIDTH_PX;
  private resizePointerId: number | null = null;
  private resizeHandleElement: HTMLElement | null = null;
  private readonly boundResizePointerMove = (event: PointerEvent): void => {
    this.onResizePointerMove(event);
  };
  private readonly boundResizePointerUp = (event: PointerEvent): void => {
    this.onResizePointerUp(event);
  };

  trackByPack(index: number, pack: string): string {
    return pack ?? String(index);
  }

  trackByCategory(index: number, category: string): string {
    return category ?? String(index);
  }

  trackByTriggerEntry(index: number, entry: TriggerFilterEntry): string {
    if (entry.type === 'single') {
      return entry.category;
    }
    return entry.label ?? String(index);
  }

  trackByItem(index: number, item: SelectionItem): string | number {
    return item?.id ?? item?.name ?? index;
  }

  trackByIndex(index: number): number {
    return index;
  }

  get shouldShowNoneCard(): boolean {
    return (
      this.type !== 'swallowed-pet' &&
      this.type !== 'ability' &&
      this.type !== 'pack' &&
      this.type !== 'team' &&
      this.searchQuery.trim().length === 0
    );
  }

  get supportsTriggerSort(): boolean {
    return (
      this.type === 'pet' ||
      this.type === 'swallowed-pet' ||
      this.type === 'equipment' ||
      this.type === 'toy' ||
      this.type === 'hard-toy'
    );
  }

  get defaultSortLabel(): string {
    if (this.type === 'pet' || this.type === 'swallowed-pet') {
      return 'Pack';
    }
    return 'Category';
  }

  get showPackFilters(): boolean {
    return (
      (this.type === 'pet' || this.type === 'swallowed-pet') &&
      this.selectedSortMode === 'default'
    );
  }

  get showDefaultCategoryFilters(): boolean {
    return (
      (this.type === 'equipment' ||
        this.type === 'toy' ||
        this.type === 'hard-toy') &&
      this.selectedSortMode === 'default'
    );
  }

  get showTriggerFilters(): boolean {
    return this.supportsTriggerSort && this.selectedSortMode === 'trigger';
  }

  constructor(
    private catalogService: ItemSelectionCatalogService,
  ) { }

  ngOnInit(): void {
    this.selectedLevel = this.clampLevel(this.initialLevel);
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
    this.stopResizing();
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
    this.items = this.catalogService.getItems(this.type, {
      customPacks: this.customPacks,
      savedTeams: this.savedTeams,
    });
    this.updateAvailableItemCategories();
    this.updateAvailableTriggerCategories();
    this.filterItems();
  }

  filterItems() {
    let filtered = this.items;

    if (
      (this.type === 'pet' || this.type === 'swallowed-pet') &&
      this.selectedSortMode === 'default'
    ) {
      if (this.selectedPack === 'Tokens') {
        filtered = filtered.filter((item) => item.pack === 'Tokens');
      } else if (this.selectedPack !== 'All') {
        filtered = filtered.filter(
          (item) =>
            item.pack === this.selectedPack ||
            (this.type === 'swallowed-pet' && item.pack === 'Tokens'),
        );
      }
    }

    if (this.type === 'ability' && this.selectedPack !== 'All') {
      if (this.selectedPack === 'Tokens') {
        filtered = filtered.filter((item) => item.pack === 'Tokens');
      } else if (this.selectedPack === 'Equipment') {
        filtered = filtered.filter(
          (item) => item.type === 'equipment' || item.type === 'ailment',
        );
      } else if (this.selectedPack === 'Toys') {
        filtered = filtered.filter(
          (item) => item.type === 'toy' || item.type === 'hard-toy',
        );
      } else {
        filtered = filtered.filter(
          (item) => item.pack === this.selectedPack || item.isDisabled,
        );
      }
    }

    if (
      (this.type === 'equipment' ||
        this.type === 'toy' ||
        this.type === 'hard-toy') &&
      this.selectedSortMode === 'default' &&
      this.selectedItemCategory !== 'All'
    ) {
      filtered = filtered.filter(
        (item) => item.category === this.selectedItemCategory,
      );
    }

    if (
      this.selectedSortMode === 'trigger' &&
      this.supportsTriggerSort &&
      this.selectedTriggerCategory !== 'All'
    ) {
      filtered = filtered.filter(
        (item) => item.triggerCategory === this.selectedTriggerCategory,
      );
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.searchName.includes(query) ||
          item.searchDisplayName.includes(query),
      );
    }

    this.filteredItems = this.sortItemsForDisplay(filtered);
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

  selectItemCategory(category: string) {
    this.selectedItemCategory = category;
    this.filterItems();
  }

  setSortMode(mode: ItemSelectorSortMode) {
    this.selectedSortMode = mode;
    this.filterItems();
  }

  selectTriggerCategory(category: string) {
    this.selectedTriggerCategory = category;
    this.filterItems();
  }

  getVisibleCategory(item: IndexedSelectionItem): string {
    if (this.selectedSortMode === 'trigger' && this.supportsTriggerSort) {
      return item.triggerCategory;
    }
    return item.category ?? '';
  }

  shouldShowCategoryHeader(index: number, item: IndexedSelectionItem): boolean {
    if (index === 0) {
      return true;
    }
    return (
      this.getVisibleCategory(this.filteredItems[index - 1]) !==
      this.getVisibleCategory(item)
    );
  }

  getPackFilterIcon(pack: string): string | null {
    if (!pack || pack === 'All') {
      return null;
    }

    if (pack === 'Tokens') {
      return getPetIconPath('Bee');
    }

    if ((PACK_NAMES as readonly string[]).includes(pack)) {
      return getPackIconPath(pack);
    }

    if (this.customPacks && this.customPacks instanceof FormArray) {
      const customPacksArray = this.customPacks as FormArray;
      const matchingPack = customPacksArray.controls.find(
        (control) => control.get('name')?.value === pack && control.valid,
      );
      if (matchingPack) {
        const firstPet = this.getFirstCustomPackPet(matchingPack);
        if (firstPet) {
          return getPetIconPath(firstPet);
        }
      }
    }

    return getPackIconPath(pack);
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
      if (this.type === 'swallowed-pet') {
        this.select.emit({ name: item.name, level: this.selectedLevel });
      } else {
        this.select.emit(item.name);
      }
    } else if (this.type === 'ability') {
      this.select.emit({ name: item.name, level: this.selectedLevel });
    } else {
      this.select.emit(item.item);
    }
  }

  onCancel() {
    this.close.emit();
  }

  onOverlayClick(): void {
    if (this.isResizing || this.suppressOverlayClose) {
      this.suppressOverlayClose = false;
      return;
    }
    this.onCancel();
  }

  onResizePointerDown(event: PointerEvent): void {
    if (
      event.button !== 0 ||
      !this.selectionDialog?.nativeElement ||
      !this.isDesktopResizable()
    ) {
      return;
    }

    const handleElement = event.currentTarget;
    if (!(handleElement instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.suppressOverlayClose = true;
    this.resizePointerId = event.pointerId;
    this.resizeHandleElement = handleElement;
    this.resizeStartX = event.clientX;
    this.resizeStartWidth =
      this.selectionDialog.nativeElement.getBoundingClientRect().width;
    handleElement.setPointerCapture(event.pointerId);

    window.addEventListener('pointermove', this.boundResizePointerMove);
    window.addEventListener('pointerup', this.boundResizePointerUp);
    window.addEventListener('pointercancel', this.boundResizePointerUp);

    if (typeof document !== 'undefined') {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
    }
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

  private updateAvailableItemCategories(): void {
    if (
      this.type !== 'equipment' &&
      this.type !== 'toy' &&
      this.type !== 'hard-toy'
    ) {
      this.availableItemCategories = ['All'];
      this.selectedItemCategory = 'All';
      return;
    }

    const categories = Array.from(
      new Set(this.items.map((item) => item.category).filter(Boolean)),
    );

    categories.sort((a, b) => {
      const tierA = this.extractTierNumber(a);
      const tierB = this.extractTierNumber(b);
      if (tierA != null && tierB != null) {
        return tierA - tierB;
      }
      if (tierA != null) {
        return -1;
      }
      if (tierB != null) {
        return 1;
      }
      return a.localeCompare(b);
    });

    this.availableItemCategories = ['All', ...categories];
    if (!this.availableItemCategories.includes(this.selectedItemCategory)) {
      this.selectedItemCategory = 'All';
    }
  }

  private updateAvailableTriggerCategories(): void {
    if (!this.supportsTriggerSort) {
      this.triggerFilterEntries = [];
      this.selectedTriggerCategory = 'All';
      return;
    }

    this.triggerFilterEntries = getTriggerFilterEntries(this.items);
    const availableCategories = new Set<string>(['All']);
    this.triggerFilterEntries.forEach((entry) => {
      if (entry.type === 'single') {
        availableCategories.add(entry.category);
        return;
      }
      entry.categories.forEach((category) => availableCategories.add(category));
    });
    if (!availableCategories.has(this.selectedTriggerCategory)) {
      this.selectedTriggerCategory = 'All';
    }
  }

  /** Pack filter options for 'ability' mode */
  get abilityPackFilters(): string[] {
    if (this.type !== 'ability') return [];
    return ['All', ...PACK_NAMES, 'Tokens', 'Equipment', 'Toys'];
  }

  private extractTierNumber(category: string): number | null {
    const match = /^Tier\s+(\d+)$/i.exec(category);
    if (!match) {
      return null;
    }
    return Number(match[1]);
  }

  private clampLevel(value: unknown): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return 1;
    }
    return Math.max(1, Math.min(3, Math.trunc(parsed)));
  }

  private sortItemsForDisplay(
    items: IndexedSelectionItem[],
  ): IndexedSelectionItem[] {
    if (this.selectedSortMode !== 'trigger' || !this.supportsTriggerSort) {
      return filteredCopy(items);
    }

    return sortItemsByTrigger(items);
  }

  private onResizePointerMove(event: PointerEvent): void {
    if (!this.isResizing || this.resizePointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - this.resizeStartX;
    this.dialogWidthPx = this.clampDialogWidth(this.resizeStartWidth + deltaX);
  }

  private onResizePointerUp(event: PointerEvent): void {
    if (!this.isResizing || this.resizePointerId !== event.pointerId) {
      return;
    }

    if (
      this.resizeHandleElement?.hasPointerCapture(event.pointerId)
    ) {
      this.resizeHandleElement.releasePointerCapture(event.pointerId);
    }

    this.persistDialogWidth(this.dialogWidthPx);
    this.stopResizing();
    setTimeout(() => {
      this.suppressOverlayClose = false;
    }, 0);
  }

  private persistDialogWidth(width: number): void {
    if (!hasLocalStorage()) {
      return;
    }

    try {
      window.localStorage.setItem(
        ITEM_SELECTOR_WIDTH_STORAGE_KEY,
        String(this.clampDialogWidth(width)),
      );
    } catch {
      // Ignore storage write failures for this UI preference.
    }
  }

  private stopResizing(): void {
    this.isResizing = false;
    this.resizePointerId = null;
    this.resizeHandleElement = null;

    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.boundResizePointerMove);
      window.removeEventListener('pointerup', this.boundResizePointerUp);
      window.removeEventListener('pointercancel', this.boundResizePointerUp);
    }

    if (typeof document !== 'undefined') {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }

  private getInitialDialogWidth(): number {
    const fallbackWidth = this.clampDialogWidth(ITEM_SELECTOR_DEFAULT_WIDTH_PX);
    if (!hasLocalStorage()) {
      return fallbackWidth;
    }

    try {
      const rawValue = window.localStorage.getItem(
        ITEM_SELECTOR_WIDTH_STORAGE_KEY,
      );
      if (rawValue == null || rawValue === '') {
        return fallbackWidth;
      }

      const parsedWidth = Number(rawValue);
      if (!Number.isFinite(parsedWidth)) {
        return fallbackWidth;
      }

      return this.clampDialogWidth(parsedWidth);
    } catch {
      return fallbackWidth;
    }
  }

  private clampDialogWidth(width: number): number {
    const maxWidth = this.getMaxDialogWidth();
    const minWidth = Math.min(ITEM_SELECTOR_MIN_WIDTH_PX, maxWidth);
    return Math.max(minWidth, Math.min(Math.round(width), maxWidth));
  }

  private getMaxDialogWidth(): number {
    if (typeof window === 'undefined') {
      return ITEM_SELECTOR_DEFAULT_WIDTH_PX;
    }

    return Math.max(320, window.innerWidth - ITEM_SELECTOR_VIEWPORT_GUTTER_PX);
  }

  private isDesktopResizable(): boolean {
    return typeof window !== 'undefined' && window.innerWidth > 640;
  }
}

function filteredCopy(items: IndexedSelectionItem[]): IndexedSelectionItem[] {
  return [...items];
}

function hasLocalStorage(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  );
}
