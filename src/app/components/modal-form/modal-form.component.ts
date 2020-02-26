import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent implements OnInit {
  @Input() formFromApp: FormGroup;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() outForm: EventEmitter<FormGroup> = new EventEmitter();

  constructor() {}

  form: FormGroup;

  ngOnInit() {
    if (this.formFromApp) {
      this.form = this.formFromApp;
      return;
    }

    this.form = new FormGroup({
      name: new FormControl('New filter', Validators.required),
      description: new FormControl('', Validators.required),
      filterMode: new FormControl('pass-all', Validators.required),
      ext: new FormArray([])
    });
    this.addAndChangeCriteriesFields();
    this.form.valueChanges.subscribe(snap => {
      this.tolocal();
    });
  }

  addAndChangeCriteriesFields(ctrType = 'mac', idx = 0, isNew = true) {
    let criteriesGroup: FormGroup;
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
      case 'ip4':
        criteriesGroup = new FormGroup({
          criteriaType: new FormControl('ip4'),
          packetType: new FormControl('icmp', Validators.required),
          dstIp: new FormControl('0.0.0.0', Validators.required),
          dstMask: new FormControl('0.0.0.0', Validators.required),
          ipProtocol: new FormControl('0x0', Validators.required),
          srcIp: new FormControl('0.0.0.0', Validators.required),
          scrMask: new FormControl('0.0.0.0', Validators.required),
          sourceMiniPort: new FormControl('0', Validators.required),
          sourceMaxPort: new FormControl('65535', Validators.required),
          destinationMiniPort: new FormControl('0', Validators.required),
          destinationMaxPort: new FormControl('65535', Validators.required),
          vlanId: new FormControl('0', Validators.required),
          tcpControl: new FormGroup({
            urg: new FormControl(true),
            ack: new FormControl(false),
            psh: new FormControl(false),
            rst: new FormControl(false),
            syn: new FormControl(false),
            fin: new FormControl(false)
          }),
          ip: new FormControl('none'),
          version: new FormControl('v1')
        });
        criteriesGroup.controls.tcpControl.disable();
        break;
      case 'ip6':
        criteriesGroup = new FormGroup({
          criteriaType: new FormControl('ip6'),
          packetType: new FormControl('tcp', Validators.required),
          vlanId: new FormControl('0', Validators.required),
          dscp: new FormControl('none'),
          tos: new FormControl('none'),
          flowLabel: new FormControl('0', Validators.required),
          srcIp: new FormControl(
            '0000:0000:0000:0000:0000:0000:0000',
            Validators.required
          ),
          scrMask: new FormControl(
            '0000:0000:0000:0000:0000:0000:0000',
            Validators.required
          ),
          dstIp: new FormControl(
            '0000:0000:0000:0000:0000:0000:0000',
            Validators.required
          ),
          dstMask: new FormControl(
            '0000:0000:0000:0000:0000:0000:0000',
            Validators.required
          ),
          sourceMiniPort: new FormControl('0', Validators.required),
          sourceMaxPort: new FormControl('65535', Validators.required),
          destinationMiniPort: new FormControl('0', Validators.required),
          destinationMaxPort: new FormControl('65535', Validators.required),
          tcpControl: new FormGroup({
            urg: new FormControl(false),
            ack: new FormControl(false),
            psh: new FormControl(false),
            rst: new FormControl(false),
            syn: new FormControl(false),
            fin: new FormControl(false)
          })
        });
        break;
    }

    if (isNew) {
      this.extCriteries.push(criteriesGroup);
      return;
    }

    this.extCriteries.controls[idx] = criteriesGroup;
  }

  toogleExt() {
    if (
      this.form.value.filterMode === 'pass-all' ||
      this.form.value.filterMode === 'deny-all'
    ) {
      this.extCriteries.disable();
    } else {
      this.extCriteries.enable();
    }
  }

  get extCriteries() {
    return this.form.get('ext') as FormArray;
  }

  getUdbOptions(idx: number) {
    return this.extCriteries.controls[idx].get('ofsets') as FormArray;
  }

  addUdbOptions(idx: number) {
    const filed = new FormGroup({
      position: new FormControl('0', Validators.required),
      value: new FormControl('0', Validators.required)
    });
    this.getUdbOptions(idx).push(filed);
  }

  removeUdbOptions(idx: number, udbOptionIdx: number) {
    if (this.getUdbOptions(idx).length <= 1) {
      return;
    }
    this.getUdbOptions(idx).removeAt(udbOptionIdx);
  }

  resetUdbOptions(idx: number, udbOptionIdx: number) {
    this.getUdbOptions(idx).controls[udbOptionIdx].setValue({
      position: 0,
      value: 0
    });
  }

  submit() {
    this.toogleExt();
    this.extCriteries.updateValueAndValidity();
    console.log(this.form.value);
  }

  clseTab(idx: number) {
    if (this.extCriteries.controls.length < 2) {
      return;
    }
    this.extCriteries.removeAt(idx);
  }

  close() {
    this.closeModal.emit();
  }

  showTcpControl(value: string, idx: number) {
    value === 'tcp'
      ? this.extCriteries.controls[idx].get('tcpControl').enable()
      : this.extCriteries.controls[idx].get('tcpControl').disable();
  }

  tolocal() {
    this.outForm.emit(this.form);
  }
}
