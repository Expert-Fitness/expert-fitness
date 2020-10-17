import { AuthService } from '../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { TicketService } from '../../_services/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  ticketForm: FormGroup;
  id = null;
  user = '';

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private ticket: TicketService,
    private navParam: NavParams,
    public auth: AuthService
  ) {

    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      status: 0
    });
  }

  ngOnInit() {

    this.id = this.navParam.get('id');
    if (this.id) {
      this.ticket.getTicket(this.id).subscribe(ticket => {
        this.ticketForm.patchValue({
          // tslint:disable-next-line: no-string-literal
          title: ticket['title'],
          desc: ticket.desc,
          status: ticket.status
        });

        // this.ticketForm.controls['title'].disable();
        // this.ticketForm.controls['desc'].disable();

        this.ticket.getUser(ticket[creator]).subscribe(user => {
          this.user = user.email;
        });
      });
    }
  }

  close() {
    this.modalController.dismiss();
  }

  async saveOrUpdate() {
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();

    this.ticket.createOrUpdateTicket(this.id, this.ticketForm.value).then(
      () => {
        loading.dismiss();
        this.close();
      },
      err => {
        loading.dismiss();
      }
    );
  }

  deleteTicket() {
    this.ticket.deleteTicket(this.id).then(() => {
      this.modalController.dismiss();
    });
  }
}
