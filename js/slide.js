export default class Slide {
    constructor(slide, slideWrapper) {
        this.slide = document.querySelector(slide);
        this.slideWrapper = document.querySelector(slideWrapper);
    }

    comecar(evento) {
        evento.preventDefault();
        
        this.slideWrapper.addEventListener("mousemove", this.mover);
    }

    encerrar(evento) {
        this.slideWrapper.removeEventListener("mousemove", this.mover);
    }

    mover(event) {
        console.log("moveu");
    }

    addEventosSlide() {
        this.slideWrapper.addEventListener("mousedown", this.comecar);
        this.slideWrapper.addEventListener("mouseup", this.encerrar);
    }

    bindMetodos() {
        this.comecar = this.comecar.bind(this);
        this.mover = this.mover.bind(this);
        this.encerrar = this.encerrar.bind(this);
    }

    iniciar() {
        this.bindMetodos();

        if (this.slide && this.slideWrapper) {
            this.addEventosSlide();
        }

        return this;
    }
}