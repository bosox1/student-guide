import { useEffect, useRef, useState } from 'react'
import {
  navLinks,
  quickLinks,
  locationsMenu,
  corpusesGallery,
  corpusesList,
  houses,
  cafes,
  mentalHealth,
  grants,
  departments,
  university,
} from './data.js'
import Icon from './Icons.jsx'
import { Reveal } from './reveal.jsx'
import StartSection from './StartSection.jsx'

const ext = { target: '_blank', rel: 'noreferrer' }

function Entry({ index, id, title, address, image, children, links }) {
  return (
    <Reveal as="article" id={id} className="entry">
      <div className="entry__tab">
        <span className="entry__index">{index}</span>
      </div>
      <div className="entry__body">
        {image && (
          <div className="entry__image">
            <img src={image} alt={title} loading="lazy" />
          </div>
        )}
        <div className="entry__content">
          <h3 className="entry__title">{title}</h3>
          {address && <p className="entry__address">{address}</p>}
          {children}
          {links && links.length > 0 && (
            <div className="entry__links">
              {links.map((l) => (
                <a key={l.href} href={l.href} {...ext}>
                  {l.label} <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  )
}

/** Subtle parallax for the hero collage. Disabled for reduced motion. */
function useParallax() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900)
        el.style.setProperty('--py', `${y}`)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}

function Hero() {
  const collage = useParallax()
  return (
    <section className="hero">
      <div className="hero__copy">
        <div className="hero__eyebrow">
          <span className="hero__pulse" aria-hidden="true" />
          Довідник студента · ІФНМУ
        </div>
        <h1 className="hero__title">
          <span className="hero__line">
            <span>Student</span>
          </span>
          <span className="hero__line">
            <span>
              <em>guide</em>
            </span>
          </span>
        </h1>
        <p className="hero__text">
          Практичний путівник для першокурсників Івано-Франківського національного медичного університету та
          Фахового медичного коледжу, а також для всіх студентів, які хочуть краще орієнтуватися в
          університетському житті, користуватися цифровими сервісами й відкривати для себе нові можливості для
          навчання, розвитку та самореалізації.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#start">
            Мій старт в ІФНМУ <Icon name="arrow" size={18} />
          </a>
          <a className="btn btn--ghost" href="#locations">
            Локації університету
          </a>
        </div>
      </div>

      <div className="hero__visual" ref={collage} aria-hidden="true">
        <figure className="ph ph--a">
          <img src="/img/corpuse1.jpg" alt="" />
        </figure>
        <figure className="ph ph--b">
          <img src="/img/library2.jpg" alt="" />
        </figure>
        <figure className="ph ph--c">
          <img src="/img/corpuse2.jpg" alt="" />
        </figure>
        <div className="stamp">
          <svg viewBox="0 0 120 120">
            <defs>
              <path id="stampCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text>
              <textPath href="#stampCircle" textLength="286" lengthAdjust="spacing">STUDENT GUIDE · ІФНМУ · З 1945 · </textPath>
            </text>
          </svg>
          <img src="/img/ifnmu-mark.svg" alt="" />
        </div>
      </div>

      <nav className="quick" aria-label="Швидкий доступ">
        {quickLinks.map((q, i) => (
          <a key={q.href} href={q.href} {...ext} className="quick__item" style={{ '--i': i }}>
            <span className="quick__icon">
              <Icon name={q.icon} size={22} />
            </span>
            <span className="quick__text">
              <strong>{q.label}</strong>
              <small>{q.hint}</small>
            </span>
            <Icon name="external" size={15} className="quick__ext" />
          </a>
        ))}
      </nav>
    </section>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAllCorpuses, setShowAllCorpuses] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visibleCorpuses = showAllCorpuses ? corpusesList : corpusesList.slice(0, 6)
  const year = new Date().getFullYear()

  return (
    <div className="page">
      <a className="skip" href="#main">
        Перейти до змісту
      </a>

      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <a className="logo" href="#top" aria-label="Student Guide ІФНМУ — на початок">
          <img src="/img/ifnmu-mark.svg" alt="" width="26" height="33" />
          <span className="logo__text">
            <span>Student Guide</span>
            <small>ІФНМУ</small>
          </span>
        </a>

        <nav className={`nav${menuOpen ? ' nav--open' : ''}`} aria-label="Головне меню">
          {navLinks.map((link) => (
            <a key={link.label} className="nav__link" href={link.href} {...ext} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="nav__cta" href="#start" onClick={() => setMenuOpen(false)}>
            Мій старт
          </a>
        </nav>

        <button
          className={`burger${menuOpen ? ' burger--open' : ''}`}
          aria-label="Меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <main id="top">
        <span id="main" />
        <Hero />

        <section className="index-section" id="locations">
          <div className="section-head">
            <span className="section-head__kicker">Мапа</span>
            <h2 className="index-section__title">Локації університету</h2>
          </div>
          <div className="index-tabs">
            {locationsMenu.map((item, i) => (
              <a key={item.href} className="index-tab" href={item.href}>
                <span className="index-tab__num">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <div className="entries">
          <Entry
            index="01"
            id="library"
            title="Бібліотека"
            address="м. Івано-Франківськ, вул. Галицька, 7а"
            image="/img/library2.jpg"
            links={[
              { label: 'Сайт бібліотеки', href: 'https://www.ifnmu.edu.ua/home/library/' },
              { label: 'Електронна бібліотека', href: 'https://dspace.ifnmu.edu.ua/home' },
              { label: 'GoogleMaps', href: 'https://goo.gl/maps/uwMHrBaqrHfiskuP6' },
            ]}
          />

          <Entry
            index="02"
            id="sport_compleks"
            title="Спортивний комплекс"
            address="м. Івано-Франківськ, вул. Целевича, 34"
            image="/img/sport_compleks2.jpg"
            links={[{ label: 'GoogleMaps', href: 'https://goo.gl/maps/NrN3JMdG4JDyLD6S8' }]}
          />

          <Entry
            index="03"
            id="clinik"
            title="Університетська клініка"
            address="м. Івано-Франківськ, вул. Короля Данила, 15"
            image="/img/clinic.jpg"
            links={[{ label: 'GoogleMaps', href: 'https://goo.gl/maps/UMmuVKSz8ZWVjN7V7' }]}
          >
            <p className="entry__note">
              Висококваліфіковані лікарі й сучасне обладнання — для вашого здоров'я. Студент, який захворів, для
              відпрацювання пропущених занять повинен мати медичну довідку встановленої форми, видану або завірену
              Університетською клінікою.
            </p>
          </Entry>

          <Reveal as="article" id="houses" className="entry entry--group">
            <div className="entry__tab">
              <span className="entry__index">04</span>
            </div>
            <div className="entry__body entry__body--group">
              <div className="entry__image">
                <img src="/img/house.jpg" alt="Гуртожитки" loading="lazy" />
              </div>
              <div className="entry__content">
                <h3 className="entry__title">Гуртожитки</h3>
                <ul className="entry__grouplist">
                  {houses.map((h) => (
                    <li key={h.href}>
                      <span>{h.label}</span>
                      <a href={h.href} {...ext}>
                        GoogleMaps →
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="entry__callout">
                  <Icon name="doc" size={18} />
                  <span>
                    Деталі про вартість, правила поселення і проживання в гуртожитках — на офіційній сторінці{' '}
                    <a href="https://www.ifnmu.edu.ua/home/public-information/student-trade-union/" {...ext}>
                      студентського профспілкового комітету
                    </a>
                    .
                  </span>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal as="article" id="corpuses" className="entry entry--wide">
            <div className="entry__tab">
              <span className="entry__index">05</span>
            </div>
            <div className="entry__body entry__body--wide">
              <h3 className="entry__title">Корпуси</h3>
              <div className="corpuses-mosaic">
                {corpusesGallery.map((c, i) => (
                  <figure
                    className={`corpuses-gallery__item corpuses-mosaic__${String.fromCharCode(97 + i)}`}
                    key={c.img}
                    tabIndex={0}
                  >
                    <img src={c.img} alt={c.label} loading="lazy" />
                    <figcaption className="corpuses-gallery__caption">
                      <span>{c.label}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <ul className="corpuses-list">
                {visibleCorpuses.map((c) => (
                  <li key={c.href + c.label} className="corpuses-list__item">
                    <Icon name="moodle" size={30} className="corpuses-list__icon" />
                    <span className="corpuses-list__label">{c.label}</span>
                    <a className="corpuses-list__btn" href={c.href} {...ext}>
                      Дивитися на GoogleMaps
                    </a>
                  </li>
                ))}
              </ul>
              {corpusesList.length > 6 && (
                <button className="show-more" onClick={() => setShowAllCorpuses((v) => !v)}>
                  {showAllCorpuses ? 'Згорнути список' : `Показати всі корпуси (${corpusesList.length})`}
                </button>
              )}
            </div>
          </Reveal>

          <Reveal as="article" id="cafes" className="entry entry--wide">
            <div className="entry__tab">
              <span className="entry__index">06</span>
            </div>
            <div className="entry__body entry__body--wide">
              <h3 className="entry__title">Студентські їдальні</h3>
              <p className="entry__note">
                Студентське життя дуже насичене: окрім навчання — спорт, вечори, майстер-класи, гуртки, театри,
                кіно, спілкування. Мережа студентських закладів харчування ІФНМУ — до ваших послуг.
              </p>
              <div className="cafes">
                {cafes.map((c, i) => (
                  <a key={c.href} className={`cafe cafe--${i + 1}`} href={c.href} {...ext}>
                    <span className="cafe__art" aria-hidden="true">
                      <Icon name={c.icon} size={44} strokeWidth={1.3} />
                    </span>
                    <span className="cafe__body">
                      <strong>{c.name}</strong>
                      <span className="cafe__addr">{c.address}</span>
                      <span className="cafe__go">
                        Маршрут <Icon name="arrow" size={15} />
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Entry
            index="07"
            id="museum"
            title="Музей"
            image="/img/museum.jpg"
            links={[
              {
                label: 'Читати більше',
                href: 'https://www.ifnmu.edu.ua/wp-content/uploads/2025/11/Кафедра-анатомії-людини.pdf',
              },
            ]}
          />
        </div>

        <Reveal as="section" className="mh rv" id="mental" aria-label="Центр ментального здоров'я">
          <div className="mh__art">
            <img src="/img/mental_health.jpg" alt="Центр ментального здоров'я ІФНМУ — «Подбай про себе!»" loading="lazy" />
          </div>
          <div className="mh__body">
            <span className="mh__eyebrow">Центр ментального здоров'я · ЗМІСТИ</span>
            <h2 className="mh__title">Подбай про себе</h2>
            <p>
              Відчуваєте втому, стрес або потребуєте підтримки? Центр ментального здоров'я ІФНМУ завжди поруч, щоб
              вислухати, підтримати й допомогти. Звертайтеся — разом ми знайдемо рішення!
            </p>
            <a className="btn btn--sage" href={mentalHealth.href} {...ext}>
              Записатися на консультацію <Icon name="arrow" size={18} />
            </a>
            <div className="mh__meta">
              <span>
                <Icon name="pin" size={16} /> {mentalHealth.address}
              </span>
              <a href={`tel:${mentalHealth.phone.replace(/[^\d+]/g, '')}`}>
                <Icon name="phone" size={16} /> {mentalHealth.phone}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="grants rv" aria-label="Гранти і проєкти">
          <div className="grants__body">
            <span className="grants__eyebrow">Гранти і проєкти</span>
            <h2 className="grants__title">Можливості від партнерів</h2>
            <p>
              Ділимося цікавими можливостями від партнерів! Для студентів, викладачів, науковців та всіх активних
              людей нашої Університетської родини.
            </p>
            <a className="btn btn--light" href={grants.href} {...ext}>
              {grants.label} <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="grants__art" aria-hidden="true">
            {['Гранти', 'Стажування', 'Обмін', 'Конференції', 'Стипендії', 'Проєкти'].map((t, i) => (
              <span key={t} className={`chip chip--${i + 1}`}>
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <section className="contacts-section" id="contacts">
          <div className="section-head">
            <span className="section-head__kicker">Деканати</span>
            <h2 className="index-section__title">Контакти</h2>
          </div>
          <div className="contacts-grid">
            {departments.map((dep) => (
              <Reveal className="dept-card rv" key={dep.name}>
                <h4>{dep.name}</h4>
                <p className="dept-card__row">
                  <Icon name="pin" size={16} /> {dep.address}
                </p>
                {dep.phones.map((phone) => (
                  <p className="dept-card__row" key={phone}>
                    <Icon name="phone" size={16} /> <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
                  </p>
                ))}
                <p className="dept-card__row">
                  <Icon name="mail" size={16} /> <a href={`mailto:${dep.email}`}>{dep.email}</a>
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <StartSection />
      </main>

      <footer className="footer">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/img/ifnmu-mark.svg" alt="" width="40" height="51" />
            <p>{university.name}</p>
          </div>
          <div className="footer__col">
            <h4>Контакти</h4>
            <p>
              <Icon name="pin" size={16} /> {university.address}
            </p>
            <p>
              <Icon name="phone" size={16} />{' '}
              <a href={`tel:+38${university.phone.replace(/[^\d]/g, '')}`}>{university.phone}</a>
            </p>
            <p>
              <Icon name="globe" size={16} />{' '}
              <a href={university.site} {...ext}>
                ifnmu.edu.ua
              </a>
            </p>
          </div>
          <div className="footer__col">
            <h4>Корисне</h4>
            <ul>
              {university.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} {...ext}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h4>Ми в мережі</h4>
            <ul>
              {university.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} {...ext}>
                    {s.label}
                    {s.note && <small> · {s.note}</small>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {year} ІФНМУ · Student Guide</span>
          <a href="#top">Нагору ↑</a>
        </div>
      </footer>
    </div>
  )
}
