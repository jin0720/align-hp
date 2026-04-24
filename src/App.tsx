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
            <li><a href="#flow" onClick={(e) => { e.preventDefault(); scrollTo('flow'); }}>ご利用の流れ</a></li>
            <li><a href="#access" onClick={(e) => { e.preventDefault(); scrollTo('access'); }}>アクセス</a></li>
          </ul>
          <a href="#contact" className="nav-reserve-btn" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>初回1,000円OFFで予約</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in-section is-visible">
          <h1 id="text-main-logo" className="main-logo-text">Align</h1>
          <div className="hero-badge">
            【初回限定】全コース1,000円OFFでご体験いただけます
          </div>
          <p className="hero-catchphrase">
            <span className="inline-block">体を元気にして、</span><br className="pc-only" />
            <span className="inline-block">整えていく。</span>
          </p>
          <p className="hero-subtext">
            <span className="inline-block">オイルマッサージ＆整体で、</span><span className="inline-block">深呼吸できる身体へ──。</span>
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
              <p className="subtitle"><span className="inline-block">心身を解き放つ、</span><span className="inline-block">唯一無二のアプローチ</span></p>
            </div>
            
            <div className="concept-wrapper">
              <div className="concept-images">
                <img src="/images/hero_main.jpg" alt="Atmosphere" className="rounded-img shadow-lg filter-dark" />
              </div>
              <div className="concept-text">
                <h3><span className="inline-block">体を元気にして、</span><span className="inline-block">整えていく。</span></h3>
                <p>Alignは、オイルマッサージと整体を融合させ、心身のバランスを根本から整えるプライベートサロンです。</p>
                <p>日々の生活で蓄積された疲労や身体の歪みを、丁寧な整体アプローチで整えながら、香り高いアロマオイルで深いリラクゼーションへと導きます。ただほぐすだけでなく、「体を元気にして、本来の心地よい状態へ整えていく」ことを大切にしています。</p>
                
                <ul className="concept-features">
                  <li><CheckCircle className="icon-gold" size={20}/> 整体×オイルマッサージの相乗効果で深部の疲れにアプローチ</li>
                  <li><CheckCircle className="icon-gold" size={20}/> 一人ひとりの身体の状態に合わせたオーダーメイドの施術</li>
                  <li><CheckCircle className="icon-gold" size={20}/> 白と緑を基調とした、深呼吸したくなるリラックス空間</li>
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
                <h3 className="elegant-heading"><span className="inline-block">すべてを委ねられる、</span><span className="inline-block">あなただけの「特別な隠れ家」</span></h3>
                <p className="elegant-body">
                  当サロンは、<strong>性別問わず対応・LGBTQフレンドリー</strong>なサロンです。<br className="pc-only"/>
                  <span className="inline-block">「癒やされながらちょっとドキドキしたい」</span><span className="inline-block">「信頼できるセラピストに丁寧に触れてほしい」</span><br className="pc-only"/>
                  <span className="inline-block">都会の喧騒や日々の役割に疲れきったあなたが、</span><span className="inline-block">誰の目も気にせず「主役」になれる居場所です。</span>
                </p>
                <p className="elegant-body mt-4">
                  普段は張り詰めている緊張も、肌と肌の温もりが重なる密着リラクゼーションを通じて奥深くから解きほぐしていきます。<br/>
                  「ドキドキ」と「安心感」の絶妙なバランスを大切に、一人ひとりの好みに合わせた心地よい距離感で施術を行います。<br/>
                  初めての方も、どうか安心して身を預けてください。<br/>
                  ここに来ると心が満たされる、そんなあなたのお気に入りになれたら嬉しいです。
                </p>
              </div>
              
              <div className="about-cards-row">
                <div className="about-card">
                  <Heart className="about-icon" size={32} />
                  <h4>圧倒的な密着とシンクロ</h4>
                  <p>セラピストの体温を直接感じるようなゼロ距離の施術。言葉にしなくても伝わる深い癒やしと、少しの背徳感をもたらします。</p>
                </div>
                <div className="about-card">
                  <Activity className="about-icon" size={32} />
                  <h4>深層へ溶け込むアプローチ</h4>
                  <p>単なるもみほぐしではなく、筋肉の流れを滑らかに整え、体の芯からとろけるような深いリカバリーを生み出します。</p>
                </div>
                <div className="about-card">
                  <User className="about-icon" size={32} />
                  <h4>完全なるシークレット空間</h4>
                  <p>誰とも顔を合わせることのないプライベート個室。普段は言えないご要望やわがままも、ここだけでこっそりお伝えください。</p>
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
                <a href="https://lin.ee/TJpea3W" target="_blank" rel="noopener noreferrer" className="btn-gold">
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
              <p className="price-header-notice">
                <span className="inline-block">ご来店でのご利用につきましては、</span><span className="inline-block">別途個室料やオプション料金は</span><span className="inline-block">かかりません。</span><br className="pc-only"/>
                <span className="inline-block">表記のコース料金のみで、</span><span className="inline-block">安心して施術をお楽しみいただけます。</span>
              </p>
            </div>
            
            <div className="menu-grid">
              {/* Relaxation Courses */}
              <div className="menu-category">
                <h3 className="category-title">Deep Relaxation</h3>
                <p className="category-desc">深層筋ストレッチ＆リラクゼーションマッサージ</p>
                
                <div className="price-card elegant-card">
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 45分
                      <span className="course-name">気になる箇所を重点的にほぐすクイックケア</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥10,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥9,000</span>
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 70分
                      <span className="course-name">全身の緊張をゆるめ、心身ともに深くリラックス</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥13,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥12,000</span>
                    </div>
                  </div>
                  <div className="price-item recommended">
                    <div className="badge-rec">POPULAR</div>
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 100分
                      <span className="course-name">圧倒的な密着感で、日々のコリや疲れを丁寧に癒やす（人気No.1）</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥17,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥16,000</span>
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 130分
                      <span className="course-name">贅沢なロングコースで、全身が解きほぐされる至福のとき</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥20,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥19,000</span>
                    </div>
                  </div>
                  <div className="price-item">
                    <div className="price-time">
                      <Clock size={18} className="icon-gold"/> 160分
                      <span className="course-name">溜まりきった疲れも、時間をかけて徹底的にリフレッシュ</span>
                    </div>
                    <div className="price-amount-wrap">
                      <span className="price-original">通常 ¥23,000</span>
                      <span className="price-amount"><span className="price-first-time">初回</span>¥22,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outcall Service */}
              <div className="menu-category">
                <h3 className="category-title">Outcall / Visit</h3>
                <p className="category-desc">ご自宅やホテルへの出張施術（交通費込・24時間受付）</p>
                
                <div className="price-card elegant-card">
                  <div className="visit-fee-content">
                    <p className="visit-guide">
                      中野駅からの移動時間（Googleマップでの経路検索基準）に基づいた出張料金を頂戴いたします。
                    </p>
                    <div className="visit-fee-table">
                      <div className="fee-row"><span>片道20分以内</span><span>+¥1,000</span></div>
                      <div className="fee-row"><span>片道40分以内</span><span>+¥2,000</span></div>
                      <div className="fee-row"><span>片道60分以内</span><span>+¥3,000</span></div>
                      <div className="fee-row consult"><span>60分以上</span><span>応相談</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="price-notes elegant-notes">
              <p>※当店はリラクゼーションを目的としたサロンであり、治療行為（あん摩・マッサージ・指圧等）ではありませんのでご了承ください。</p>
              <p>※リラクゼーションを目的とした施術のため、性的サービス及びそれに伴う行為は一切行っておりません。ご理解いただけますようお願いいたします。</p>
              <p>※料金はすべて税込価格です。出張料には往復の電車代が含まれます。</p>
              <p>※お客様の最寄駅よりご自宅まで徒歩10分以上の場合は、最寄り駅～ご自宅の往復タクシー代を頂戴いたします。</p>
              <p>※出張の際は、シーツ・タオル・オイル等はすべて持参いたします。お布団やマット、またはヨガマット2枚分程度のスペースをご用意ください。</p>
              <p>※ご来店（レンタルサロン利用）の場合、マッサージ専用の固定部屋はございません。シャワー完備のサロンをご案内いたします。なお、<strong>サロン場所が中野の場合は500円キャッシュバック</strong>いたします。</p>
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
                <img src="/images/processed/IMG_2183.jpg" alt="ジュン" className="profile-main-img" />
                <div className="profile-sub-images">
                   <img src="/images/processed/muscle_profile.jpg" alt="Gallery" />
                   <img src="/images/processed/sea_profile.jpg" alt="Gallery" />
                </div>
              </div>
              
              <div className="profile-info-col">
                <div className="profile-name-box">
                  <h3 className="profile-name"><span className="inline-block">ジュン</span> <span className="profile-en">Jun</span></h3>
                  <p className="profile-role">メンズセラピスト</p>
                </div>
                
                <div className="profile-detail-list">
                  <div className="detail-item">
                    <h4><span className="detail-dot"></span>経歴・資格</h4>
                    <p>現役の整体店勤務、アロマオイルマッサージ学校卒業、トレーナー資格保有。お身体の構造を熟知した確かな技術で、深い癒やしを提供します。</p>
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
                    <h4><span className="detail-dot"></span>セラピストになったきっかけ</h4>
                    <p className="italic-text"><span className="inline-block">「人々が心から安らぎ、</span><span className="inline-block">すべてを預けられる</span><span className="inline-block">『癒しの場』を作りたい。」</span><br/>
                    <span className="inline-block">自分自身も筋トレやスポーツを通じて</span><span className="inline-block">身体の構造と向き合っていく中で、</span><br className="pc-only"/>
                    <span className="inline-block">肉体的な疲労だけでなく、</span><span className="inline-block">精神的なストレスがいかに体に</span><span className="inline-block">重くのしかかるかを痛感しました。</span><br/>
                    <span className="inline-block">その重い鎧を脱がせ、</span><span className="inline-block">心から解きほぐすことができる</span><span className="inline-block">セラピストでありたいと強く願い、</span><span className="inline-block">この道を歩み始めました。</span></p>
                  </div>
                  
                  <div className="detail-item story-item message-box">
                    <h4><span className="detail-dot"></span>お客様へのメッセージ</h4>
                    <p><span className="inline-block">毎日頑張るあなたへ。</span><br/>
                    <span className="inline-block">Alignは、</span><span className="inline-block">性別を問わずすべての方が、</span><br className="pc-only"/>
                    <span className="inline-block">一時でも日常の重い鎧を脱ぎ捨てて</span><span className="inline-block">"本来の自分"に戻れる空間を</span><span className="inline-block">目指しています。</span><br/>
                    <span className="inline-block">初めてでご不安な方も、</span><span className="inline-block">安心してお越しください。</span><br className="pc-only"/>
                    <span className="inline-block">私の手の温もりと全力の施術で、</span><span className="inline-block">あなたの明日への活力を引き出します。</span><br/>
                    <span className="inline-block">お会いできる日を</span><span className="inline-block">心よりお待ちしております。</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="section-padding light-section">
        <div className="container">
          <div className="fade-in-section">
            <div className="section-header">
              <h2>Flow</h2>
              <p className="subtitle">ご利用の流れ</p>
            </div>
            
            <div className="flow-container-elegant">
              <div className="flow-step-elegant">
                <div className="step-number">01</div>
                <div className="step-content">
                  <h4>ご予約</h4>
                  <p>
                    公式LINEよりご希望の<br/>
                    ・日時<br/>
                    ・コース<br/>
                    ・店舗<br/>
                    ・出張先（最寄駅）<br/>
                    をお送りください。ご案内等をお送りいたします。
                  </p>
                </div>
              </div>
              <div className="flow-step-elegant">
                <div className="step-number">02</div>
                <div className="step-content">
                  <h4>お会計</h4>
                  <p>施術の前に、コース料金のお支払いをお願いしております。現金、PayPay、または銀行振込をご利用いただけます。</p>
                </div>
              </div>
              <div className="flow-step-elegant">
                <div className="step-number">03</div>
                <div className="step-content">
                  <h4>施術前（準備）</h4>
                  <p>お疲れの箇所やご要望（力加減や触れてほしくない箇所など）を丁寧に伺います。カウンセリングが終了しましたら、ボディシートで体を拭いていただくか、またはシャワーを浴びていただきます。香りの「あり・なし」のオイルをご用意しておりますので、ご気分に合わせてお選びいただけます。</p>
                </div>
              </div>
              <div className="flow-step-elegant">
                <div className="step-number">04</div>
                <div className="step-content">
                  <h4>極上の施術</h4>
                  <p>セラピストの温もりと吐息を間近に感じる、圧倒的な密着感。ゆったりとしたリズムで、体の芯からとろけるような濃密なアプローチを行います。理性も緊張もすべて解き放ち、心身が重なり合う至福のひとときにただ身を委ねてください。</p>
                </div>
              </div>
              <div className="flow-step-elegant">
                <div className="step-number">05</div>
                <div className="step-content">
                  <h4>施術後</h4>
                  <p>オイルをシャワーで流す、またはホットタオルで拭き取っていただき、お着替えをしていただきます。</p>
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
              {/* With Shower */}
              <div className="salon-card">
                <div className="salon-card-header">
                  <div className="salon-tag">SHOWER</div>
                  <h3>シャワー完備</h3>
                </div>
                <div className="salon-list">
                  <div className="salon-item">
                    <MapPin className="icon-gold" size={18} />
                    <div className="salon-info">
                      <span className="station">高円寺駅</span>
                      <span className="walk">徒歩1分</span>
                    </div>
                  </div>
                  <div className="salon-item">
                    <MapPin className="icon-gold" size={18} />
                    <div className="salon-info">
                      <span className="station">新大久保駅</span>
                      <span className="walk">徒歩3〜4分</span>
                    </div>
                  </div>
                  <div className="salon-item">
                    <MapPin className="icon-gold" size={18} />
                    <div className="salon-info">
                      <span className="station">荻窪駅</span>
                      <span className="walk">徒歩1〜3分</span>
                    </div>
                  </div>
                  <div className="salon-item">
                    <MapPin className="icon-gold" size={18} />
                    <div className="salon-info">
                      <span className="station">新宿三丁目駅</span>
                      <span className="walk">徒歩5分</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Shower */}
              <div className="salon-card silver">
                <div className="salon-card-header">
                  <div className="salon-tag">BODY SHEET</div>
                  <h3>シャワーなし</h3>
                </div>
                <div className="salon-list">
                  <div className="salon-item">
                    <MapPin className="icon-silver" size={18} />
                    <div className="salon-info">
                      <span className="station"><span className="inline-block">中野駅 徒歩3分</span> / <span className="inline-block">新中野駅 徒歩7分</span></span>
                    </div>
                  </div>
                </div>
                <p className="salon-card-note">※ボディーシート・ホットタオルをご用意しております。また、こちらのサロンをご利用の場合は<strong>500円キャッシュバック</strong>いたします。</p>
              </div>
            </div>

            <div className="access-notice-box">
              <Info className="icon-gold" size={20} />
              <p>ご希望の施術場所を指定してご連絡ください。<br/><span>（サロンの予約状況によりご希望に添えない場合は、他の店舗を提案させていただきます）</span></p>
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
                
                <a href="https://lin.ee/TJpea3W" target="_blank" rel="noopener noreferrer" className="line-btn-lux">
                  <MessageCircle size={24} />
                  初回1,000円OFF ｜ LINEで予約・相談する
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
