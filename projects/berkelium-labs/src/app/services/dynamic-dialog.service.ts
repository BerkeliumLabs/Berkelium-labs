import {
  ComponentRef,
  EventEmitter,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicDialogService {
  private dialogRef!: DynamicDialogRef;
  private componentRef: ComponentRef<any> | null = null;
  private viewContainerRef = inject(ViewContainerRef);

  constructor(private injector: Injector) {}

  open<T>(
    component: Type<T>,
    dialogData?: DynamicDialogData,
    options?: DynamicDialogOptions
  ): DynamicDialogRef {
    this.dialogRef = DynamicDialogRef.create(options);
    document.body.appendChild(this.dialogRef);

    const injector = Injector.create({
      providers: [
        { provide: DynamicDialogRef, useValue: this.dialogRef },
        ...(dialogData
          ? [{ provide: DYNAMIC_DIALOG_DATA, useValue: dialogData }]
          : []),
      ],
      parent: this.injector,
    });

    this.componentRef = this.viewContainerRef.createComponent(component, {
      injector,
    });

    this.dialogRef.innerHTML = '';
    this.dialogRef.appendChild(
      this.componentRef.location.nativeElement as HTMLElement
    );

    this.dialogRef.showModal();

    this.dialogRef.addEventListener('close', () => {
      this.dialogRef.onClose.emit(this.dialogRef.returnValue);
      this.close();
    });

    return this.dialogRef;
  }

  private close(): void {
    if (this.dialogRef && this.componentRef) {
      this.componentRef.destroy();
      this.dialogRef.close();
      this.dialogRef.remove();
      this.componentRef = null;
      this.viewContainerRef.clear();
    }
  }
}

export class DynamicDialogRef extends HTMLDialogElement {
  public onClose: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  static create(options?: DynamicDialogOptions): DynamicDialogRef {
    const dialogRef = document.createElement('dialog') as DynamicDialogRef;

    if (options?.class) {
      dialogRef.classList.add(options.class);
    }
    if (options?.width) {
      dialogRef.style.width = options.width;
    }
    if (options?.height) {
      dialogRef.style.height = options.height;
    }
    dialogRef.onClose = new EventEmitter();
    return dialogRef;
  }
}

export interface DynamicDialogData {
  [key: string]: any;
}

export const DYNAMIC_DIALOG_DATA = new InjectionToken<DynamicDialogData>(
  'DYNAMIC_DIALOG_DATA'
);

export interface DynamicDialogOptions {
  class?: string;
  width?: string;
  height?: string;
}
