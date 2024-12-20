import { Component, Input, OnInit                                } from '@angular/core';
import { CommonModule                                            } from '@angular/common';
import { FontAwesomeModule                                       } from '@fortawesome/angular-fontawesome';
import { HomeComponent                                           } from '../home/home.component'
import { HomeService                                             } from '../../services/home.service';
import { NgxMaskDirective, NgxMaskPipe                           } from 'ngx-mask';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { faPaperPlane, faBackwardStep                            } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector    : 'app-cadastro',
  standalone  : true,
  imports     : [   FontAwesomeModule
                  , ReactiveFormsModule
                  , CommonModule
                  , HomeComponent
                  , NgxMaskDirective
                  , NgxMaskPipe 
                ],
  templateUrl : './cadastro.component.html',
  styleUrl    : './cadastro.component.scss'
})

export class CadastroComponent implements OnInit {
  
  constructor ( 
    private service : HomeService,
    private form    : FormBuilder
  ) { 

    this.objForm = this.form.group({
      NMCLIENT : ['', [Validators.required]] ,
      CPRESPON : ['', [Validators.required]] ,
      DTNASCIM : ['', [Validators.required]] ,
      DSCEP    : ['', [Validators.required]] ,
      DSENDERE : ['', [Validators.required]] ,
      DSNUMERO : ['', [Validators.required]] ,
      DSBAIRRO : ['', [Validators.required]] ,
      DSUF     : ['', [Validators.required]] ,
      NMCIDADE : ['', [Validators.required]] ,
      NRTELEFO : [''] ,
      DSEMAIL  : [''] ,
      DSCOMPLE : ['']
    });
  }

  // COL SIZES  
  size12 = 'col-md-12 col-sm-12 col-lg-12 col-xs-12';
  sizeInputs = 'col-md-4 col-sm-12 col-lg-4 col-xs-12'

  // ICONS
  faPaperPlane   = faPaperPlane;
  faBackwardStep = faBackwardStep;

  public objForm: FormGroup;

  index        : any;
  arUf         : any;
  optionUF     : any;
  txAlert      = '';
  blRetorno    = false;
  @Input() objCliente: any;

  ngOnInit(){
    this.objForm.reset();
    this.getEstados();

    setTimeout(() => { this.getForm(); }, 100);
  }

  salvarCliente = async (objCliente: any) => {
    if (this.objForm.valid){
      let objData = Object.assign({}, this.objForm.value);
      
      if (objCliente && objCliente.id){
        objData.id = objCliente.id;

        this.service.atualizarCliente(objData).subscribe({
          next: (data) => {
            this.txAlert   = 'Cliente atualizado com sucesso!';
            this.blRetorno = true;
          },
          error: (error) => {
            console.log(error);
          }
        });
  
      } else {
        this.service.salvarCliente(objData).subscribe({
          next: (data) => {
            this.txAlert = 'Cliente cadastrado com sucesso!';
            this.blRetorno = true;
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    } else {
      this.txAlert   = 'Campos obrigatórios não preenchidos!'
      this.blRetorno = false;
    }
  }

  getCep = async () => {
    if (this.objForm.controls['DSCEP'].value && this.objForm.controls['DSCEP'].value.length == 8){

      this.service.getCep(this.objForm.controls['DSCEP'].value).subscribe({
        next: (data: any) => {

          if (data?.erro || !data){
            this.txAlert   = 'CEP não reconhecido no sistema!'
            this.blRetorno = false;
          } else{
            this.objForm.controls['DSENDERE'].setValue( data.logradouro   ? data.logradouro  : this.objForm.controls['DSENDERE'].value );
            this.objForm.controls['DSCOMPLE'].setValue( data.complemento  ? data.complemento : this.objForm.controls['DSCOMPLE'].value );
            this.objForm.controls['DSBAIRRO'].setValue( data.bairro       ? data.bairro      : this.objForm.controls['DSBAIRRO'].value );
            this.objForm.controls['NMCIDADE'].setValue( data.localidade   ? data.localidade  : this.objForm.controls['NMCIDADE'].value );

            this.arUf.map( (uf: { sigla: any; id: any; nome: any; }) => {
              if (uf.sigla == data.uf) {
                this.objForm.controls['DSUF'].setValue(uf.id);
                this.optionUF = { id: uf.id, text: uf.sigla, nome: uf.nome}
              }
            });
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getForm(){
    if (this.objCliente && this.objCliente.id){
      this.objForm.controls['NMCLIENT'].setValue(this.objCliente.NMCLIENT);
      this.objForm.controls['DTNASCIM'].setValue(this.objCliente.DTNASCIM);
      this.objForm.controls['CPRESPON'].setValue(this.objCliente.CPRESPON);
      this.objForm.controls['DSENDERE'].setValue(this.objCliente.DSENDERE);
      this.objForm.controls['DSBAIRRO'].setValue(this.objCliente.DSBAIRRO);
      this.objForm.controls['NMCIDADE'].setValue(this.objCliente.NMCIDADE);
      this.objForm.controls['DSCOMPLE'].setValue(this.objCliente.DSCOMPLE);
      this.objForm.controls['DSNUMERO'].setValue(this.objCliente.DSNUMERO);
      this.objForm.controls['DTNASCIM'].setValue(this.objCliente.DTNASCIM);
      this.objForm.controls['NRTELEFO'].setValue(this.objCliente.NRTELEFO);
      this.objForm.controls['DSEMAIL'].setValue(this.objCliente.DSEMAIL);
      this.objForm.controls['DSCEP'].setValue(this.objCliente.DSCEP);

      this.arUf.map( (uf: { sigla: any; id: any; nome: any; }) => {
        if (uf.id == this.objCliente.DSUF) {
          this.objForm.controls['DSUF'].setValue(uf.id);
          this.optionUF = { id: uf.id, text: uf.sigla, nome: uf.nome}
        }
      });
    }
  }

  getEstados = async () => {
    this.service.getEstados().subscribe({
      next: (data) => {
        this.arUf = data;
        this.arUf = this.arUf[0];
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  voltar(blValida: number) { 
    if(this.blRetorno || blValida == 1) location.reload(); 
  }

}
