* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #020617;
  color: #ffffff;
  overflow-x: hidden;
}

body.menu-open {
  overflow: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

img {
  display: block;
  max-width: 100%;
}

.page-bg {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, rgba(14, 165, 233, 0.18), transparent 35%);
  pointer-events: none;
  z-index: 0;
}

.site-wrapper {
  position: relative;
  z-index: 1;
}

.container {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
}

/* HEADER */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(14px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-title {
  font-size: 18px;
  font-weight: 900;
}

.brand-subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 32px;
  font-size: 14px;
  color: #cbd5e1;
}

.main-nav a,
.footer-links a {
  position: relative;
}

.main-nav a::after,
.footer-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: #38bdf8;
  transition: width 0.25s ease;
}

.main-nav a:hover,
.footer-links a:hover,
.mobile-link:hover {
  color: #7dd3fc;
}

.main-nav a:hover::after,
.footer-links a:hover::after {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-switch {
  display: flex;
  padding: 4px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-btn {
  border: none;
  background: transparent;
  color: #cbd5e1;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.lang-btn.active {
  background: #3b82f6;
  color: #ffffff;
}

.header-demo-btn {
  display: inline-block;
}

/* MOBILE BUTTONS */
.menu-toggle,
.menu-close {
  border: none;
  cursor: pointer;
}

.menu-toggle {
  display: none;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
  padding: 0;
  flex-shrink: 0;
}

.menu-toggle span {
  position: absolute;
  left: 13px;
  width: 24px;
  height: 2px;
  background: #ffffff;
  border-radius: 999px;
  transition: 0.25s ease;
}

.menu-toggle span:nth-child(1) {
  top: 17px;
}

.menu-toggle span:nth-child(2) {
  top: 25px;
}

.menu-toggle span:nth-child(3) {
  top: 33px;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg);
  top: 25px;
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg);
  top: 25px;
}

.menu-close {
  font-size: 40px;
  line-height: 1;
  background: transparent;
  color: #ffffff;
}

/* MOBILE OVERLAY MENU */
.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(10px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.35s ease, visibility 0.35s ease;
}

.mobile-menu.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.mobile-menu-panel {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #020617 0%, #061126 100%);
  transform: translateX(100%);
  transition: transform 0.4s ease;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.mobile-menu.open .mobile-menu-panel {
  transform: translateX(0);
}

.mobile-menu-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mobile-link {
  display: block;
  padding: 18px 18px;
  border-radius: 18px;
  color: #e2e8f0;
  font-size: 20px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, background 0.2s ease;
}

.mobile-link:hover {
  transform: translateX(4px);
  background: rgba(59, 130, 246, 0.12);
}

.mobile-menu-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mobile-lang-switch {
  width: fit-content;
}

/* BUTTONS */
.btn {
  display: inline-block;
  border: none;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.btn:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.18);
}

.btn-small {
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
}

.btn-primary {
  background: #3b82f6;
  color: #ffffff;
  padding: 16px 24px;
  border-radius: 16px;
  font-weight: 700;
  text-align: center;
}

.btn-gradient {
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  color: #ffffff;
  padding: 16px 28px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 700;
}

.btn-block {
  display: block;
  width: 100%;
  text-align: center;
}

/* LOGOS */
.logo {
  border-radius: 18px;
  object-fit: cover;
}

.logo-xs {
  width: 40px;
  height: 40px;
}

.logo-sm {
  width: 44px;
  height: 44px;
}

.logo-md {
  width: 64px;
  height: 64px;
}

.logo-xl {
  width: 96px;
  height: 96px;
  margin-bottom: 32px;
}

/* SPLASH */
.splash-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 0;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gradient-title {
  margin: 0 0 24px;
  font-size: clamp(42px, 8vw, 72px);
  font-weight: 900;
  line-height: 1.05;
  background: linear-gradient(to right, #22d3ee, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.splash-text {
  max-width: 800px;
  color: #cbd5e1;
  font-size: 20px;
  line-height: 1.7;
  margin-bottom: 40px;
}

.scroll-indicator {
  color: #94a3b8;
  font-size: 14px;
  animation: bounce 1.5s infinite;
}

/* SECTIONS */
.hero-section,
.section {
  padding: 80px 0;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(125, 211, 252, 0.2);
  background: rgba(59, 130, 246, 0.1);
  color: #bae6fd;
  font-size: 14px;
  animation: pulseGlow 2.2s infinite;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
}

.hero-title {
  margin: 0 0 24px;
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 900;
  line-height: 1.08;
}

.hero-text {
  margin: 0 0 32px;
  color: #cbd5e1;
  font-size: 20px;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* STATS */
.stats-section {
  padding: 0 0 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat-card {
  border-radius: 24px;
  padding: 28px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.2);
}

.stat-number {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 900;
  color: #38bdf8;
  margin-bottom: 8px;
}

.stat-label {
  color: #cbd5e1;
  font-size: 15px;
  line-height: 1.5;
}

/* CHAT CARD */
.chat-card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chat-card:hover,
.language-card:hover,
.service-card:hover,
.process-card:hover,
.pricing-card:hover,
.info-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

.chat-card-glow {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.7), transparent 55%);
}

