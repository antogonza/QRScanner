/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';

import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Injectable({
  providedIn: 'root',
})
export class DataLocalService {
  guardados: Registro[] = [];
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private navController: NavController,
    private iab: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer,
    private socialSharing: SocialSharing
  ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.getRegistros();
  }

  async saveRegistro(registro: Registro) {
    this._storage.set('registros', this.guardados);
  }

  guardarRegistro(format: string, text: string) {
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    this.saveRegistro(nuevoRegistro);
    console.log(this.guardados);
    this.abrirRegistro(nuevoRegistro);
  }

  async getRegistros() {
    this.guardados = (await this._storage.get('registros')) || [];
  }

  abrirRegistro(registro: Registro) {
    this.navController.navigateForward('/tabs/tab2');

    switch (registro.type) {
      case 'http':
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navController.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }
  }

  enviarCorreo() {
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.guardados.forEach((registro) => {
      const linea = `${registro.type}, ${registro.format}, ${
        registro.created
      }, ${registro.text.replace(',', ' ')}\n`;
      arrTemp.push(linea);
    });

    console.log(arrTemp.join(''));
    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string) {
    this.file
      .checkFile(this.file.dataDirectory, 'registros.csv')
      .then((existe) => {
        console.log('Existe archivo' + existe);
        return this.escribirEnArchivo(text);
      })
      .catch((err) => {
        console.log('No existe archivo' + err);
        return this.file
          .createFile(this.file.dataDirectory, 'registros.csv', false)
          .then((creado) => {
            console.log('Creado archivo 1');
            this.escribirEnArchivo(text);
          })
          .catch((err2) => console.log('No se pudo crear el archivo' + err2));
      });
  }

  async escribirEnArchivo(text: string) {
    console.log('Escribiendo en archivo');
    await this.file.writeExistingFile(
      this.file.dataDirectory,
      'registros.csv',
      text
    );

    const archivo = `${this.file.dataDirectory}registros.csv`;

    console.log('Archivo creado' + archivo);

    const email = {
      to: 'antogonzarodri1@gmail.com',
      attachments: [archivo],
      subject: 'Backup de escaneos',
      body: 'Aquí están los backups de los escaneos. <strong>QRScanner!</strong>',
      isHtml: true,
    };

    console.log(`Enviando correo ${JSON.stringify(email)}`);

    this.socialSharing.share(
      'Estos son todos los escaneos que he realizado con la app QRScanner!',
      'Backup',
      archivo
    );

    // Send a text message using default options
    // No funciona en mi dispositivo
    // this.emailComposer.open(email);
  }
}
