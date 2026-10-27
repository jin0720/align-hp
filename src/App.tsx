import { useEffect, useState } from 'react';
import { MessageCircle, Clock, User, CheckCircle, Heart, Activity, MapPin, Menu, X } from 'lucide-react';
import { BookingFlow } from './booking';
import { useLang } from './i18n/LanguageContext';
import { Rich } from './i18n/Rich';
import { massageListPrices } from './pricing';

function PriceDisplay({ original }: { original: number }) {
  return <span className="price-amount">¥{original.toLocaleString()}</span>;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, lang, setLang } = useLang();
  const massagePrices = massageListPrices();
  
  // ── ルーティング判定 ────────────────────────────────────
  const isBookingPage = window.location.pathname.startsWith('/booking');

  // Mini App ページの場合
  if (isBookingPage) {
    return <BookingFlow />;
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    // LINEリッチメニュー等からの直接リンク（#〇〇）に対応するための自動スクロール処理
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // 描画処理を待ってから少し遅れてスクロールさせる
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="dark-header">
        <div className="logo-wrap">
          <img src="/images/align-logo.png" alt="Align" className="header-logo" />
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={t.nav.toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`header-nav ${isMenuOpen ? 'is-open' : ''}`}>
          <ul>
            <li><a href="#concept" onClick={(e) => { e.preventDefault(); scrollTo('concept'); }}>{t.nav.concept}</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>{t.nav.features}</a></li>
            <li><a href="#price" onClick={(e) => { e.preventDefault(); scrollTo('price'); }}>{t.nav.price}</a></li>
            <li><a href="#profile" onClick={(e) => { e.preventDefault(); scrollTo('profile'); }}>{t.nav.profile}</a></li>

            <li><a href="#access" onClick={(e) => { e.preventDefault(); scrollTo('access'); }}>{t.nav.access}</a></li>
          </ul>
          <a href="#contact" className="nav-reserve-btn" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>{t.nav.reserve}</a>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button type="button" className={lang === 'ja' ? 'is-active' : ''} onClick={() => setLang('ja')} translate="no">JA</button>
            <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')} translate="no">EN</button>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-bg hero-bg-1"></div>
        <div className="hero-bg hero-bg-2"></div>
        <div className="hero-bg hero-bg-3"></div>
        <div className="hero-overlay"></div>
        <div className="hero-center-group">
        <img src="/images/align-logo.png" alt="Align" className="hero-logo-img" />
        <div className="hero-content fade-in-section is-visible">
          <p className="hero-catchphrase">
            <Rich text={t.hero.catch} />
          </p>
          <p className="hero-subtext">
            <Rich text={t.hero.sub} />
          </p>
          <div className="hero-scroll" onClick={() => scrollTo('concept')}>
            <span>Scroll</span>
            <div className="scroll-line"></div>
          </div>
        </div>
        </div>
      </section>

      <section id="concept" className="section-padding dark-section concept-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Concept</h2>
              <p className="subtitle"><Rich text={t.concept.subtitle} /></p>
            </div>
            
            <div className="concept-wrapper">
              <div className="concept-images-grid">
                <img src="/images/new/IMG_1227.jpg" alt="Concept 1" className="concept-img-main rounded-img shadow-lg filter-dark" loading="lazy" />
                <div className="concept-img-sub-row">
                  <img src="/images/new/IMG_2228.jpg" alt="Concept 2" className="rounded-img shadow-lg filter-dark" loading="lazy" />
                  <img src="/images/new/IMG_2250.jpg" alt="Concept 3" className="rounded-img shadow-lg filter-dark" loading="lazy" />
                </div>
              </div>
              <div className="concept-text">
                <h3><Rich text={t.concept.heading} /></h3>
                <p>{t.concept.p1}</p>
                <p>{t.concept.p2}</p>
                
                <ul className="concept-features">
                  <li><CheckCircle className="icon-gold" size={20}/> {t.concept.f1}</li>
                  <li><CheckCircle className="icon-gold" size={20}/> {t.concept.f2}</li>
                  <li><CheckCircle className="icon-gold" size={20}/> {t.concept.f3}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-padding light-section about-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>LGBTQ Friendly</h2>
              <p className="subtitle"><Rich text={t.about.subtitle} /></p>
            </div>
            
            <div className="about-content">
              <div className="about-text-center">
                <h3 className="elegant-heading"><Rich text={t.about.heading} /></h3>
                <p className="elegant-body">
                  {t.about.p1Pre}<strong>{t.about.p1Strong}</strong><Rich text={t.about.p1Post} />
                </p>
                <p className="elegant-body mt-4">
                  <Rich text={t.about.p2} />
                </p>
              </div>
              
              <div className="about-cards-row">
                <div className="about-card">
                  <Heart className="about-icon" size={32} />
                  <h4>{t.about.card1Title}</h4>
                  <p>{t.about.card1Text}</p>
                </div>
                <div className="about-card">
                  <Activity className="about-icon" size={32} />
                  <h4>{t.about.card2Title}</h4>
                  <p>{t.about.card2Text}</p>
                </div>
                <div className="about-card">
                  <User className="about-icon" size={32} />
                  <h4>{t.about.card3Title}</h4>
                  <p>{t.about.card3Text}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="price" className="section-padding light-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Menu & Price</h2>
              <p className="subtitle">{t.price.subtitle}</p>
            </div>
            
            <div className="menu-grid">
              {/* Relaxation Courses */}
              <div className="menu-category">
                <h3 className="category-title">Deep Relaxation</h3>
                <p className="category-desc">{t.price.oilDesc}</p>
                
                <div className="price-card elegant-card">
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> {t.min(70)}
                      <span className="course-name">{t.price.oil70}</span>
                    </div>
                    <div className="price-amount-wrap">
                      <PriceDisplay original={massagePrices[70]} />
                    </div>
                  </div>
                  <div className="price-item recommended">
                    <div className="badge-rec">POPULAR</div>
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> {t.min(100)}
                      <span className="course-name">{t.price.oil100}</span>
                    </div>
                    <div className="price-amount-wrap">
                      <PriceDisplay original={massagePrices[100]} />
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> {t.min(130)}
                      <span className="course-name">{t.price.oil130}</span>
                    </div>
                    <div className="price-amount-wrap">
                      <PriceDisplay original={massagePrices[130]} />
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> {t.min(160)}
                      <span className="course-name">{t.price.oil160}</span>
                    </div>
                    <div className="price-amount-wrap">
                      <PriceDisplay original={massagePrices[160]} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Training Courses */}
              <div className="menu-category">
                <h3 className="category-title">Personal Training</h3>
                <p className="category-desc">{t.price.ptDesc}</p>
                <p className="category-offer">{t.price.ptOffer}</p>
                
                <div className="price-card elegant-card">
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> {t.min(60)}
                      <span className="course-name">{t.price.pt60}</span>
                    </div>
                    <div className="price-amount-wrap">
                      <PriceDisplay original={10000} />
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> {t.min(90)}
                      <span className="course-name">{t.price.pt90}</span>
                    </div>
                    <div className="price-amount-wrap">
                      <PriceDisplay original={13000} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="price-notes elegant-notes">
              <p>{t.price.note1}</p>
              <p>{t.price.note2}</p>
              <p>{t.price.note3}</p>
              <p>{t.price.note4}</p>
              <p>{t.price.note5}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="profile" className="section-padding dark-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Profile</h2>
              <p className="subtitle">{t.profile.subtitle}</p>
            </div>
            
            <div className="profile-wrapper-lux">
              <div className="profile-img-col">
                <img src="/images/new/IMG_1491.jpg" alt={t.profile.imgAlt} className="profile-main-img" loading="lazy" />
                <div className="profile-sub-images">
                   <img src="/images/new/IMG_9750 2.JPG" alt="Gallery 1" loading="lazy" />
                   <img src="/images/new/IMG_1525.JPG" alt="Gallery 2" loading="lazy" />
                </div>
              </div>
              
              <div className="profile-info-col">
                <div className="profile-name-box">
                  <h3 className="profile-name"><span className="inline-block" translate="no">{t.profile.name}</span> {t.profile.nameSub && <span className="profile-en" translate="no">{t.profile.nameSub}</span>}</h3>
                  <p className="profile-role">{t.profile.role}</p>
                </div>
                
                <div className="profile-detail-list">
                  <div className="detail-item">
                    <h4><span className="detail-dot"></span>{t.profile.careerTitle}</h4>
                    <p>{t.profile.career}</p>
                  </div>
                  <div className="detail-item">
                    <h4><span className="detail-dot"></span>{t.profile.sportsTitle}</h4>
                    <p>{t.profile.sports}</p>
                  </div>
                  <div className="detail-item">
                    <h4><span className="detail-dot"></span>{t.profile.hobbyTitle}</h4>
                    <p>{t.profile.hobby}</p>
                  </div>
                  
                  <div className="detail-item story-item mt-4">
                    <h4><span className="detail-dot"></span>{t.profile.storyTitle}</h4>
                    <p className="italic-text"><Rich text={t.profile.story} /></p>
                  </div>
                  
                  <div className="detail-item story-item message-box">
                    <h4><span className="detail-dot"></span>{t.profile.messageTitle}</h4>
                    <p><Rich text={t.profile.message} /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section id="access" className="section-padding dark-section access-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Salons</h2>
              <p className="subtitle">{t.access.subtitle}</p>
            </div>

            <div className="salons-container">
              {/* Treatment Salon */}
              <div className="salon-card">
                <div className="salon-image-wrap">
                  <img src="/images/new/IMG_2243.jpg" alt="Treatment space" loading="lazy" />
                </div>
                <div className="salon-card-body">
                  <div className="salon-card-header">
                    <div className="salon-tag">TREATMENT</div>
                    <h3>{t.access.treatmentTitle}</h3>
                  </div>
                  <div className="salon-list">
                    <div className="salon-item">
                      <MapPin className="icon-gold" size={18} />
                      <div className="salon-info">
                        <span className="station">{t.access.treatmentStation}</span>
                        <span className="walk">{t.access.treatmentWalk}</span>
                      </div>
                    </div>
                  </div>
                  <p className="salon-card-note">{t.access.treatmentNote}</p>
                </div>
              </div>

              {/* Training Gym */}
              <div className="salon-card silver">
                <div className="salon-image-wrap">
                  <img src="/images/new/IMG_2250.jpg" alt="Training space" loading="lazy" />
                </div>
                <div className="salon-card-body">
                  <div className="salon-card-header">
                    <div className="salon-tag">TRAINING</div>
                    <h3>{t.access.trainingTitle}</h3>
                  </div>
                  <div className="salon-list">
                    <div className="salon-item">
                      <MapPin className="icon-silver" size={18} />
                      <div className="salon-info">
                        <span className="station">{t.access.training1}</span>
                      </div>
                    </div>
                    <div className="salon-item">
                      <MapPin className="icon-silver" size={18} />
                      <div className="salon-info">
                        <span className="station">{t.access.training2}</span>
                      </div>
                    </div>
                    <div className="salon-item">
                      <MapPin className="icon-silver" size={18} />
                      <div className="salon-info">
                        <span className="station">{t.access.training3}</span>
                      </div>
                    </div>
                  </div>
                  <div className="salon-card-note" style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#8c8c8c'}}>
                    <p>{t.access.trainingNote}</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      <section id="contact" className="contact-section-lux">
        <div className="container">
          <div className="fade-in-section">
            <div className="contact-card-lux">
              <h2>Reservation</h2>
              <p className="contact-subtitle">{t.contact.subtitle}</p>
              
              <div className="contact-inner">
                <p className="contact-text">
                  <Rich text={t.contact.text} />
                </p>
                
                <div className="contact-buttons">
                  <a href="https://lin.ee/uYY4SNW" target="_blank" rel="noopener noreferrer" className="line-btn-lux" style={{ order: lang === 'en' ? 2 : 1 }}>
                    <MessageCircle size={24} />
                    {t.contact.button}
                  </a>
                  <a href="https://ig.me/m/jin_oilmassage" target="_blank" rel="noopener noreferrer" className="ig-btn-lux" style={{ order: lang === 'en' ? 1 : 2 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                    {t.contact.instagramButton}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-lux">
        <div className="container">
          <p className="footer-logo">Align</p>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Align. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