.chat-card-inner {
  position: relative;
  z-index: 1;
}

.chat-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.chat-brand-title {
  font-size: 32px;
  font-weight: 900;
}

.chat-brand-subtitle {
  color: #bae6fd;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-message {
  max-width: 500px;
  padding: 16px 20px;
  border-radius: 24px;
  line-height: 1.6;
  animation: messagePop 0.5s ease;
}

.chat-message.incoming {
  background: #ffffff;
  color: #0f172a;
}

.chat-message.outgoing {
  margin-left: auto;
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  color: #ffffff;
}

.chat-message.neutral {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* TITLES */
.section-title-wrap {
  max-width: 780px;
  margin: 0 auto 48px;
  text-align: center;
}

.section-title-wrap .logo {
  margin: 0 auto 20px;
}

.section-eyebrow {
  margin: 0 0 12px;
  color: #7dd3fc;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.section-title {
  margin: 0 0 16px;
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 900;
}

.section-text {
  margin: 0;
  color: #cbd5e1;
  font-size: 20px;
  line-height: 1.75;
}

/* CARDS */
.language-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.language-card,
.service-card,
.process-card,
.pricing-card,
.contact-box,
.info-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.language-card {
  position: relative;
  overflow: hidden;
  padding: 32px;
  border-radius: 28px;
  backdrop-filter: blur(14px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.language-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, rgba(14, 165, 233, 0.05), transparent);
}

.language-card-content {
  position: relative;
  z-index: 1;
}

.language-card-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.language-label {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.4);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

.language-title {
  margin: 0 0 20px;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
}

.language-bullets {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 32px;
}

.bullet-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #e2e8f0;
  font-size: 18px;
  line-height: 1.6;
}

.bullet-dot {
  color: #7dd3fc;
  font-weight: 900;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.service-card {
  padding: 28px;
  border-radius: 28px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card .logo {
  margin-bottom: 20px;
}

.service-card-title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 900;
}

.service-card-text {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.75;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.process-card {
  padding: 32px;
  border-radius: 28px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.process-step {
  margin: 0 0 16px;
  color: #7dd3fc;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.25em;
}

.process-card-title {
  margin: 0 0 16px;
  font-size: 30px;
  font-weight: 900;
}

.process-card-text {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.75;
}

.industries-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.industry-pill {
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-weight: 600;
  transition: transform 0.25s ease, background 0.25s ease;
}

.industry-pill:hover {
  transform: translateY(-3px);
  background: rgba(59, 130, 246, 0.12);
}

.pricing-grid {
  max-width: 920px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.pricing-card {
  padding: 32px;
  border-radius: 28px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pricing-card-featured {
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(59, 130, 246, 0.1);
}

.pricing-label {
  margin: 0 0 16px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.25em;
}

.pricing-label-light {
  color: #cbd5e1;
}

.pricing-price {
  margin-bottom: 24px;
  font-size: 64px;
  font-weight: 900;
}

.pricing-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.feature-line {
  color: #cbd5e1;
}

.contact-box {
  overflow: hidden;
  border-radius: 32px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.contact-info {
  padding: 40px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.info-card {
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:last-child {
  margin-bottom: 0;
}

.info-label {
  margin-bottom: 6px;
  color: #94a3b8;
  font-size: 14px;
}

.info-value {
  font-weight: 700;
}

.contact-form {
  padding: 40px;
  background: rgba(2, 6, 23, 0.3);
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  margin-bottom: 20px;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: rgba(56, 189, 248, 0.65);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.contact-form textarea {
  min-height: 150px;
  resize: vertical;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #94a3b8;
}

/* FOOTER */
.site-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px 0;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #cbd5e1;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-links {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

/* ANIMATIONS */
.fade-in-top {
  animation: fadeInTop 0.8s ease both;
}

.float-anim {
  animation: floatUpDown 4s ease-in-out infinite;
}

.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal.show {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 {
  transition-delay: 0.15s;
}

.reveal-delay-2 {
  transition-delay: 0.3s;
}

@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translateY(-18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatUpDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 rgba(56, 189, 248, 0);
  }
  50% {
    box-shadow: 0 0 24px rgba(56, 189, 248, 0.18);
  }
}

@keyframes messagePop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-grid,
  .language-grid,
  .pricing-grid,
  .contact-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .process-grid {
    grid-template-columns: 1fr;
  }

  .contact-info {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 900px) {
  .main-nav,
  .desktop-lang-switch,
  .header-demo-btn {
    display: none;
  }

  .menu-toggle {
    display: inline-block;
  }

  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-section {
    padding-bottom: 20px;
  }
}

@media (min-width: 901px) {
  .mobile-menu {
    display: none;
  }
}

@media (max-width: 640px) {
  .container {
    width: min(1120px, calc(100% - 32px));
  }

  .hero-section,
  .section {
    padding: 64px 0;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .header-inner {
    flex-wrap: nowrap;
  }

  .pricing-price {
    font-size: 52px;
  }

  .chat-brand-title {
    font-size: 24px;
  }

  .mobile-link {
    font-size: 18px;
  }

  .stat-card {
    padding: 24px 18px;
  }

  .section-text,
  .hero-text,
  .splash-text {
    font-size: 18px;
  }
}
