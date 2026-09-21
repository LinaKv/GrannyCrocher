# 🧶 Granny Square Color Planner

Веб-приложение для подбора цветовой комбинации «бабушкиного квадрата»
(granny square) при вязании крючком.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

<!-- Скриншот приложения: замените placeholder ниже на реальный, например docs/screenshot.png -->
![Скриншот приложения](docs/screenshot.png)

## Зачем это нужно

При вязании granny square, цвета рядов трудно представить заранее —
пряжа в клубке выглядит не так, как в готовом изделии. Это приложение
позволяет собрать квадрат ряд за рядом на экране, примерить цвета из
своей палитры и сохранить удачные комбинации для сравнения

## Функциональность (MVP)

- **Рабочий квадрат** — концентрические ряды от центра к краю, слои
  можно добавлять; клик по ряду открывает меню «Изменить цвет» /
  «Удалить».
- **Подбор цвета** — немодальное окно с палитрой-сердечками поверх
  экрана: клик по цвету — живое превью на квадрате, «Сохранить»
  фиксирует, «Закрыть» — отменяет.
- **Палитра цветов** — добавление своих цветов по hex (`#RRGGBB`),
  удаление одним кликом.
- **Сохранённые комбинации** — понравившиеся раскраски сохраняются и
  отображаются мини-превью в сетке для сравнения.
- **Автосохранение** — палитра, комбинации и текущий квадрат хранятся
  в `localStorage`, работа не теряется при перезагрузке страницы.

## Технологии

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- Без бэкенда — всё состояние на клиенте

## Установка и запуск

```bash
npm install
npm run dev
```

Другие команды:

```bash
npm run build    # production-сборка
npm run preview  # локальный просмотр сборки
npm run lint     # линт (oxlint)
```

## Планы на будущее

Вне рамок MVP, но архитектура на это рассчитана:

- 📤 Экспорт цветовой комбинации.
- 🧥 Раскладка кардигана из квадратов.
- 🧮 Калькулятор расхода пряжи.

## Документация

- [docs/requirements.md](docs/requirements.md) — подробные требования и макет.
- [docs/architecture.md](docs/architecture.md) — модель данных и структура проекта.
