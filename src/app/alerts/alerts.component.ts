import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Alert } from '../_models/alert.model';
import { AuthUser } from '../_models/auth-user.model';
import { AlertsService } from '../_services/alerts.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit, OnDestroy {

  collapsed = true;
  alerts: Alert[] = [];
  authUser: AuthUser = null;
  userSub: Subscription;

  sendAlertForm: FormGroup;
  isSubmited: boolean;

  constructor(
    private alertService: AlertsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.userSub = this.authService.authUser.subscribe(user => {
      this.authUser = user;
    })

    this.createForm();
    this.getAlerts();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  createForm() {
    this.sendAlertForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() {
    return this.sendAlertForm.controls;
  }

  getAlerts() {
    this.alertService.getAlerts().subscribe(alerts => {
      this.alerts = alerts;
    })
  }

  onDeleteAlert(id) {
    this.alertService.deleteAlert(id).subscribe(res => {
      // console.log(res);
      this.getAlerts();
    });
  }

  onSendAlert({ value, valid }: { value: any, valid: boolean }) {
    this.isSubmited = true;
    if (!valid) return;

    this.alertService.sendAlert(value.title, value.message).subscribe(res => {
      // console.log(res);
      this.getAlerts();
      this.isSubmited = false;
      this.sendAlertForm.reset();
    });
  }

  onLogout() {
    this.authService.logout();
  }

}
