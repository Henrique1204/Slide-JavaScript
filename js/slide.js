export default class Slide {
    constructor(slide, slideWrapper) {
        this.slide = document.querySelector(slide);
        this.slideWrapper = document.querySelector(slideWrapper);
        this.dist = { posicaoFinal: 0, comecoX: 0, movimento: 0 };
    }

    moverSlide(distX) {
        this.dist.posicaoMovida = distX;
        this.slide.style.transform = `translate3D(${distX}px, 0, 0)`;
    }

    atualizarPosicao(clientX) {
        this.dist.movimento = (this.dist.comecoX - clientX) * 1.6;
        return this.dist.posicaoFinal - this.dist.movimento;
    }

    comecar(evento) {
        evento.preventDefault();

        this.dist.comecoX = evento.clientX;
        this.slideWrapper.addEventListener("mousemove", this.mover);
    }

    mover(evento) {
        const posicaoFinal = this.atualizarPosicao(evento.clientX);
        this.moverSlide(posicaoFinal);
    }

    encerrar(evento) {
        this.slideWrapper.removeEventListener("mousemove", this.mover);
        this.dist.posicaoFinal = this.dist.posicaoMovida;
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