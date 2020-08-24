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
        let tipoMovimento;

        if (evento.type === "mousedown") {
            evento.preventDefault();
            this.dist.comecoX = evento.clientX;
            tipoMovimento = "mousemove";
        } else {
            this.dist.comecoX = evento.changedTouches[0].clientX;
            tipoMovimento = "touchmove";
        }

        this.slideWrapper.addEventListener(tipoMovimento, this.mover);
    }

    mover(evento) {
        const posicaoPonteiro = (evento.type === "mousemove") ? evento.clientX : evento.changedTouches[0].clientX;
        const posicaoFinal = this.atualizarPosicao(posicaoPonteiro);
        this.moverSlide(posicaoFinal);
    }

    encerrar(evento) {
        const moveType = (evento.type === "mouseup") ? "mousemove" : "touchmove";
        this.slideWrapper.removeEventListener(moveType, this.mover);
        this.dist.posicaoFinal = this.dist.posicaoMovida;
    }

    addEventosSlide() {
        this.slideWrapper.addEventListener("mousedown", this.comecar);
        this.slideWrapper.addEventListener("mouseup", this.encerrar);

        this.slideWrapper.addEventListener("touchstart", this.comecar);
        this.slideWrapper.addEventListener("touchend", this.encerrar);
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