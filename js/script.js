import SlideNav from "./slide.js";

const slideNav = new SlideNav(".slide", ".slide-wrapper");
slideNav.iniciar();
slideNav.addFlecha(".ante", ".prox");
slideNav.addEventoControle(".controle-personalizado");