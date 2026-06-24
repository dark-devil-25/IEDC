const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navShell = document.querySelector(".nav-shell");
const reveals = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const colorCanvas = document.querySelector("#color-video-bg");
let headerFrame = null;

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            navToggle.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const updateHeaderState = () => {
    if (!navShell) {
        return;
    }

    navShell.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", () => {
    if (headerFrame) {
        return;
    }

    headerFrame = window.requestAnimationFrame(() => {
        updateHeaderState();
        headerFrame = null;
    });
}, { passive: true });

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    reveals.forEach((item) => observer.observe(item));
} else {
    reveals.forEach((item) => item.classList.add("in-view"));
}

if (contactForm && formNote) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formNote.textContent = "Thanks for reaching out. Your message is ready to be connected to a real email or backend service.";
        contactForm.reset();
    });
}

if (colorCanvas) {
    const ctx = colorCanvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const colors = [
        "rgba(34, 211, 238, 0.62)",
        "rgba(124, 58, 237, 0.58)",
        "rgba(14, 165, 233, 0.48)",
        "rgba(168, 85, 247, 0.46)",
        "rgba(59, 130, 246, 0.44)"
    ];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameId = null;
    let resizeFrame = null;
    let lastPaint = 0;
    const targetFrameMs = 1000 / 40;

    const resizeCanvas = () => {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
        width = window.innerWidth;
        height = window.innerHeight;
        colorCanvas.width = Math.floor(width * pixelRatio);
        colorCanvas.height = Math.floor(height * pixelRatio);
        colorCanvas.style.width = `${width}px`;
        colorCanvas.style.height = `${height}px`;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const paintColorVideo = (time = 0) => {
        if (document.hidden) {
            frameId = null;
            return;
        }

        if (time - lastPaint < targetFrameMs && !reduceMotion.matches) {
            frameId = window.requestAnimationFrame(paintColorVideo);
            return;
        }

        lastPaint = time;
        const t = time * 0.00018;
        ctx.clearRect(0, 0, width, height);

        const base = ctx.createLinearGradient(0, 0, width, height);
        base.addColorStop(0, "#050816");
        base.addColorStop(0.38, "#090f2a");
        base.addColorStop(0.72, "#121035");
        base.addColorStop(1, "#061827");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = "screen";
        colors.forEach((color, index) => {
            const speed = 0.8 + index * 0.22;
            const x = width * (0.5 + Math.sin(t * speed + index * 1.7) * 0.38);
            const y = height * (0.5 + Math.cos(t * (speed + 0.28) + index * 1.35) * 0.36);
            const radius = Math.max(width, height) * (0.42 + index * 0.035);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.52, color.replace(/0\.\d+\)/, "0.18)"));
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });

        ctx.globalCompositeOperation = "overlay";
        const sweep = ctx.createLinearGradient(
            width * (0.2 + Math.sin(t * 1.5) * 0.2),
            0,
            width * (0.8 + Math.cos(t * 1.1) * 0.2),
            height
        );
        sweep.addColorStop(0, "rgba(255, 255, 255, 0)");
        sweep.addColorStop(0.45, "rgba(125, 211, 252, 0.22)");
        sweep.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = sweep;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";

        if (!reduceMotion.matches) {
            frameId = window.requestAnimationFrame(paintColorVideo);
        }
    };

    const startColorVideo = () => {
        if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = null;
        }
        lastPaint = 0;
        resizeCanvas();
        paintColorVideo();
    };

    const queueResize = () => {
        if (resizeFrame) {
            return;
        }

        resizeFrame = window.requestAnimationFrame(() => {
            resizeFrame = null;
            startColorVideo();
        });
    };

    const handleVisibility = () => {
        if (!document.hidden && !frameId && !reduceMotion.matches) {
            frameId = window.requestAnimationFrame(paintColorVideo);
        }
    };

    startColorVideo();
    window.addEventListener("resize", queueResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", startColorVideo);
}

