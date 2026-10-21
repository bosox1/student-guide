# Student Guide — ІФНМУ (React + Vite)

Довідник студента ІФНМУ: hero зі швидким доступом до сервісів, локації університету,
Центр ментального здоров'я, гранти, контакти деканатів і розділ «Мій старт в ІФНМУ»
для першокурсників (чекліст, кроки, пошук кафедр за адресою).

## Запуск

```
npm install
npm run dev      # локально
npm run build    # збірка в dist/ (Netlify робить це сам, див. netlify.toml)
```

## Структура

```
src/
├── main.jsx          ← підключення шрифтів (self-hosted, @fontsource) і стилів
├── App.jsx           ← хедер, hero, локації, ЦМЗ, гранти, контакти, футер
├── StartSection.jsx  ← «Мій старт в ІФНМУ»
├── Icons.jsx         ← SVG-іконки
├── reveal.jsx        ← анімація появи, scrollspy, localStorage-хук
├── App.css           ← стилі й дизайн-токени
├── data.js           ← контент основної сторінки + контакти футера
└── start.js          ← контент «Мій старт» (сервіси, оголошення, кафедри, чекліст)
public/
├── img/ifnmu-mark.svg ← знак університету (векторна перемальовка — замінити офіційним SVG, якщо є)
├── og-image.jpg, favicon-48.png, icon-192.png, apple-touch-icon.png
└── robots.txt, sitemap.xml
```

## Що варто оновити

- `data.js → grants.href` — посилання на канал «Гранти і проєкти».
- `data.js → university.phone` — звірити з офіційним сайтом.
- Кафедри за адресами — `start.js → chairsByAddress`.

## Шрифти

Literata (заголовки), Source Sans 3 (текст), Roboto Mono (мітки). Усі з кирилицею,
віддаються з власного домену — без запитів до Google Fonts.
