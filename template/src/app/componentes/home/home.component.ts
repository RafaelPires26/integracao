import { Component, OnInit                     } from '@angular/core';
import { CommonModule                          } from '@angular/common';
import { FontAwesomeModule                     } from '@fortawesome/angular-fontawesome';
import { NgxMaskDirective, NgxMaskPipe         } from 'ngx-mask';
import { CadastroComponent                     } from '../cadastro/cadastro.component';
import { HomeService                           } from '../../services/home.service';
import { faUserEdit, faPlusCircle, faUserTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector    : 'app-home',
  standalone  : true,
  imports     : [   FontAwesomeModule
                  , CadastroComponent
                  , CommonModule
                  , NgxMaskDirective
                  , NgxMaskPipe 
                ],
  templateUrl : './home.component.html',
  styleUrl    : './home.component.scss'
})

export class HomeComponent implements OnInit {

  // COL SIZES
  size12 = 'col-md-12 col-sm-12 col-lg-12 col-xs-12';
  size6  = 'col-md-6 col-sm-6 col-lg-6 col-xs-6';

  //ICONS
  faUserEdit   = faUserEdit;
  faPlusCircle = faPlusCircle;
  faUserTimes  = faUserTimes;
  
  arCliente       : any;
  arUf            : any;
  detalhesCliente : any;
  contentView     = 1;
  txAlert         = '';
  blRetorno       = false;

  constructor ( private service : HomeService ){ }

  ngOnInit() {
    this.getEstados();

    setTimeout(() => { this.getClientes(); }, 100);
  }

  viewCliente = async (idCliente: any, action: any) => {
    this.service.getCliente(idCliente).subscribe({
      next: (data) => {
        this.detalhesCliente = data;

        this.arUf.map( (uf: { sigla: any; id: any; nome: any; }) => {
          if (uf.id == this.detalhesCliente.DSUF) {
            this.detalhesCliente.ESTADO = uf.nome + ' - ' + uf.sigla;
          }
        });

        if (action == 1){
          this.editCliente(1);
        }

      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getClientes = async () => {
    this.service.getClienteAll().subscribe({
      next: (data) => {
        this.arCliente = data;

        this.arCliente.map( (cliente: any) => {
          this.arUf.map( (estado: any) =>{
            if (cliente.DSUF == estado.id){
              cliente.ESTADO = estado.nome + ' - ' + estado.sigla
            }
          });
        });
      },
      error: (error) => {
        console.log(error);
      }
    })
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

  editCliente(view: number){ 
    if (view == 2) this.detalhesCliente = {}
    this.contentView = 2; 
  }

  removerCliente = async (idCliente: any) => {
    this.service.removerCliente(idCliente).subscribe({
      next: (data) => {
        this.txAlert   = 'Cliente removido com sucesso!'
        this.blRetorno = true

        setTimeout(() => { location.reload();; }, 2000);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  mask(data: any, type: any){
    switch (type) {
      case "cpf":
        data = data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        break;
      case "tel":
        data = data.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        break;
      case "cep":
        data = data.replace(/(\d{5})(\d{3})/, '$1-$2');
        break;
      default:
        data
    }

    return data;
  }

  voltar() { this.contentView = 1;}
}