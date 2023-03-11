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
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesServices: PaisesService) {

  }

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesServices.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      })
    
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesServices.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesServices.getPaisesPorCodigos(pais ? pais![0]?.borders : []))
      )
      .subscribe(paises => {
        console.log(paises.values);
        this.fronteras = paises;
        this.cargando = false;
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