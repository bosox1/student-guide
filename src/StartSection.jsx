import { useMemo, useState } from 'react'
import Icon from './Icons.jsx'
import { Reveal, useScrollSpy, useStoredState } from './reveal.jsx'
import { university } from './data.js'
import {
  startIntro,
  startSteps,
  checklist,
  services,
  deansNews,
  rules,
  portalSteps,
  portalRemember,
  departmentsPage,
  chairsByAddress,
  whoToAsk,
  troubleLink,
  community,
} from './start.js'

const ext = { target: '_blank', rel: 'noreferrer' }
const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q}, Івано-Франківськ`)}`
const norm = (s) => s.toLowerCase().replace(/[’'ʼ`]/g, '')

function Checklist() {
  const [done, setDone] = useStoredState('sg-checklist', {})
  const count = checklist.filter((c) => done[c.id]).length
  const pct = Math.round((count / checklist.length) * 100)
  return (
    <aside className="checklist" aria-label="Чекліст першого тижня">
      <div className="checklist__head">
        <span className="checklist__eyebrow">Чекліст першого тижня</span>
        <span className="checklist__count">
          {count}/{checklist.length}
        </span>
      </div>
      <div className="checklist__bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <ul>
        {checklist.map((c) => (
          <li key={c.id}>
            <label className={done[c.id] ? 'is-done' : ''}>
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={() => setDone((d) => ({ ...d, [c.id]: !d[c.id] }))}
              />
              <span className="checklist__box">
                <Icon name="check" size={14} strokeWidth={2.4} />
              </span>
              <span>{c.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="checklist__foot">
        {count === checklist.length ? 'Готово! Ви впевнено стартували 🎉' : 'Позначки зберігаються у Вашому браузері.'}
      </p>
    </aside>
  )
}

function ChairsFinder() {
  const [q, setQ] = useState('')
  const [openAll, setOpenAll] = useState(false)
  const query = norm(q.trim())

  const groups = useMemo(
    () =>
      chairsByAddress
        .map((g) => {
          const items = g.items.map((it) => (typeof it === 'string' ? { name: it } : it))
          const hit = query
            ? items.filter((it) => norm(`${it.name} ${it.num || ''} ${g.place} ${g.sub || ''}`).includes(query))
            : items
          return { ...g, items: hit }
        })
        .filter((g) => g.items.length > 0),
    [query],
  )
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  const highlight = (text) => {
    if (!query) return text
    const i = norm(text).indexOf(query)
    if (i < 0) return text
    return (
      <>
        {text.slice(0, i)}
        <mark>{text.slice(i, i + query.length)}</mark>
        {text.slice(i + query.length)}
      </>
    )
  }

  return (
    <div className="chairs">
      <div className="chairs__tools">
        <label className="chairs__search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Знайти кафедру або адресу — напр. «анатомії»"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Пошук кафедри"
          />
        </label>
        <button className="chairs__toggle" onClick={() => setOpenAll((v) => !v)} type="button">
          {openAll ? 'Згорнути все' : 'Розгорнути все'}
        </button>
      </div>
      {query && (
        <p className="chairs__meta" aria-live="polite">
          {total ? `Знайдено: ${total}` : 'Нічого не знайдено — спробуйте коротше слово.'}
        </p>
      )}
      <div className="chairs__list">
        {groups.map((g) => (
          <details key={g.place} className="chairs__group" open={openAll || !!query}>
            <summary>
              <span className="chairs__place">
                <Icon name="pin" size={18} />
                <span>
                  <strong>{highlight(g.place)}</strong>
                  {g.sub && <small>{highlight(g.sub)}</small>}
                </span>
              </span>
              <span className="chairs__count">{g.items.length}</span>
              <Icon name="chevron" size={18} className="chairs__chev" />
            </summary>
            <ul>
              {g.items.map((it, i) => (
                <li key={it.name + i}>
                  {it.num && <span className="chairs__num">{highlight(it.num)}</span>}
                  <span>{highlight(it.name)}</span>
                </li>
              ))}
            </ul>
            {g.query && (
              <a className="chairs__map" href={mapsUrl(g.query)} {...ext}>
                Відкрити на мапі <Icon name="arrow" size={14} />
              </a>
            )}
          </details>
        ))}
      </div>
    </div>
  )
}

function StepHead({ n, title, icon }) {
  return (
    <header className="step__head">
      <span className="step__num">{String(n).padStart(2, '0')}</span>
      <h3 className="step__title">{title}</h3>
      <Icon name={icon} size={26} className="step__icon" />
    </header>
  )
}

export default function StartSection() {
  const ids = useMemo(() => startSteps.map((s) => s.id), [])
  const active = useScrollSpy(ids)
  const activeIdx = Math.max(0, ids.indexOf(active))

  return (
    <section id="start" className="start" aria-labelledby="start-title">
      <div className="start__hero">
        <div className="start__intro">
          <span className="start__eyebrow">
            <Icon name="sparkle" size={16} /> Для першокурсників
          </span>
          <h2 id="start-title" className="start__title">
            {startIntro.title}
          </h2>
          <p className="start__lead">{startIntro.lead}</p>
          <div className="start__text">
            {startIntro.text.map((t, i) => (
              <p key={i} className={i === 0 ? 'start__hello' : ''}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <Checklist />
      </div>

      <div className="start__layout">
        <nav className="rail" aria-label="Кроки">
          <ol>
            {startSteps.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`rail__link${active === s.id ? ' is-active' : ''}${i < activeIdx ? ' is-past' : ''}`}
                  aria-current={active === s.id ? 'step' : undefined}
                >
                  <span className="rail__dot">{i + 1}</span>
                  <span className="rail__label">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="steps">
          {/* 1 */}
          <Reveal as="article" id="start-study" className="step rv">
            <StepHead n={1} title="Організуйте своє навчання" icon="calendar" />

            <h4 className="step__sub">Цифрові сервіси</h4>
            <div className="services">
              {services.map((s) => (
                <a key={s.title} className={`service${s.featured ? ' service--featured' : ''}`} href={s.href} {...ext}>
                  <span className="service__icon">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <span className="service__body">
                    <span className="service__title">
                      {s.title}
                      {s.tag && <em className="tag">{s.tag}</em>}
                    </span>
                    <span className="service__text">{s.text}</span>
                    {s.note && <span className="service__note">{s.note}</span>}
                  </span>
                  <Icon name="external" size={16} className="service__ext" />
                </a>
              ))}
            </div>

            <h4 className="step__sub">Навчальні оголошення</h4>
            <p className="step__p">Стежте за інформацією й повідомленнями деканату та кафедр. Збережіть сторінку свого факультету:</p>
            <div className="deans">
              {deansNews.map((d) => (
                <a key={d.href} href={d.href} {...ext} className="deans__item">
                  <Icon name="bell" size={18} />
                  <span>{d.label}</span>
                  <Icon name="arrow" size={16} className="deans__arrow" />
                </a>
              ))}
            </div>

            <h4 className="step__sub">Навчальні матеріали кафедр</h4>
            <p className="step__p">
              Матеріали з дисциплін розміщуються на <strong>внутрішніх порталах кафедр</strong>. Це Ваше основне
              місце пошуку матеріалів для підготовки до практичних занять та опрацювання тем.
            </p>
            <ol className="howto">
              {portalSteps.map((p, i) => (
                <li key={i}>
                  <span className="howto__n">{i + 1}</span>
                  <span>
                    {p.text}{' '}
                    {p.link && (
                      <a href={p.link.href} {...ext}>
                        {p.link.label} →
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ol>
            <div className="two">
              <div className="remember">
                <h5>Що варто пам'ятати</h5>
                <ul>
                  {portalRemember.map((r) => (
                    <li key={r}>
                      <Icon name="check" size={16} strokeWidth={2} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tip">
                <span className="tip__label">Порада першокурснику</span>
                <p>
                  Збережіть посилання на сторінки кафедр, дисципліни яких Ви вивчаєте цього семестру. Так Ви
                  швидше знаходитимете потрібні матеріали.
                </p>
                <a href={departmentsPage} {...ext}>
                  Усі кафедри ІФНМУ →
                </a>
              </div>
            </div>

            <h4 className="step__sub" id="start-chairs">
              Де знаходиться кафедра
            </h4>
            <ChairsFinder />

            <h4 className="step__sub">Правила та документи</h4>
            <div className="docs">
              {rules.map((r) => (
                <a key={r.href} className="doc" href={r.href} {...ext}>
                  <Icon name="doc" size={24} />
                  <span>
                    <strong>{r.title}</strong>
                    <small>{r.text}</small>
                  </span>
                </a>
              ))}
            </div>
            <p className="step__motto">Навчайтеся системно — готуйтеся впевнено!</p>
          </Reveal>

          {/* 2 */}
          <Reveal as="article" id="start-who" className="step rv">
            <StepHead n={2} title="Знайте, до кого звернутися" icon="users" />
            <p className="step__p">Не знаєте, з чого почати розв'язання питання? Зверніться до відповідальної особи або підрозділу.</p>
            <div className="who">
              {whoToAsk.map((w) => (
                <div key={w.who} className="who__card">
                  <h5>{w.who}</h5>
                  <p>{w.what}</p>
                  {w.link && (
                    <a href={w.link.href} {...(w.link.internal ? {} : ext)}>
                      {w.link.label} →
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p className="step__small">
              Актуальні контакти, години прийому та порядок звернення шукайте у відповідних офіційних розділах
              університету.
            </p>
          </Reveal>

          {/* 3 */}
          <Reveal as="article" id="start-trouble" className="step rv">
            <StepHead n={3} title="Якщо щось пішло не так" icon="alert" />
            <a className="bigLink" href={troubleLink} {...ext}>
              <span>
                <small>Пам'ятка ІФНМУ</small>
                Що робити, коли щось пішло не так під час навчання або роботи в ІФНМУ?
              </span>
              <span className="bigLink__go">
                <Icon name="arrow" size={22} />
              </span>
            </a>
          </Reveal>

          {/* 4 */}
          <Reveal as="article" id="start-community" className="step rv">
            <StepHead n={4} title="Станьте частиною університетської спільноти" icon="heart" />
            <p className="step__p">
              Університет — це не лише лекції, практичні заняття та іспити. Це також люди, спільні проєкти, нові
              захоплення й можливості спробувати себе в різних напрямах.
            </p>
            <div className="community">
              {community.map((c) => (
                <a key={c.href} href={c.href} {...ext} className="community__card">
                  <h5>{c.title}</h5>
                  <p>{c.text}</p>
                  <span className="community__cta">
                    {c.cta} <Icon name="arrow" size={16} />
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          {/* 5 */}
          <Reveal as="article" id="start-news" className="step rv">
            <StepHead n={5} title="Не пропускайте важливого" icon="bell" />
            <p className="step__p">
              Регулярно перевіряйте оголошення свого факультету, офіційний сайт ІФНМУ та університетські
              інформаційні канали. Зберігайте посилання на основні ресурси, уточнюйте інформацію в офіційних
              джерелах і не соромтеся ставити запитання.
            </p>
            <div className="feed">
              <div className="feed__head">
                <span>ІФНМУ в стрічці твого дня</span>
                <strong>Будьмо на зв'язку!</strong>
              </div>
              <div className="feed__links">
                {university.socials.map((s) => (
                  <a key={s.href} href={s.href} {...ext}>
                    <span>{s.label}</span>
                    {s.note && <small>{s.note}</small>}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* 6 */}
          <Reveal as="article" id="start-help" className="step rv">
            <StepHead n={6} title="Не знайшли відповіді?" icon="question" />
            <p className="step__p">
              Скористайтеся пошуком на сайті або зверніться до відповідного підрозділу університету. Якщо не
              знаєте, хто саме може допомогти, почніть із <a href="#contacts">деканату</a> чи куратора академічної
              групи.
            </p>
            <div className="finale">
              <p className="finale__title">Ваш шлях в ІФНМУ починається тут.</p>
              <p>
                Навчайтеся, досліджуйте, знайомтеся, пробуйте нове та використовуйте можливості університету. Ми
                прагнемо, щоб Ви почувалися частиною спільноти й упевнено рухалися до своєї професійної мети.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
