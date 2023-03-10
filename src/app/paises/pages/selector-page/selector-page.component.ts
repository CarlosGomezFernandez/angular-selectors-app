import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})

export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]]
  })

  regiones: string[] = [];

  constructor(private fb: FormBuilder,
              private paisesServices: PaisesService) {

  }

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;
  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}