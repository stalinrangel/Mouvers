import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './clientes-ver.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ClientesVerComponent {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      Nombre: {
        title: 'Nombre',
        type: 'string',
      },
      Direccion: {
        title: 'Dirección',
        type: 'string',
      },
      Telefono: {
        title: 'Telefono',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      Estado: {
        title: 'Estado',
        type: 'string',
      },
       Ciudad: {
        title: 'Ciudad',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  public data:any;
  public productList:any;

  selectedCliente: any;
  clienteAEliminar: any;
  eliminar_id: any;
  eliminar_user: any;

  public loading = false;
  public editando = false;
  public mostrar = true;

  public alerta = false;
  public alerta_boton = false;
  public alerta_tipo: any; //success info warning danger  
  public alerta_msg: any;

  constructor(private service: SmartTableService, private http: HttpClient,private router: Router, private rutaService: RutaBaseService) {
    const data = this.service.getData();
    this.source.load(data);
  }

  ngOnInit() {
    
    this.loading = true;
    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/usuarios?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data=data;

           this.loading = false;

           
         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);

           this.loading = false;

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);
                //ir a login

                this.alerta_tipo = 'warning';
                this.alerta_msg = msg.error.error;
                this.alerta_boton = true;
                this.mostrar = false;
            }
            //sin usuarios
            else if(msg.status == 404){ 
                //alert(msg.error.error);

                this.alerta_tipo = 'info';
                this.alerta_msg = msg.error.error;
                this.alerta = true;
                setTimeout(()=>{this.alerta = false;},4000);
            }
            

         }
       );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
