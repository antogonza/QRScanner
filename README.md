# QRScanner
## Escáner de códigos QR desarrollada con Ionic y Angular

Aplicación móvil lectora de códigos QR. La aplicación lee los códigos y los abre en función del contenido de éste. Si el código tiene un enlace a un sitio web, abre el navegador por defecto. Si es un código de unas coordenadas, genera un mapa 3D con un marcador señalando dichas coordenadas. 
Todos los escaneos se almacenan en el Local Storage del dispositivo. Gracias a esto, tenemos disponible un historial de escaneos, por lo que podremos acceder rápidamente a todos los códigos que alguna vez hayamos escaneado. Además, la aplicación tiene una función con la que podremos crear un archivo CSV con el historial de escaneos y enviarlo y compartirlo en las redes sociales.


Esta aplicación hace uso de varios plugins nativos de Ionic:
- Barcode Scanner: Plugin encargado de escanear los códigos QR. También es posible escanear códigos de barra.
- File: Plugin para generar el archivo CSV.
- In App Browser: Plugin para abrir un enlace en el navegador por defecto
- Social Sharing: Plugin encargado de compartir el archivo en redes sociales

