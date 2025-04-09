// custom-select.component.ts
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'berkeliumlabs-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full">
      <!-- Selected Value Display -->
      <div 
        #selectTrigger
        class="flex items-center justify-between w-full px-4 py-2 bg-white border rounded-md shadow-sm cursor-pointer hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        [class.border-gray-300]="!disabled"
        [class.border-gray-200]="disabled"
        [class.bg-gray-50]="disabled"
        [class.cursor-not-allowed]="disabled"
        (click)="togglePopover()"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="'popover-' + id"
        [attr.aria-disabled]="disabled"
        role="combobox">
        <span class="block truncate" [class.text-gray-500]="disabled">
          {{ selectedValue ? selectedValue.label : placeholder }}
        </span>
        <span class="material-icons" [class.text-gray-400]="!disabled" [class.text-gray-300]="disabled">
          {{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
        </span>
      </div>

      <!-- Popover Dropdown -->
      <div
        #popoverElement
        id="popover-{{ id }}"
        popover
        [attr.anchor]="selectTrigger"
        class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg"
        [class.hidden]="!isOpen">
        
        <!-- Search Box -->
        <div class="sticky top-0 p-2 bg-white border-b border-gray-200">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span class="material-icons text-gray-400 text-sm">search</span>
            </span>
            <input
              type="text"
              class="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search options..."
              [(ngModel)]="searchTerm"
              (input)="filterOptions()"
              (click)="$event.stopPropagation()"
              [attr.aria-label]="'Search ' + placeholder">
          </div>
        </div>
        
        <!-- Options List -->
        <div class="max-h-60 overflow-auto py-1">
          <div
            *ngFor="let option of filteredOptions"
            class="px-4 py-2 cursor-pointer hover:bg-indigo-100"
            [class.bg-indigo-100]="isSelected(option)"
            (click)="BkDropdownOptions(option)"
            [attr.aria-selected]="isSelected(option)">
            {{ option.label }}
          </div>
          <div *ngIf="filteredOptions.length === 0" class="px-4 py-2 text-gray-500 italic">
            No options found
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  @Input() options: BkDropdownOptions[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() id: string = 'custom-select';
  
  @Output() selectionChange = new EventEmitter<BkDropdownOptions>();
  
  @ViewChild('popoverElement') popoverElement!: ElementRef;
  @ViewChild('selectTrigger') selectTrigger!: ElementRef;
  
  selectedValue: BkDropdownOptions | null = null;
  filteredOptions: BkDropdownOptions[] = [];
  searchTerm: string = '';
  isOpen: boolean = false;
  disabled: boolean = false;
  
  // ControlValueAccessor methods
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  
  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string | number | null): void {
    if (value === null || value === undefined) {
      this.selectedValue = null;
      return;
    }
    
    const found = this.options.find(opt => opt.id === value);
    if (found) {
      this.selectedValue = found;
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled && this.isOpen) {
      this.closePopover();
    }
  }
  
  togglePopover(): void {
    if (this.disabled) return;
    
    if (this.isOpen) {
      this.closePopover();
    } else {
      this.openPopover();
    }
    
    this.onTouched();
  }
  
  openPopover(): void {
    if (!this.isOpen && !this.disabled) {
      this.popoverElement.nativeElement.showPopover();
      this.isOpen = true;
      // Reset search when opening
      this.searchTerm = '';
      this.filterOptions();
    }
  }
  
  closePopover(): void {
    if (this.isOpen) {
      this.popoverElement.nativeElement.hidePopover();
      this.isOpen = false;
    }
  }
  
  BkDropdownOptions(option: BkDropdownOptions): void {
    this.selectedValue = option;
    this.onChange(option.id); // Notify form about value change
    this.onTouched(); // Mark as touched
    this.selectionChange.emit(option); // Emit for component users
    this.closePopover();
  }
  
  isSelected(option: BkDropdownOptions): boolean {
    return this.selectedValue?.id === option.id;
  }
  
  filterOptions(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredOptions = this.options.filter(
        option => option.label.toLowerCase().includes(term)
      );
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Close popover when clicking outside component
    const clickedElement = event.target as HTMLElement;
    const insideSelect = this.selectTrigger.nativeElement.contains(clickedElement);
    const insidePopover = this.popoverElement.nativeElement.contains(clickedElement);
    
    if (!insideSelect && !insidePopover && this.isOpen) {
      this.closePopover();
      this.onTouched(); // Mark as touched when clicking outside
    }
  }
}