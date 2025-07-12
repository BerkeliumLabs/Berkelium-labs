import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'berkeliumlabs-lab',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './lab.html',
  styleUrl: './lab.scss',
})
export class Lab {}
