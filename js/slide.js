import debounce from "./debounce.js";

export class Slide {
    constructor(slide, slideWrapper, classeAtivo) {
        this.slide = document.querySelector(slide);
        this.slideWrapper = document.querySelector(slideWrapper);
        this.dist = { posicaoFinal: 0, comecoX: 0, movimento: 0 };
        this.classeAtivo = (classeAtivo) ? classeAtivo : "ativo";
        this.eventoTroca = new Event("eventoTroca");
    }

    trasnsitar(ativo) {
        this.slide.style.transition = (ativo) ? "transform 0.3s" : "";
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
        this.trasnsitar(false);
    }

    mover(evento) {
        const posicaoPonteiro = (evento.type === "mousemove") ? evento.clientX : evento.changedTouches[0].clientX;
        const posicaoFinal = this.atualizarPosicao(posicaoPonteiro);
        this.moverSlide(posicaoFinal);
    }

    mudarAoEncerrar() {
        if (this.dist.movimento > 120 && this.index.prox !== undefined) {
            this.ativarSlideProximo();
        } else if (this.dist.movimento < -120 && this.index.ante !== undefined) {
            this.ativarSlideAnterior();
        } else {
            this.mudarSlide(this.index.ativo);
        }
    }

    encerrar(evento) {
        const moveType = (evento.type === "mouseup") ? "mousemove" : "touchmove";
        this.slideWrapper.removeEventListener(moveType, this.mover);
        this.dist.posicaoFinal = this.dist.posicaoMovida;

        this.trasnsitar(true);
        this.mudarAoEncerrar();
    }

    addEventosSlide() {
        this.slideWrapper.addEventListener("mousedown", this.comecar);
        this.slideWrapper.addEventListener("mouseup", this.encerrar);

        this.slideWrapper.addEventListener("touchstart", this.comecar);
        this.slideWrapper.addEventListener("touchend", this.encerrar);
    }

    posicionarSlide(slide) {
        const margem = ( this.slideWrapper.offsetWidth - slide.offsetWidth ) / 2;
        return -(slide.offsetLeft - margem);
    }

    configurarSlides() {
        this.slideArray = [...this.slide.children].map((elemento) => {
            const posicao = this.posicionarSlide(elemento);
            return { elemento, posicao };
        });
    }

    slidesIndexNav(index) {
        const ultimo = this.slideArray.length - 1;

        this.index = {
            ante: (index) ? index - 1 : undefined,
            ativo: index,
            prox: (index === ultimo) ?  undefined : index + 1
        };
    }

    mudarClasseAtiva() {
        this.slideArray.forEach((item) => item.elemento.classList.remove(this.classeAtivo));
        this.slideArray[this.index.ativo].elemento.classList.add(this.classeAtivo);
    }

    mudarSlide(index = 0) {
        const slideAtivo = this.slideArray[index];
        this.moverSlide(slideAtivo.posicao);
        this.slidesIndexNav(index);
        this.dist.posicaoFinal = slideAtivo.posicao;
        this.mudarClasseAtiva();
        this.slideWrapper.dispatchEvent(this.eventoTroca);
    }

    ativarSlideAnterior() {
        if (this.index.ante !== undefined) {
            this.mudarSlide(this.index.ante);
        }
    }

    ativarSlideProximo() {
        if (this.index.prox !== undefined) {
            this.mudarSlide(this.index.prox);
        }
    }

    onResize() {
        setTimeout(() => {
            this.configurarSlides();
            this.mudarSlide(this.index.ativo);
        }, 800);
    }

    addEventoResize() {
        window.addEventListener("resize", this.onResize);
    }

    bindMetodos() {
        this.comecar = this.comecar.bind(this);
        this.mover = this.mover.bind(this);
        this.encerrar = this.encerrar.bind(this);
        debounce(this.onResize = this.onResize.bind(this), 200);
        this.ativarSlideAnterior = this.ativarSlideAnterior.bind(this);
        this.ativarSlideProximo = this.ativarSlideProximo.bind(this);
    }

    iniciar() {
        this.configurarSlides();
        this.bindMetodos();
        this.trasnsitar(true);
        this.addEventoResize();

        if (this.slide && this.slideWrapper) {
            this.addEventosSlide();
            this.mudarSlide();
        }

        return this;
    }
}

export class SlideNav extends Slide {
    constructor(slide, slideWrapper, classeAtivo) {
        super(slide, slideWrapper, classeAtivo);

        this.bindEventosControle();
    }

    addFlecha(ante, prox) {
        this.anteElemento = document.querySelector(ante);
        this.proxElemento = document.querySelector(prox);
        this.addEventosFlecha();
    }

    addEventosFlecha() {
        this.anteElemento.addEventListener("click", this.ativarSlideAnterior);
        this.proxElemento.addEventListener("click", this.ativarSlideProximo);
    }

    criarControle() {
        const controle = document.createElement("ul");
        controle.dataset.controle = "slide";

        this.slideArray.forEach((item, index) => {
            controle.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`;
        });

        this.slideWrapper.appendChild(controle);
        return controle;
    }

    eventoControle(item, index) {
        item.addEventListener("click", (event) => {
            event.preventDefault();

            this.mudarSlide(index);
        });

        this.slideWrapper.addEventListener("eventoTroca", this.ativarControleItem);
    }

    ativarControleItem() {
        this.controleArray.forEach((item) => item.classList.remove(this.classeAtivo));

        this.controleArray[this.index.ativo].classList.add(this.classeAtivo);
    }

    addEventoControle(controlePersonalizado) {
        this.controle = document.querySelector(controlePersonalizado) || this.criarControle();
        this.controleArray = [...this.controle.children];

        this.ativarControleItem();
        this.controleArray.forEach(this.eventoControle);
    }

    bindEventosControle() {
        this.eventoControle = this.eventoControle.bind(this);
        this.ativarControleItem = this.ativarControleItem.bind(this);
    }
}