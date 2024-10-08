import config from "./config/config.js";
import readline from "readline";
import { connDB } from "./connDB.js";
import { productsModel } from "./dao/models/productsModel.js";

let products = [
  {
    title: "Televisor Samsung",
    description: "Televisor de 20 pulgadas",
    code: "TV001",
    price: 450,
    status: true,
    stock: 25,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto1.jpg"],
  },
  {
    title: "Refrigerador LG",
    description: "Refrigerador de 300 litros",
    code: "RF001",
    price: 850,
    status: true,
    stock: 15,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto2.jpg"],
  },
  {
    title: "Aspiradora Dyson",
    description: "Aspiradora inalámbrica V10",
    code: "AP001",
    price: 600,
    status: true,
    stock: 30,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto3.jpg"],
  },
  {
    title: "Microondas Panasonic",
    description: "Microondas de 1000W",
    code: "MC001",
    price: 120,
    status: true,
    stock: 40,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto4.jpg"],
  },
  {
    title: "Lavadora Samsung",
    description: "Lavadora de 8kg",
    code: "LW001",
    price: 700,
    status: true,
    stock: 20,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto5.jpg"],
  },
  {
    title: "Secadora LG",
    description: "Secadora de 10kg",
    code: "SD001",
    price: 650,
    status: true,
    stock: 10,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto6.jpg"],
  },
  {
    title: "Cafetera Nespresso",
    description: "Cafetera de cápsulas",
    code: "CF001",
    price: 150,
    status: true,
    stock: 35,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto7.jpg"],
  },
  {
    title: "Horno Eléctrico Oster",
    description: "Horno eléctrico de 45 litros",
    code: "HE001",
    price: 200,
    status: true,
    stock: 18,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto8.jpg"],
  },
  {
    title: "Ventilador Philips",
    description: "Ventilador de pie de 16 pulgadas",
    code: "VT001",
    price: 75,
    status: true,
    stock: 50,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto9.jpg"],
  },
  {
    title: "Plancha Philips",
    description: "Plancha de vapor de 2000W",
    code: "PL001",
    price: 50,
    status: true,
    stock: 60,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto10.jpg"],
  },
  {
    title: "iPhone 14 Pro",
    description: "Smartphone de 128GB",
    code: "IP001",
    price: 1200,
    status: true,
    stock: 45,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto11.jpg"],
  },
  {
    title: "Tablet Samsung",
    description: "Tablet de 10 pulgadas con 64GB",
    code: "TB001",
    price: 350,
    status: true,
    stock: 35,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto12.jpg"],
  },
  {
    title: "Reloj Inteligente Apple Watch",
    description: "Smartwatch con GPS y 4G",
    code: "SW001",
    price: 450,
    status: true,
    stock: 20,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto13.jpg"],
  },
  {
    title: "Auriculares Bose",
    description: "Auriculares inalámbricos con cancelación de ruido",
    code: "AU001",
    price: 300,
    status: true,
    stock: 25,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto14.jpg"],
  },
  {
    title: "Parlante JBL",
    description: "Parlante portátil a prueba de agua",
    code: "PB001",
    price: 100,
    status: true,
    stock: 40,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto15.jpg"],
  },
  {
    title: "Laptop Dell XPS",
    description: "Laptop con procesador Intel i7 y 16GB de RAM",
    code: "LP001",
    price: 1500,
    status: true,
    stock: 10,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto16.jpg"],
  },
  {
    title: "Monitor LG UltraWide",
    description: "Monitor ultra ancho de 34 pulgadas",
    code: "MN001",
    price: 700,
    status: true,
    stock: 12,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto17.jpg"],
  },
  {
    title: "Teclado Mecánico Razer",
    description: "Teclado mecánico con iluminación RGB",
    code: "KB001",
    price: 120,
    status: true,
    stock: 30,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto18.jpg"],
  },
  {
    title: "Ratón Logitech",
    description: "Ratón inalámbrico con sensor óptico",
    code: "MS001",
    price: 50,
    status: true,
    stock: 50,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto19.jpg"],
  },
  {
    title: "Cámara GoPro Hero 9",
    description: "Cámara de acción 4K",
    code: "CM001",
    price: 400,
    status: true,
    stock: 15,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto20.jpg"],
  },
  {
    title: "Smart TV LG",
    description: "Televisor 4K UHD de 55 pulgadas",
    code: "TV002",
    price: 800,
    status: true,
    stock: 20,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto21.jpg"],
  },
  {
    title: "Consola PlayStation 5",
    description: "Consola de videojuegos de última generación",
    code: "PS001",
    price: 500,
    status: true,
    stock: 25,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto22.jpg"],
  },
  {
    title: "Xbox Series X",
    description: "Consola de videojuegos de Microsoft",
    code: "XB001",
    price: 500,
    status: true,
    stock: 25,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto23.jpg"],
  },
  {
    title: "Nintendo Switch",
    description: "Consola de videojuegos portátil",
    code: "NS001",
    price: 300,
    status: true,
    stock: 30,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto24.jpg"],
  },
  {
    title: "Control PS5",
    description: "Control inalámbrico DualSense",
    code: "CP001",
    price: 70,
    status: true,
    stock: 100,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto25.jpg"],
  },
  {
    title: "Juego The Last of Us 2",
    description: "Juego para PlayStation 5",
    code: "JG001",
    price: 60,
    status: true,
    stock: 50,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto26.jpg"],
  },
  {
    title: "Juego Halo Infinite",
    description: "Juego para Xbox Series X",
    code: "JG002",
    price: 60,
    status: true,
    stock: 50,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto27.jpg"],
  },
  {
    title: "Juego Mario Kart 8",
    description: "Juego para Nintendo Switch",
    code: "JG003",
    price: 50,
    status: true,
    stock: 60,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto28.jpg"],
  },
  {
    title: "Auriculares SteelSeries",
    description: "Auriculares gaming con micrófono",
    code: "AU002",
    price: 120,
    status: true,
    stock: 30,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto29.jpg"],
  },
  {
    title: "Teclado Gaming Corsair",
    description: "Teclado mecánico RGB",
    code: "TK001",
    price: 130,
    status: true,
    stock: 35,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto30.jpg"],
  },
  {
    title: "Monitor Acer Predator",
    description: "Monitor gaming 144Hz",
    code: "MN002",
    price: 400,
    status: true,
    stock: 20,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto31.jpg"],
  },
  {
    title: "Router ASUS",
    description: "Router WiFi 6",
    code: "RT001",
    price: 250,
    status: true,
    stock: 40,
    category: "Redes",
    thumbnails: ["https://www.productos.com/producto32.jpg"],
  },
  {
    title: "Impresora HP",
    description: "Impresora multifuncional inalámbrica",
    code: "IM001",
    price: 100,
    status: true,
    stock: 50,
    category: "Oficina",
    thumbnails: ["https://www.productos.com/producto33.jpg"],
  },
  {
    title: "Disco Duro Externo WD",
    description: "Disco duro externo de 1TB",
    code: "HD001",
    price: 80,
    status: true,
    stock: 70,
    category: "Almacenamiento",
    thumbnails: ["https://www.productos.com/producto34.jpg"],
  },
  {
    title: "Memoria USB SanDisk",
    description: "Memoria USB de 64GB",
    code: "USB001",
    price: 20,
    status: true,
    stock: 200,
    category: "Almacenamiento",
    thumbnails: ["https://www.productos.com/producto35.jpg"],
  },
  {
    title: "Cámara Sony Alpha",
    description: "Cámara mirrorless con lente de 24MP",
    code: "CM002",
    price: 1000,
    status: true,
    stock: 15,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto36.jpg"],
  },
  {
    title: "Lente Canon 50mm",
    description: "Lente fijo para cámaras Canon",
    code: "LN001",
    price: 120,
    status: true,
    stock: 40,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto37.jpg"],
  },
  {
    title: "Trípode Manfrotto",
    description: "Trípode para cámaras fotográficas",
    code: "TP001",
    price: 150,
    status: true,
    stock: 25,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto38.jpg"],
  },
  {
    title: "Flash Godox",
    description: "Flash externo para cámaras DSLR",
    code: "FL001",
    price: 100,
    status: true,
    stock: 30,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto39.jpg"],
  },
  {
    title: "Drone DJI Mavic Air 2",
    description: "Drone con cámara 4K",
    code: "DR001",
    price: 900,
    status: true,
    stock: 10,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto40.jpg"],
  },
  {
    title: "GoPro Hero 10",
    description: "Cámara de acción 5K",
    code: "GP001",
    price: 500,
    status: true,
    stock: 20,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto41.jpg"],
  },
  {
    title: "Pulsera Fitbit Charge 5",
    description: "Pulsera de actividad con GPS",
    code: "FB001",
    price: 180,
    status: true,
    stock: 50,
    category: "Wearables",
    thumbnails: ["https://www.productos.com/producto42.jpg"],
  },
  {
    title: "Alexa Echo Dot",
    description: "Asistente de voz inteligente",
    code: "AD001",
    price: 50,
    status: true,
    stock: 100,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto43.jpg"],
  },
  {
    title: "Lámpara Inteligente Philips Hue",
    description: "Lámpara LED inteligente",
    code: "LH001",
    price: 60,
    status: true,
    stock: 70,
    category: "Hogar",
    thumbnails: ["https://www.productos.com/producto44.jpg"],
  },
  {
    title: "Cerradura Inteligente Yale",
    description: "Cerradura con control remoto",
    code: "CY001",
    price: 300,
    status: true,
    stock: 40,
    category: "Seguridad",
    thumbnails: ["https://www.productos.com/producto45.jpg"],
  },
  {
    title: "Cámara de Seguridad Ring",
    description: "Cámara de vigilancia con WiFi",
    code: "CS001",
    price: 200,
    status: true,
    stock: 35,
    category: "Seguridad",
    thumbnails: ["https://www.productos.com/producto46.jpg"],
  },
  {
    title: "Router Mesh TP-Link",
    description: "Sistema de router Mesh para todo el hogar",
    code: "RM001",
    price: 180,
    status: true,
    stock: 45,
    category: "Redes",
    thumbnails: ["https://www.productos.com/producto47.jpg"],
  },
  {
    title: "Monitor Dell UltraSharp",
    description: "Monitor 27 pulgadas 4K",
    code: "MD001",
    price: 600,
    status: true,
    stock: 20,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto48.jpg"],
  },
  {
    title: "Smartphone Xiaomi Mi 11",
    description: "Smartphone 5G con 256GB",
    code: "SM001",
    price: 700,
    status: true,
    stock: 50,
    category: "Teléfonos",
    thumbnails: ["https://www.productos.com/producto49.jpg"],
  },
  {
    title: "Tablet iPad Pro",
    description: "Tablet 12.9 pulgadas con 256GB",
    code: "TP001",
    price: 1200,
    status: true,
    stock: 15,
    category: "Tablets",
    thumbnails: ["https://www.productos.com/producto50.jpg"],
  },
  {
    title: "Laptop MacBook Pro",
    description: "Laptop con chip M1",
    code: "LP001",
    price: 2000,
    status: true,
    stock: 25,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto51.jpg"],
  },
  {
    title: "Cámara Canon EOS R5",
    description: "Cámara full-frame con 45MP",
    code: "CR001",
    price: 3500,
    status: true,
    stock: 10,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto52.jpg"],
  },
  {
    title: "Disco Duro SSD Samsung",
    description: "Disco duro externo SSD de 2TB",
    code: "HD002",
    price: 300,
    status: true,
    stock: 60,
    category: "Almacenamiento",
    thumbnails: ["https://www.productos.com/producto53.jpg"],
  },
  {
    title: "Auriculares Bose QC35",
    description: "Auriculares inalámbricos con cancelación de ruido",
    code: "AU003",
    price: 350,
    status: true,
    stock: 25,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto54.jpg"],
  },
  {
    title: "Cámara de Seguridad Nest",
    description: "Cámara de vigilancia inteligente",
    code: "CS002",
    price: 180,
    status: true,
    stock: 30,
    category: "Seguridad",
    thumbnails: ["https://www.productos.com/producto55.jpg"],
  },
  {
    title: "Amazon Kindle Paperwhite",
    description: "Lector de libros electrónicos con pantalla de 6 pulgadas",
    code: "KD001",
    price: 150,
    status: true,
    stock: 70,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto56.jpg"],
  },
  {
    title: "Reloj Inteligente Apple Watch",
    description: "Reloj inteligente Series 6",
    code: "RW001",
    price: 400,
    status: true,
    stock: 50,
    category: "Wearables",
    thumbnails: ["https://www.productos.com/producto57.jpg"],
  },
  {
    title: "Barra de Sonido Sonos",
    description: "Barra de sonido inteligente con Alexa",
    code: "BS001",
    price: 500,
    status: true,
    stock: 40,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto58.jpg"],
  },
  {
    title: "Proyector BenQ",
    description: "Proyector 4K HDR",
    code: "PR001",
    price: 1200,
    status: true,
    stock: 15,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto59.jpg"],
  },
  {
    title: "Smartphone OnePlus 9",
    description: "Smartphone 5G con 128GB",
    code: "SP001",
    price: 700,
    status: true,
    stock: 50,
    category: "Teléfonos",
    thumbnails: ["https://www.productos.com/producto60.jpg"],
  },
  {
    title: "Laptop Lenovo ThinkPad",
    description: "Laptop empresarial con Intel Core i7",
    code: "LP002",
    price: 1500,
    status: true,
    stock: 30,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto61.jpg"],
  },
  {
    title: "iMac 27 pulgadas",
    description: "Computadora todo en uno de Apple",
    code: "IM002",
    price: 2500,
    status: true,
    stock: 10,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto62.jpg"],
  },
  {
    title: "Cámara Sony ZV-1",
    description: "Cámara compacta para vloggers",
    code: "CM003",
    price: 800,
    status: true,
    stock: 25,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto63.jpg"],
  },
  {
    title: "Audífonos Sony WH-1000XM4",
    description: "Audífonos con cancelación de ruido",
    code: "AU004",
    price: 350,
    status: true,
    stock: 45,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto64.jpg"],
  },
  {
    title: "Mouse Logitech MX Master 3",
    description: "Ratón inalámbrico ergonómico",
    code: "MO001",
    price: 100,
    status: true,
    stock: 60,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto65.jpg"],
  },
  {
    title: "Teclado Mecánico Corsair",
    description: "Teclado RGB con switches mecánicos",
    code: "TK001",
    price: 150,
    status: true,
    stock: 50,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto66.jpg"],
  },
  {
    title: "Monitor LG Ultrawide",
    description: "Monitor 34 pulgadas ultrawide",
    code: "MO002",
    price: 700,
    status: true,
    stock: 15,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto67.jpg"],
  },
  {
    title: "Impresora HP LaserJet",
    description: "Impresora láser monocromática",
    code: "IM001",
    price: 250,
    status: true,
    stock: 35,
    category: "Impresión",
    thumbnails: ["https://www.productos.com/producto68.jpg"],
  },
  {
    title: "Parlante Bluetooth JBL",
    description: "Parlante portátil resistente al agua",
    code: "PB001",
    price: 180,
    status: true,
    stock: 70,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto69.jpg"],
  },
  {
    title: "Tablet Samsung Galaxy Tab S7",
    description: "Tablet de 11 pulgadas con S-Pen",
    code: "TB001",
    price: 650,
    status: true,
    stock: 25,
    category: "Tablets",
    thumbnails: ["https://www.productos.com/producto70.jpg"],
  },
  {
    title: "Cámara GoPro Hero 9",
    description: "Cámara de acción con grabación 5K",
    code: "CG001",
    price: 500,
    status: true,
    stock: 40,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto71.jpg"],
  },
  {
    title: "Smartwatch Samsung Galaxy Watch 4",
    description: "Reloj inteligente con monitor de salud",
    code: "SW001",
    price: 300,
    status: true,
    stock: 55,
    category: "Wearables",
    thumbnails: ["https://www.productos.com/producto72.jpg"],
  },
  {
    title: "Auriculares Jabra Elite 75t",
    description: "Auriculares inalámbricos con cancelación de ruido",
    code: "AU005",
    price: 200,
    status: true,
    stock: 65,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto73.jpg"],
  },
  {
    title: "Proyector Epson PowerLite",
    description: "Proyector HD con 3000 lúmenes",
    code: "PR002",
    price: 900,
    status: true,
    stock: 20,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto74.jpg"],
  },
  {
    title: "Consola PlayStation 5",
    description: "Consola de videojuegos de próxima generación",
    code: "PS001",
    price: 500,
    status: true,
    stock: 10,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto75.jpg"],
  },
  {
    title: "Consola Xbox Series X",
    description: "Consola de videojuegos con 1TB",
    code: "XB001",
    price: 500,
    status: true,
    stock: 12,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto76.jpg"],
  },
  {
    title: "Nintendo Switch OLED",
    description: "Consola portátil con pantalla OLED",
    code: "NS001",
    price: 350,
    status: true,
    stock: 22,
    category: "Videojuegos",
    thumbnails: ["https://www.productos.com/producto77.jpg"],
  },
  {
    title: "Control DualSense PS5",
    description: "Control inalámbrico para PlayStation 5",
    code: "CD001",
    price: 70,
    status: true,
    stock: 50,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto78.jpg"],
  },
  {
    title: "Cámara Canon PowerShot G7X",
    description: "Cámara compacta para vloggers",
    code: "CP001",
    price: 700,
    status: true,
    stock: 20,
    category: "Fotografía",
    thumbnails: ["https://www.productos.com/producto79.jpg"],
  },
  {
    title: "Cargador Inalámbrico Belkin",
    description: "Cargador rápido Qi para smartphones",
    code: "CI001",
    price: 50,
    status: true,
    stock: 80,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto80.jpg"],
  },
  {
    title: "Altavoz Inteligente Amazon Echo",
    description: "Altavoz con Alexa integrado",
    code: "AE001",
    price: 100,
    status: true,
    stock: 65,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto81.jpg"],
  },
  {
    title: "Laptop ASUS ROG",
    description: "Laptop gaming con tarjeta gráfica RTX 3070",
    code: "LA001",
    price: 2500,
    status: true,
    stock: 10,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto82.jpg"],
  },
  {
    title: "Monitor Acer Predator",
    description: "Monitor gaming de 32 pulgadas 165Hz",
    code: "MG001",
    price: 800,
    status: true,
    stock: 15,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto83.jpg"],
  },
  {
    title: "Teclado Gaming Razer",
    description: "Teclado mecánico con iluminación RGB",
    code: "TG001",
    price: 120,
    status: true,
    stock: 40,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto84.jpg"],
  },
  {
    title: "Auriculares HyperX Cloud II",
    description: "Auriculares gaming con sonido envolvente",
    code: "AH001",
    price: 100,
    status: true,
    stock: 50,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto85.jpg"],
  },
  {
    title: "Silla Gaming Secretlab",
    description: "Silla ergonómica para gamers",
    code: "SG001",
    price: 450,
    status: true,
    stock: 15,
    category: "Muebles",
    thumbnails: ["https://www.productos.com/producto86.jpg"],
  },
  {
    title: "Disco Duro Externo WD 4TB",
    description: "Disco duro externo USB 3.0",
    code: "HD003",
    price: 150,
    status: true,
    stock: 25,
    category: "Almacenamiento",
    thumbnails: ["https://www.productos.com/producto87.jpg"],
  },
  {
    title: "Memoria RAM Corsair 16GB",
    description: "Memoria RAM DDR4 3200MHz",
    code: "MR001",
    price: 120,
    status: true,
    stock: 40,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto88.jpg"],
  },
  {
    title: "Fuente de Poder EVGA 750W",
    description: "Fuente de poder con certificación 80 Plus Gold",
    code: "FP001",
    price: 130,
    status: true,
    stock: 35,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto89.jpg"],
  },
  {
    title: "Tarjeta Gráfica Nvidia RTX 3080",
    description: "Tarjeta gráfica gaming de última generación",
    code: "TG002",
    price: 1500,
    status: true,
    stock: 20,
    category: "Computación",
    thumbnails: ["https://www.productos.com/producto90.jpg"],
  },
  {
    title: "Mouse Gaming Logitech G502",
    description: "Mouse con sensores de alta precisión",
    code: "MG002",
    price: 90,
    status: true,
    stock: 60,
    category: "Accesorios",
    thumbnails: ["https://www.productos.com/producto91.jpg"],
  },
  {
    title: "Enrutador WiFi TP-Link",
    description: "Enrutador WiFi de alta velocidad",
    code: "ER001",
    price: 80,
    status: true,
    stock: 50,
    category: "Redes",
    thumbnails: ["https://www.productos.com/producto92.jpg"],
  },
  {
    title: "Cámara de Seguridad Xiaomi",
    description: "Cámara de seguridad IP con visión nocturna",
    code: "CS001",
    price: 60,
    status: true,
    stock: 70,
    category: "Seguridad",
    thumbnails: ["https://www.productos.com/producto93.jpg"],
  },
  {
    title: "Smart TV LG OLED",
    description: "Televisor inteligente OLED 55 pulgadas",
    code: "TV002",
    price: 1800,
    status: true,
    stock: 15,
    category: "Electrónica",
    thumbnails: ["https://www.productos.com/producto94.jpg"],
  },
  {
    title: "Auriculares Sony WH-1000XM4",
    description: "Auriculares con cancelación de ruido",
    code: "AU006",
    price: 350,
    status: true,
    stock: 45,
    category: "Audio",
    thumbnails: ["https://www.productos.com/producto95.jpg"],
  },
  {
    title: "Microondas Samsung Grill",
    description: "Microondas con función grill de 900W",
    code: "MC002",
    price: 180,
    status: true,
    stock: 30,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto96.jpg"],
  },
  {
    title: "Congelador Whirlpool",
    description: "Congelador vertical de 250 litros",
    code: "CO001",
    price: 600,
    status: true,
    stock: 20,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto97.jpg"],
  },
  {
    title: "Ventilador de Torre Dyson",
    description: "Ventilador de torre sin aspas",
    code: "VT002",
    price: 500,
    status: true,
    stock: 25,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto98.jpg"],
  },
  {
    title: "Refrigerador Samsung Inverter",
    description: "Refrigerador de 400 litros con tecnología inverter",
    code: "RF002",
    price: 1200,
    status: true,
    stock: 18,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto99.jpg"],
  },
  {
    title: "Horno Eléctrico Midea",
    description: "Horno eléctrico multifunción de 35 litros",
    code: "HE002",
    price: 250,
    status: true,
    stock: 40,
    category: "Electrodomésticos",
    thumbnails: ["https://www.productos.com/producto100.jpg"],
  },
];

const createData = async () => {
  await productsModel.deleteMany({});
  await productsModel.insertMany(products);
  console.log(`Data generated`);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question("Por favor, introduce tu clave: ", async (password) => {
  if (password === "CoderCoder123") {
    await connDB(config.MONGO_URL, config.MONGO_DB);

    await createData();
  } else {
    console.log(`Incorrect password`);
  }

  rl.close();
});
