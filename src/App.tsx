import { useEffect, useState } from 'react';
import { MessageCircle, Calendar, Clock, User, CheckCircle, Info, Heart, Activity, ArrowRight, MapPin, Menu, X } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div id="text-logo" className="logo">Align</div>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`header-nav ${isMenuOpen ? 'is-open' : ''}`}>
          <ul>
            <li><a href="#concept" onClick={(e) => { e.preventDefault(); scrollTo('concept'); }}>コンセプト</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>特徴</a></li>
            <li><a href="#schedule" onClick={(e) => { e.preventDefault(); scrollTo('schedule'); }}>空き状況</a></li>
            <li><a href="#price" onClick={(e) => { e.preventDefault(); scrollTo('price'); }}>料金案内</a></li>
            <li><a href="#profile" onClick={(e) => { e.preventDefault(); scrollTo('profile'); }}>プロフィール</a></li>

            <li><a href="#access" onClick={(e) => { e.preventDefault(); scrollTo('access'); }}>アクセス</a></li>
          </ul>
          <a href="#contact" className="nav-reserve-btn" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>オープン記念割引1000円OFFで予約</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-bg hero-bg-1"></div>
        <div className="hero-bg hero-bg-2"></div>
        <div className="hero-bg hero-bg-3"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in-section is-visible">
          <h1 id="text-main-logo" className="main-logo-text">Align</h1>
          <div className="hero-badge">
            【オープン記念】全コース1,000円OFFでご体験いただけます
          </div>
          <p className="hero-catchphrase">
            <span className="inline-block">身体をリセットし、明日を創る。</span>
          </p>
          <p className="hero-subtext">
            <span className="inline-block">オイルマッサージ・整体・パーソナルトレーニングで、</span><span className="inline-block">深呼吸できる健康的な身体へ──。</span>
          </p>
          <div className="hero-scroll" onClick={() => scrollTo('concept')}>
            <span>Scroll</span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </section>

      <section id="concept" className="section-padding dark-section concept-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Concept</h2>
              <p className="subtitle"><span className="inline-block">癒やしと健康的な身体作りを叶える、</span><span className="inline-block">完全プライベート空間</span></p>
            </div>
            
            <div className="concept-wrapper">
              <div className="concept-images-grid">
                <img src="/images/new/IMG_1227.jpg" alt="Concept 1" className="concept-img-main rounded-img shadow-lg filter-dark" />
                <div className="concept-img-sub-row">
                  <img src="/images/new/IMG_2228.jpg" alt="Concept 2" className="rounded-img shadow-lg filter-dark" />
                  <img src="/images/new/IMG_2250.jpg" alt="Concept 3" className="rounded-img shadow-lg filter-dark" />
                </div>
              </div>
              <div className="concept-text">
                <h3><span className="inline-block">癒やし、身体が整う、</span><span className="inline-block">健康的な身体作り。</span></h3>
                <p>Alignは、オイルマッサージや整体で体や心を癒やし、パーソナルトレーニングで理想の体作り、そして定期的な運動を通じて健康的な心と身体作りをトータルサポートするプライベート空間です。</p>
                <p>日々の生活で蓄積された疲労や身体の歪みを整え、深い癒やしを提供するだけでなく、お客様一人ひとりに合わせた健康的な身体作りまでサポートします。「癒やし」「身体が整う」「健康的な身体作り」を、誰の目も気にすることなくご堪能ください。</p>
                
                <ul className="concept-features">
                  <li><CheckCircle className="icon-gold" size={20}/> オイルマッサージ×整体×トレーニングの相乗効果</li>
                  <li><CheckCircle className="icon-gold" size={20}/> 一人ひとりの身体の状態や目標に合わせたオーダーメイドのメニュー</li>
                  <li><CheckCircle className="icon-gold" size={20}/> 誰とも顔を合わせない、あなただけの完全プライベート空間</li>
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
              <p className="subtitle"><span className="inline-block">性別問わず</span><span className="inline-block">どなたでも歓迎いたします</span></p>
            </div>
            
            <div className="about-content">
              <div className="about-text-center">
                <h3 className="elegant-heading"><span className="inline-block">心と身体をリセットする、</span><span className="inline-block">あなただけの完全プライベート空間</span></h3>
                <p className="elegant-body">
                  当サロンは、<strong>性別問わず対応・LGBTQフレンドリー</strong>なサロンです。<br className="pc-only"/>
                  <span className="inline-block">都会の喧騒や日々の役割に疲れきったあなたが、</span><span className="inline-block">誰の目も気にせずリラックスし、</span><br className="pc-only"/>
                  <span className="inline-block">ご自身の身体としっかり向き合える居場所を</span><span className="inline-block">提供いたします。</span>
                </p>
                <p className="elegant-body mt-4">
                  得意とする上質なオイルマッサージで深い癒やしをお届けするのはもちろん、身体の軸をリセットする整体から、健康的な身体作りを目指すパーソナルトレーニングまでを<span className="inline-block">一貫してサポートできるのがAlignの強みです。</span><br/>
                  一人ひとりのお悩みや目標に合わせたオーダーメイドのアプローチで、<span className="inline-block">あなたの明日への活力を引き出します。</span><br/>
                  初めての方も、運動に自信がない方も、どうか安心して身を預けてください。<br/>
                  ここに来ると心も身体も前向きになれる、そんなあなたのお気に入りになれたら嬉しいです。
                </p>
              </div>
              
              <div className="about-cards-row">
                <div className="about-card">
                  <Heart className="about-icon" size={32} />
                  <h4>オイルマッサージ×整体</h4>
                  <p>身体の軸をリセットする本格的な「整体」と、心身の深い緊張まで解きほぐす「オイルマッサージ」の相乗効果で、極上の癒やしとリカバリーを提供します。</p>
                </div>
                <div className="about-card">
                  <Activity className="about-icon" size={32} />
                  <h4>パーソナルトレーニング</h4>
                  <p>整った身体をベースに、一人ひとりの目標に合わせたトレーニングを実施。理想のボディメイクや、健康的で疲れにくい身体作りをマンツーマンでサポートします。</p>
                </div>
                <div className="about-card">
                  <User className="about-icon" size={32} />
                  <h4>完全プライベート空間</h4>
                  <p>誰とも顔を合わせることのない完全個室。周りの目を一切気にすることなく、あなたのためだけの「癒やし」と「身体作り」の時間に没頭していただけます。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="section-padding dark-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Schedule</h2>
              <p className="subtitle">空き状況</p>
            </div>
            <div className="schedule-card-dark">
              <p className="schedule-info text-light-on-dark">
                <Calendar className="icon-inline" size={20}/> <span className="inline-block">空き状況は、</span><span className="inline-block">随時カレンダーにて</span><span className="inline-block">ご案内しております。</span><br className="pc-only"/>
                <span className="inline-block">当日の急なご予約希望や</span><span className="inline-block">お時間のご相談も、</span><span className="inline-block">お気軽にお問い合わせください。</span>
              </p>
              <div className="calendar-wrapper">
                {/* Overlay text for Google Calendar on dark mode if needed, but wrapper is white */}
                <iframe 
                  src="https://calendar.google.com/calendar/embed?src=chilltime0720%40gmail.com&color=%238C7A6B&ctz=Asia%2FTokyo&showTitle=0&showNav=1&showDate=1&showTabs=0&showCalendars=0" 
                  style={{ border: "0" }} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no"
                  title="空き状況カレンダー"
                ></iframe>
              </div>
              <div className="cal-notice text-center mt-5">
                <p className="text-light-on-dark mb-4">お問い合わせ・ご予約は公式LINEから承ります</p>
                <a href="https://line.me/R/ti/p/@782majcy?ts=04242132&oat_content=url" target="_blank" rel="noopener noreferrer" className="btn-gold">
                  LINEで予約する <ArrowRight size={16} className="icon-inline" style={{marginLeft: '5px'}}/>
                </a>
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
              <p className="subtitle">メニュー・料金案内</p>
            </div>
            
            <div className="menu-grid">
              {/* Relaxation Courses */}
              <div className="menu-category">
                <h3 className="category-title">Deep Relaxation</h3>
                <p className="category-desc">深層筋ストレッチ＆リラクゼーションマッサージ</p>
                
                <div className="price-card elegant-card">
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 70分
                      <span className="course-name">全身の緊張をゆるめ、心身ともに深くリラックス</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥10,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥9,000</span>
                    </div>
                  </div>
                  <div className="price-item recommended">
                    <div className="badge-rec">POPULAR</div>
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 100分
                      <span className="course-name">圧倒的な密着感で、日々のコリや疲れを丁寧に癒やす（人気No.1）</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥13,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥12,000</span>
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 130分
                      <span className="course-name">贅沢なロングコースで、全身が解きほぐされる至福のとき</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥16,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥15,000</span>
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 160分
                      <span className="course-name">溜まりきった疲れも、時間をかけて徹底的にリフレッシュ</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥19,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥18,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Training Courses */}
              <div className="menu-category">
                <h3 className="category-title">Personal Training</h3>
                <p className="category-desc">一人ひとりの目標に合わせたマンツーマン指導</p>
                
                <div className="price-card elegant-card">
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 60分
                      <span className="course-name">基礎体力の向上からボディメイクまで</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥10,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥9,000</span>
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 90分
                      <span className="course-name">しっかり追い込みたい方・じっくりフォームを学びたい方へ</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥13,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥12,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="price-notes elegant-notes">
              <p>※当店はリラクゼーションを目的としたサロンであり、治療行為（あん摩・マッサージ・指圧等）ではありませんのでご了承ください。</p>
              <p>※リラクゼーションを目的とした施術のため、性的サービス及びそれに伴う行為は一切行っておりません。ご理解いただけますようお願いいたします。</p>
              <p>※料金はすべて税込価格です。</p>
              <p>※キャンセル料：前日23時まで無料、それ以降（当日キャンセル）は全額を頂戴いたします。</p>
              <p>※お支払いは現金、PayPay（個人の送金）、または銀行振込がご利用いただけます。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="profile" className="section-padding dark-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Profile</h2>
              <p className="subtitle">セラピスト紹介</p>
            </div>
            
            <div className="profile-wrapper-lux">
              <div className="profile-img-col">
                <img src="/images/new/IMG_1491.jpg" alt="ジュン" className="profile-main-img" />
                <div className="profile-sub-images">
                   <img src="/images/new/IMG_9750 2.JPG" alt="Gallery 1" />
                   <img src="/images/new/IMG_1525.JPG" alt="Gallery 2" />
                </div>
              </div>
              
              <div className="profile-info-col">
                <div className="profile-name-box">
                  <h3 className="profile-name"><span className="inline-block">神 享史</span> <span className="profile-en">Yukihito Jin</span></h3>
                  <p className="profile-role">メンズセラピスト / パーソナルトレーナー</p>
                </div>
                
                <div className="profile-detail-list">
                  <div className="detail-item">
                    <h4><span className="detail-dot"></span>経歴・資格</h4>
                    <p>骨膜整体、姿勢改善学校卒業、アロマオイルマッサージ学校卒業、NESTAトレーナー資格保有</p>
                  </div>
                  <div className="detail-item">
                    <h4><span className="detail-dot"></span>スポーツ歴</h4>
                    <p>バスケットボール、テニス、水泳、バドミントン</p>
                  </div>
                  <div className="detail-item">
                    <h4><span className="detail-dot"></span>趣味・休日の過ごし方</h4>
                    <p>筋トレ、カフェでゆっくり、漫画、読書、スイーツ巡り、美味しいご飯とお酒、銭湯・サウナ</p>
                  </div>
                  
                  <div className="detail-item story-item mt-4">
                    <h4><span className="detail-dot"></span>トレーナー×セラピストになったきっかけ</h4>
                    <p className="italic-text"><span className="inline-block">「人々が心から安らぎ、</span><span className="inline-block">すべてを預けられる</span><span className="inline-block">『癒しの場』を作りたい。」</span><br/>
                    <span className="inline-block">自分自身も筋トレやスポーツを通じて</span><span className="inline-block">身体の構造と向き合っていく中で、</span><br className="pc-only"/>
                    <span className="inline-block">肉体的な疲労だけでなく、</span><span className="inline-block">精神的なストレスがいかに体に</span><span className="inline-block">重く影響するかを痛感しました。</span><br/>
                    <span className="inline-block">だからこそ、運動でしなやかな身体を作る</span><span className="inline-block">「トレーニング」と、</span><br className="pc-only"/>
                    <span className="inline-block">心身の緊張をリセットする</span><span className="inline-block">「オイルマッサージ・整体」の両面から、</span><br className="pc-only"/>
                    <span className="inline-block">トータルでお客様をサポートできる存在になりたいと強く願い、</span><span className="inline-block">この道を歩み始めました。</span></p>
                  </div>
                  
                  <div className="detail-item story-item message-box">
                    <h4><span className="detail-dot"></span>お客様へのメッセージ</h4>
                    <p><span className="inline-block">毎日頑張るあなたへ。</span><br/>
                    <span className="inline-block">Alignは、</span><span className="inline-block">性別を問わずすべての方が日常の疲れを忘れ、</span><span className="inline-block">ご自身の身体と大切に向き合える</span><span className="inline-block">場所でありたいと考えています。</span><br/>
                    <span className="inline-block">「深く癒やされたい」「不調を整えたい」</span><span className="inline-block">「理想の身体を作りたい」といった、</span><br className="pc-only"/>
                    <span className="inline-block">一人ひとりの異なる目的に寄り添い、</span><span className="inline-block">マンツーマンでしっかりとサポートいたします。</span><br/>
                    <span className="inline-block">初めての方や、運動に自信がない方も</span><span className="inline-block">どうぞ安心してお越しください。</span><br className="pc-only"/>
                    <span className="inline-block">私の確かな技術と知識で、</span><span className="inline-block">あなたの心と身体を全力でケアし、</span><span className="inline-block">明日への活力を引き出します。</span><br/>
                    <span className="inline-block">お会いできる日を</span><span className="inline-block">心よりお待ちしております。</span></p>
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
              <p className="subtitle">施術場所のご案内</p>
            </div>

            <div className="salons-container">
              {/* Treatment Salon */}
              <div className="salon-card">
                <div className="salon-image-wrap">
                  <img src="/images/new/IMG_2243.jpg" alt="Treatment space" />
                </div>
                <div className="salon-card-body">
                  <div className="salon-card-header">
                    <div className="salon-tag">TREATMENT</div>
                    <h3>施術場所</h3>
                  </div>
                  <div className="salon-list">
                    <div className="salon-item">
                      <MapPin className="icon-gold" size={18} />
                      <div className="salon-info">
                        <span className="station">東高円寺駅</span>
                        <span className="walk">徒歩3分</span>
                      </div>
                    </div>
                  </div>
                  <p className="salon-card-note">※プライベートサロンのため、詳細な住所はご予約確定後にお送りいたします。</p>
                </div>
              </div>

              {/* Training Gym */}
              <div className="salon-card silver">
                <div className="salon-image-wrap">
                  <img src="/images/new/IMG_2250.jpg" alt="Training space" />
                </div>
                <div className="salon-card-body">
                  <div className="salon-card-header">
                    <div className="salon-tag">TRAINING</div>
                    <h3>トレーニング場所</h3>
                  </div>
                  <div className="salon-list">
                    <div className="salon-item">
                      <MapPin className="icon-silver" size={18} />
                      <div className="salon-info">
                        <span className="station">中野 / 新中野 / 西新宿 / 西新宿五丁目</span>
                      </div>
                    </div>
                  </div>
                  <div className="salon-card-note" style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#8c8c8c'}}>
                    <p>※ご希望の店舗がない場合は「中野」をご案内させていただきます。</p>
                    <p>※レンタルジムを使用するため、予約状況によりエリアのご希望に添えない場合がございます。</p>
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
              <p className="contact-subtitle">ご予約・お問い合わせ</p>
              
              <div className="contact-inner">
                <p className="contact-text">
                  <span className="inline-block">当サロンは完全予約制の</span><span className="inline-block">プライベート空間です。</span><br/>
                  <span className="inline-block">ご予約やスケジュールのご相談、</span><span className="inline-block">空き状況の確認などがございましたら、</span><br/>
                  <span className="inline-block">公式LINEよりお気軽にご連絡ください。</span><br/><br/>
                  <small className="inline-block">※施術中はご返信が遅れる場合がございますが、</small><small className="inline-block">必ず折り返しご連絡いたします。</small>
                </p>
                
                <a href="https://lin.ee/uYY4SNW" target="_blank" rel="noopener noreferrer" className="line-btn-lux">
                  <MessageCircle size={24} />
                  オープン記念割引1000円OFF｜LINEで予約する
                </a>
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
