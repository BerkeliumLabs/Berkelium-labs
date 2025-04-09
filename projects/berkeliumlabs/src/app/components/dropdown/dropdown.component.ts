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
  templateUrl: './dropdown.component.html',
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
  
  selectOption(option: BkDropdownOptions): void {
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