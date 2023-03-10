import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaisesService } from '../../services/paises.service';

import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})

export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  constructor(private fb: FormBuilder,
              private paisesServices: PaisesService) {

  }

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
        }),
        switchMap(region => this.paisesServices.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
      })
    
    /* TO DO */
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        switchMap(codigo => this.paisesServices.getPaisPorCodigo(codigo))
      )
      .subscribe(pais => {
        (pais) ? this.fronteras = pais[0]?.borders : this.fronteras = [];
      })
    
    /*
    this.miFormulario.get('region')?.valueChanges
      .subscribe( region => {
        console.log(region);
        this.paisesServices.getPaisesPorRegion(region)
          .subscribe(paises => {
            console.log(paises);
            this.paises = paises;
          })
      })
    */
  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}