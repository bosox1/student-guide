import { useEffect, useRef, useState } from 'react'
import {
  navLinks,
  locationsMenu,
  corpusesGallery,
  corpusesList,
  houses,
  cafes,
  studentOrgs,
  paymentDetails,
  contacts,
  departments,
} from './data.js'

/** Reveals a section once it scrolls into view. Respects prefers-reduced-motion via CSS. */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/** Wrapper that applies the reveal animation to any catalogue card. */
function Reveal({ as: Tag = 'article', className = '', children, ...rest }) {
  const [ref, visible] = useReveal()
  return (
    <Tag ref={ref} className={`${className}${visible ? ' is-visible' : ''}`} {...rest}>
      {children}
    </Tag>
  )
}

/** Hides an image whose file is missing instead of showing a broken icon. */
const hideOnError = (e) => {
  e.currentTarget.style.display = 'none'
}

function Entry({ index, id, title, address, image, children, links }) {
  return (
    <Reveal id={id} className="entry">
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
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
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

function PaymentModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Реквізити для оплати">
      <div className="modal">
        <button className="modal__close" onClick={onClose} aria-label="Закрити">
          ×
        </button>
        <img className="modal__image" src="/img/stg.jpg" alt="" onError={hideOnError} />
        <div className="modal__info">
          <h2>{paymentDetails.title}</h2>
          {paymentDetails.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAllCorpuses, setShowAllCorpuses] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visibleCorpuses = showAllCorpuses ? corpusesList : corpusesList.slice(0, 6)

  return (
    <div className="page">
      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <a className="logo" href="#top">
          <img src="/img/logo.jpg" alt="ІФНМУ" />
          <span>Student Guide</span>
        </a>

        <nav className={`nav${menuOpen ? ' nav--open' : ''}`}>
          {navLinks.map((link) =>
            link.id === 'mssg' ? (
              <button
                key={link.label}
                className="nav__link nav__link--button"
                onClick={() => {
                  setModalOpen(true)
                  setMenuOpen(false)
                }}
              >
                {link.label}
              </button>
            ) : (
              <a key={link.label} className="nav__link" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ),
          )}
        </nav>

        <button
          className="burger"
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
        <section className="hero">
          <div className="hero__eyebrow">Довідник студента · ІФНМУ</div>
          <h1 className="hero__title">Student guide</h1>
          <p className="hero__text">
            Довідник, який стане у пригоді першокурсникам фахового медичного коледжу чи Університету —
            а також усім, хто вже навчається, але хоче знати більше про сервіси й можливості
            університетського життя.
          </p>
        </section>

        <div className="banner">
          <p>
            Деталі про вартість, правила поселення і проживання в гуртожитках — на офіційній сторінці{' '}
            <a href="https://www.ifnmu.edu.ua/home/public-information/student-trade-union/" target="_blank" rel="noreferrer">
              студентського профспілкового комітету
            </a>
            .
          </p>
        </div>

        <section className="index-section">
          <h2 className="index-section__title">Локації університету</h2>
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
              Висококваліфіковані лікарі й сучасне обладнання — для вашого здоров'я. Студент, який
              захворів, для відпрацювання пропущених занять повинен мати медичну довідку встановленої
              форми, видану або завірену Університетською клінікою.
            </p>
          </Entry>

          <Reveal id="houses" className="entry entry--group">
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
                      <a href={h.href} target="_blank" rel="noreferrer">
                        GoogleMaps →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal id="corpuses" className="entry entry--wide">
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
                  <li key={c.href} className="corpuses-list__item">
                    <svg className="corpuses-list__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 3L2 8l10 5 8-4.09V15h2V8L12 3z" fill="currentColor" />
                      <path d="M6 10.5V15c0 1.5 2.5 3.5 6 3.5s6-2 6-3.5v-4.5l-6 3-6-3z" fill="currentColor" opacity="0.55" />
                    </svg>
                    <span className="corpuses-list__label">{c.label}</span>
                    <a className="corpuses-list__btn" href={c.href} target="_blank" rel="noreferrer">
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

          <Reveal id="cafes" className="entry entry--wide">
            <div className="entry__tab">
              <span className="entry__index">06</span>
            </div>
            <div className="entry__body entry__body--wide">
              <h3 className="entry__title">Студентські їдальні</h3>
              <p className="entry__note">
                Студентське життя дуже насичене: окрім навчання — спорт, вечори, майстер-класи, гуртки,
                театри, кіно, спілкування. Мережа студентських закладів харчування ІФНМУ — до ваших
                послуг.
              </p>
              <div className="cafes-gallery">
                <img src="/img/cafe2.jpg" alt="" loading="lazy" onError={hideOnError} />
                <img src="/img/cafe3.jpg" alt="" loading="lazy" onError={hideOnError} />
                <img className="cafes-gallery__wide" src="/img/cafe1.jpg" alt="" loading="lazy" onError={hideOnError} />
              </div>
              <ul className="cafes-list">
                {cafes.map((c) => (
                  <li key={c.href}>
                    <span>{c.label}</span>
                    <a href={c.href} target="_blank" rel="noreferrer">
                      GoogleMaps →
                    </a>
                  </li>
                ))}
              </ul>
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

        <section className="callout callout--mental">
          <img src="/img/mental_health.jpg" alt="" loading="lazy" />
          <div className="callout__info">
            <p>
              Відчуваєте втому, стрес або потребуєте підтримки? Центр ментального здоров'я ІФНМУ завжди
              поруч, щоб вислухати, підтримати й допомогти. Звертайтеся — разом ми знайдемо рішення!
            </p>
            <a href="https://www.ifnmu.edu.ua/center-for-mental-health-ifnmu/" target="_blank" rel="noreferrer">
              Записатися на консультацію →
            </a>
          </div>
        </section>

        <section className="callout callout--grants">
          <div className="callout__info">
            <p>
              Ділимося цікавими можливостями від партнерів! Для студентів, викладачів, науковців та всіх
              активних людей нашої Університетської родини.
            </p>
            <a href="https://en.wst.com.pl/education_offer/computer_science" target="_blank" rel="noreferrer">
              Більше →
            </a>
          </div>
          <img src="/img/grants.jpg" alt="" loading="lazy" onError={hideOnError} />
        </section>

        <section id="student_org" className="orgs">
          <h2 className="index-section__title">Студентські організації</h2>
          <p className="orgs__intro">
            Шукаєш можливостей для особистого розвитку, лідерства та незабутніх спогадів? Приєднуйся до
            студентських організацій Університету — нові друзі, проєкти, події та вплив на життя
            університетської спільноти.
          </p>
          <div className="orgs__grid">
            {studentOrgs.map((org) => (
              <div className="org-card" key={org.name}>
                <h4>{org.name}</h4>
                <div className="org-card__links">
                  {org.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="umsa">
            <div className="umsa__info">
              <h4>Громадська організація «Українська медична студентська асоціація» (УМСА)</h4>
              <p>Частина Міжнародної федерації асоціацій студентів-медиків (IFMSA). Запрошуємо тебе стати частинкою нашої сім'ї!</p>
              <div className="org-card__links">
                <a href="https://web.telegram.org/k/#@umsa_if" target="_blank" rel="noreferrer">
                  Telegram
                </a>
                <a href="https://www.instagram.com/umsa.frankivsk/" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="contacts-section">
          <h2 className="index-section__title">Контакти</h2>
          <div className="contacts-grid">
            {departments.map((dep) => (
              <div className="dept-card" key={dep.name}>
                <h4>{dep.name}</h4>
                <p className="dept-card__row">
                  <span aria-hidden="true">⚲</span> {dep.address}
                </p>
                {dep.phones.map((phone) => (
                  <p className="dept-card__row" key={phone}>
                    <span aria-hidden="true">☎</span>{' '}
                    <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
                  </p>
                ))}
                <p className="dept-card__row">
                  <span aria-hidden="true">✉</span>{' '}
                  <a href={`mailto:${dep.email}`}>{dep.email}</a>
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__info">
          <p>
            <span aria-hidden="true">✉</span> {contacts.email}
          </p>
          <p>
            <span aria-hidden="true">☎</span> {contacts.phone}
          </p>
          <p>
            <span aria-hidden="true">⚲</span> {contacts.address}
          </p>
        </div>
        <div className="footer__nav">
          {contacts.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