// Slider and Lightbox functionality for the LinkedIn Bootcamp gallery page
const sliderWrapper = document.querySelector(".slider-wrapper");
if (sliderWrapper) {
    const track = sliderWrapper.querySelector(".slider-track");
    const slides = Array.from(sliderWrapper.querySelectorAll(".slider-slide"));
    const prevBtn = sliderWrapper.querySelector(".prev-btn");
    const nextBtn = sliderWrapper.querySelector(".next-btn");
    const dots = Array.from(sliderWrapper.querySelectorAll(".dot"));
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    const updateSlider = (index) => {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentIndex);
        });
        
        slides.forEach((slide, idx) => {
            slide.classList.toggle("active", idx === currentIndex);
        });
    };
    
    prevBtn.addEventListener("click", () => updateSlider(currentIndex - 1));
    nextBtn.addEventListener("click", () => updateSlider(currentIndex + 1));
    
    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            updateSlider(index);
        });
    });
    
    // Touch swipe support for mobile
    let startX = 0;
    let isSwiping = false;
    
    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });
    
    track.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        const diffX = e.touches[0].clientX - startX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                updateSlider(currentIndex - 1);
            } else {
                updateSlider(currentIndex + 1);
            }
            isSwiping = false;
        }
    }, { passive: true });
    
    track.addEventListener("touchend", () => {
        isSwiping = false;
    });

    // Lightbox modal functionality
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = lightboxModal.querySelector(".lightbox-close");
    const lightboxPrev = lightboxModal.querySelector(".lightbox-prev");
    const lightboxNext = lightboxModal.querySelector(".lightbox-next");
    
    const galleryImages = slides.map(slide => {
        const img = slide.querySelector("img");
        return {
            src: img.src,
            alt: img.alt
        };
    });
    
    let lightboxIndex = 0;
    
    const openLightbox = (index) => {
        lightboxIndex = index;
        updateLightboxContent();
        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        lightboxClose.focus();
    };
    
    const closeLightbox = () => {
        lightboxModal.classList.remove("active");
        lightboxModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        slides[currentIndex].focus();
    };
    
    const updateLightboxContent = () => {
        const currentImgData = galleryImages[lightboxIndex];
        lightboxImg.src = currentImgData.src;
        lightboxImg.alt = currentImgData.alt;
        lightboxCaption.textContent = currentImgData.alt;
    };
    
    const showPrevLightboxImage = () => {
        lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxContent();
    };
    
    const showNextLightboxImage = () => {
        lightboxIndex = (lightboxIndex + 1) % galleryImages.length;
        updateLightboxContent();
    };
    
    slides.forEach((slide, index) => {
        slide.setAttribute("tabindex", "0");
        slide.setAttribute("role", "button");
        slide.setAttribute("aria-label", `View slide ${index + 1} in full screen`);
        
        slide.addEventListener("click", () => openLightbox(index));
        slide.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
    
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", showPrevLightboxImage);
    lightboxNext.addEventListener("click", showNextLightboxImage);
    
    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal || e.target === lightboxModal.querySelector(".lightbox-content")) {
            closeLightbox();
        }
    });
    
    document.addEventListener("keydown", (e) => {
        if (!lightboxModal.classList.contains("active")) return;
        
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            showPrevLightboxImage();
        } else if (e.key === "ArrowRight") {
            showNextLightboxImage();
        } else if (e.key === "Tab") {
            const focusables = Array.from(lightboxModal.querySelectorAll("button"));
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Dynamic Cover Image Morphing
const programmeCover = document.querySelector(".programme-cover");
const gallerySliderImages = document.querySelectorAll(".slider-slide img");

if (programmeCover && gallerySliderImages.length > 0) {
    const originalImg = programmeCover.querySelector("img");
    
    // Create a container for the morphing images
    const morphContainer = document.createElement("div");
    morphContainer.className = "morph-container";
    morphContainer.style.position = "absolute";
    morphContainer.style.top = "0";
    morphContainer.style.left = "0";
    morphContainer.style.width = "100%";
    morphContainer.style.height = "100%";
    morphContainer.style.overflow = "hidden";
    morphContainer.style.zIndex = "0";

    // Gather all unique image sources
    const imgSrcs = [originalImg.src];
    gallerySliderImages.forEach(img => {
        if (!imgSrcs.includes(img.src)) {
            imgSrcs.push(img.src);
        }
    });

    if (imgSrcs.length > 1) {
        // Create an img element for each source
        const morphImages = imgSrcs.map((src, index) => {
            const img = document.createElement("img");
            img.src = src;
            img.style.position = "absolute";
            img.style.top = "0";
            img.style.left = "0";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            // Morph transition effect
            img.style.transition = "opacity 2.5s ease-in-out, transform 8s linear";
            img.style.opacity = index === 0 ? "1" : "0";
            img.style.transform = index === 0 ? "scale(1.05)" : "scale(1)"; 
            
            morphContainer.appendChild(img);
            return img;
        });

        // Hide original image and insert morph container
        originalImg.style.display = "none";
        programmeCover.insertBefore(morphContainer, programmeCover.firstChild);

        // Make sure the stage overlay is above
        const stageOverlay = programmeCover.querySelector(".stage-overlay");
        if (stageOverlay) {
            stageOverlay.style.zIndex = "1";
        }

        let currentMorphIndex = 0;
        
        setInterval(() => {
            const nextIndex = (currentMorphIndex + 1) % morphImages.length;
            
            // Fade out current
            morphImages[currentMorphIndex].style.opacity = "0";
            morphImages[currentMorphIndex].style.transform = "scale(1)";
            
            // Fade in next
            morphImages[nextIndex].style.opacity = "1";
            morphImages[nextIndex].style.transform = "scale(1.05)";
            
            currentMorphIndex = nextIndex;
        }, 5000); // Trigger morph every 5 seconds
    }
}
