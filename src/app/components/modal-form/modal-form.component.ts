import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent implements OnInit {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  constructor() {}

  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('New filter', Validators.required),
      description: new FormControl('', Validators.required),
      filterMode: new FormControl('pass-all', Validators.required),
      ext: new FormArray([])
    });
    this.addAndChangeCriteriesFields();
  }

  addAndChangeCriteriesFields(ctrType = 'mac', idx = 0, isNew = true) {
    let criteriesGroup: any;
    switch (ctrType) {
      case 'mac':
        criteriesGroup = new FormGroup({
          criteriaType: new FormControl('mac'),
          srcMac: new FormControl('00:00:00:00:00:00', Validators.required),
          dstMac: new FormControl('00:00:00:00:00:00', Validators.required),
          ethernetType: new FormControl('0', Validators.required),
          vlanId: new FormControl('0', Validators.required),
          ipv6: new FormControl(false)
        });
        break;
      case 'ip4':
        criteriesGroup = new FormGroup({
          criteriaType: new FormControl('ip4'),
          srcMac: new FormControl('22:22:00:00:00:00'),
          dstMac: new FormControl('00:00:00:00:00:00'),
          ethernetType: new FormControl('0'),
          vlanId: new FormControl('0')
        });
        break;
      case 'udb':
        criteriesGroup = new FormGroup({
          criteriaType: new FormControl('udb'),
          packetType: new FormControl('user-def'),
          ofsetBase: new FormControl('l2'),
          ofsets: new FormArray([
            new FormGroup({
              position: new FormControl('0', Validators.required),
              value: new FormControl('0', Validators.required)
            })
          ])
        });
        break;
    }

    if (isNew) {
      (this.form.get('ext') as FormArray).push(criteriesGroup);
      return;
    }

    (this.form.get('ext') as FormArray).controls[idx] = criteriesGroup;
    // (this.form.get('ext') as FormArray).updateValueAndValidity();
  }

  get extCriteries() {
    return this.form.get('ext') as FormArray;
  }

  getUdbOptions(idx: any) {
    return (this.form.get('ext') as FormArray).controls[idx].get(
      'ofsets'
    ) as FormArray;
  }

  addUdbOptions(idx: any) {
    const filed = new FormGroup({
      position: new FormControl('0', Validators.required),
      value: new FormControl('0', Validators.required)
    });
    this.getUdbOptions(idx).push(filed);
  }

  removeUdbOptions(idx: any, udbOptionIdx: any) {
    if (this.getUdbOptions(idx).length <= 1) {
      return;
    }
    this.getUdbOptions(idx).removeAt(udbOptionIdx);
  }

  resetUdbOptions(idx: any, udbOptionIdx: any) {
    this.getUdbOptions(idx).controls[udbOptionIdx].setValue({
      position: 0,
      value: 0
    });
  }

  submit() {
    (this.form.get('ext') as FormArray).updateValueAndValidity();
    console.log(this.form.value);
  }

  clseTab(idx: number) {
    if ((this.form.get('ext') as FormArray).controls.length < 2) {
      return;
    }
    (this.form.get('ext') as FormArray).removeAt(idx);
  }

  close() {
    this.closeModal.emit();
  }
}
