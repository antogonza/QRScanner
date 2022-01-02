import { Component } from '@angular/core';

import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  swipeOpts = {
    allowSlidePrev: false,
    allowSlideNext: false,
  };

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocalService: DataLocalService
  ) {}

  ionViewWillEnter() {
    this.scan();
  }

  scanTest() {
    this.dataLocalService.guardarRegistro('QRCode', 'https://www.google.com');
  }

  scan() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        console.log('Barcode data', barcodeData);
        if (!barcodeData.cancelled) {
          this.dataLocalService.guardarRegistro(
            barcodeData.format,
            barcodeData.text
          );
        }
      })
      .catch((err) => {
        console.log('Error', err);
        this.dataLocalService.guardarRegistro(
          'QRCode',
          'https://www.google.com'
        );
      });
  }
}
