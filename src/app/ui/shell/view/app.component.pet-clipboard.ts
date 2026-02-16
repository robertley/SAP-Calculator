import { FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { PetSelectorComponent } from 'app/ui/components/pet-selector/pet-selector.component';

export interface AppPetClipboardContext {
  api: boolean;
  formGroup: FormGroup;
  player: Player;
  opponent: Player;
  petSelectors: { toArray?: () => PetSelectorComponent[] } | null | undefined;
  activePetSlot: { side: 'player' | 'opponent'; index: number } | null;
  petClipboard: Record<string, unknown> | null;
  setStatus: (message: string, tone?: 'success' | 'error') => void;
}

export function handlePetSlotClipboardShortcuts(
  ctx: AppPetClipboardContext,
  event: KeyboardEvent,
): void {
  if (ctx.api || !ctx.formGroup) {
    return;
  }
  if (!(event.ctrlKey || event.metaKey) || event.altKey) {
    return;
  }
  if (isEditableTarget(event.target)) {
    return;
  }

  const key = event.key.toLowerCase();
  if (key === 'c') {
    if (copyActivePet(ctx, false)) {
      event.preventDefault();
    }
    return;
  }
  if (key === 'x') {
    if (copyActivePet(ctx, true)) {
      event.preventDefault();
    }
    return;
  }
  if (key === 'v') {
    if (pasteToActivePet(ctx)) {
      event.preventDefault();
    }
  }
}

function copyActivePet(ctx: AppPetClipboardContext, cut: boolean): boolean {
  if (!ctx.activePetSlot) {
    ctx.setStatus('Select a pet slot first.', 'error');
    return false;
  }

  const selector = findPetSelector(
    ctx,
    ctx.activePetSlot.side,
    ctx.activePetSlot.index,
  );
  if (!selector) {
    ctx.setStatus('Could not access selected pet slot.', 'error');
    return false;
  }

  const sourceValue = selector.formGroup?.getRawValue?.() as
    | Record<string, unknown>
    | null
    | undefined;
  if (!sourceValue?.name) {
    ctx.setStatus('Selected slot is empty.', 'error');
    return false;
  }

  ctx.petClipboard = cloneRecord(sourceValue);

  if (cut) {
    selector.removePet();
    ctx.setStatus('Pet cut.', 'success');
  } else {
    ctx.setStatus('Pet copied.', 'success');
  }
  return true;
}

function pasteToActivePet(ctx: AppPetClipboardContext): boolean {
  if (!ctx.activePetSlot) {
    ctx.setStatus('Select a pet slot first.', 'error');
    return false;
  }
  if (!ctx.petClipboard?.name) {
    ctx.setStatus('Nothing copied yet.', 'error');
    return false;
  }

  const selector = findPetSelector(
    ctx,
    ctx.activePetSlot.side,
    ctx.activePetSlot.index,
  );
  if (!selector) {
    ctx.setStatus('Could not access selected pet slot.', 'error');
    return false;
  }

  const payload = cloneRecord(ctx.petClipboard);
  selector.removePet();
  for (const [key, value] of Object.entries(payload)) {
    const control = selector.formGroup?.get(key);
    if (control) {
      control.setValue(value, { emitEvent: false });
    }
  }
  selector.substitutePet(false);
  selector.fixLoadEquipment();
  ctx.setStatus('Pet pasted.', 'success');
  return true;
}

function findPetSelector(
  ctx: AppPetClipboardContext,
  side: 'player' | 'opponent',
  index: number,
): PetSelectorComponent | null {
  const targetPlayer = side === 'player' ? ctx.player : ctx.opponent;
  return (
    ctx.petSelectors
      ?.toArray?.()
      ?.find(
        (selector) =>
          selector.player === targetPlayer && selector.index === index,
      ) ?? null
  );
}

function cloneRecord(value: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function isEditableTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }
  if (element.isContentEditable) {
    return true;
  }
  const tagName = element.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
}
