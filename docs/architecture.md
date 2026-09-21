# Архитектура: Granny Square Color Planner

Минимальная архитектура под требования из
[docs/requirements.md](requirements.md), рассчитанная на то, чтобы позже
спокойно добавить экспорт, раскладку кардигана и калькулятор пряжи, не
переписывая основу.

## Стек

- Vite + React + TypeScript
- Tailwind CSS
- Без стейт-менеджера — хватает React state + пары кастомных хуков.
- Без роутера — один экран.

## Модель данных

```ts
type HexColor = string; // провалидированная строка вида #RRGGBB

interface PaletteColor {
  id: string;
  hex: HexColor;
}

interface SquareRow {
  id: string;
  colorId: string | null; // ссылка на PaletteColor.id
}

interface SavedCombination {
  id: string;
  rows: Array<{ colorId: string | null }>;
  createdAt: number;
}
```

`colorId: null` — ряд ещё не покрашен (нейтральный вид по умолчанию).
Комбинация хранит цвета по ссылке на палитру, а не сам hex, чтобы удаление
цвета из палитры было явным решением пользователя, а не побочным эффектом.

## Хранение (localStorage)

Три независимых ключа, каждый — отдельный хук со своим чтением/записью:

- `granny-square:palette` → `PaletteColor[]`
- `granny-square:combinations` → `SavedCombination[]`
- `granny-square:working-square` → `SquareRow[]`

Чтение из localStorage всегда проходит через runtime-валидацию (без `as`),
битые данные — откат к дефолту, а не падение приложения.

## Структура файлов

```
src/
  main.tsx
  App.tsx
  types.ts                 общие типы (PaletteColor, SquareRow, SavedCombination)
  storage/
    localStorage.ts        типобезопасные get/set с валидацией
    useLocalStorageState.ts generic-хук синхронизации state <-> localStorage
  hooks/
    usePalette.ts           CRUD для палитры
    useWorkingSquare.ts      CRUD для рядов рабочего квадрата
    useSavedCombinations.ts  сохранение/список комбинаций
  utils/
    color.ts                 валидация и нормализация hex
    id.ts                    генерация id
  components/
    GrannySquare.tsx          SVG-квадрат из концентрических рядов
    RowContextMenu.tsx        всплывающее меню у курсора (изменить/удалить)
    ColorPickerPopover.tsx    немодальное окно выбора цвета для ряда
    HeartSwatch.tsx           сердечко-цвет (с опциональным крестиком/галочкой)
    Palette.tsx               список HeartSwatch + кнопка "Добавить цвета"
    AddColorForm.tsx          hex-инпут + Сохранить/Удалить
    SavedCombinations.tsx     сетка мини-превью GrannySquare
docs/
  requirements.md
  architecture.md
  reference/main-screen.pdf
```

## Поток взаимодействия

1. `App` держит связку из трёх хуков (`usePalette`, `useWorkingSquare`,
   `useSavedCombinations`) и раскладывает layout: квадрат слева, палитра
   справа, сохранённые комбинации снизу.
2. Клик по ряду в `GrannySquare` поднимает `onRowClick(rowId, position)` →
   `App` открывает `RowContextMenu` в точке клика.
3. «Удалить» в меню — сразу вызывает `useWorkingSquare.removeRow(rowId)`.
4. «Изменить цвет» — открывает `ColorPickerPopover` поверх экрана
   (позиционируется рядом с меню, не модальный оверлей на весь экран).
   Клик по сердечку — временный локальный state попапа (превью), не пишет
   в `useWorkingSquare` до «Сохранить».
5. «Сохранить» в попапе — коммитит цвет в `useWorkingSquare`, закрывает
   попап. «Закрыть» — просто закрывает без коммита.
6. «Добавить цвета» открывает `AddColorForm`, «Сохранить» там — валидирует
   hex через `utils/color.ts` и пишет в `usePalette.addColor`.
7. Крестик на сердечке в `Palette` — `usePalette.removeColor(id)`; ряды с
   этим `colorId` в рабочем квадрате и в сохранённых комбинациях остаются
   как есть в данных, но рендерятся как непокрашенные (цвет не найден в
   палитре) — так удаление палитры не ломает раньше сохранённое.
8. «Сохранить» у квадрата — `useSavedCombinations.save(currentRows)`,
   комбинация уходит в сетку `SavedCombinations` (рендерится тем же
   `GrannySquare` в компактном режиме, `readOnly`).

## Точки расширения под бэклог

- Экспорт комбинации: чистая функция сериализации `SavedCombination` →
  добавляется как отдельная утилита, не трогает остальную модель.
- Раскладка кардигана: новый экран/секция, переиспользует `GrannySquare`
  и `SavedCombination[]` как есть.
- Калькулятор пряжи: отдельный модуль, на входе — количество рядов и их
  цвета, тоже не требует изменения текущей модели.
