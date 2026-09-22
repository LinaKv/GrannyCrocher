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
  code?: string;      // код цвета из библиотеки пряжи
  nameRu?: string;
  yarnName?: string;  // название производителя/линейки пряжи
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

Основной цвет («primary color») — это `PaletteColor | null`, но хранится и
управляется отдельно от `palette` (свой хук, свой ключ в localStorage), а не
как элемент палитры: он должен переживать удаление той палитровой записи,
из которой был скопирован, и всегда однозначно определять цвет
заблокированных рядов.

## Хранение (localStorage)

Четыре независимых ключа, каждый — отдельный хук со своим чтением/записью:

- `granny-square:palette` → `PaletteColor[]`
- `granny-square:primary-color` → `PaletteColor | null`
- `granny-square:combinations` → `SavedCombination[]`
- `granny-square:working-square` → `SquareRow[]` (ровно 7 элементов)

Чтение из localStorage всегда проходит через runtime-валидацию (без `as`),
битые данные — откат к дефолту, а не падение приложения.

Экспорт/импорт (см. ниже) сериализует `palette` + `primaryColor` +
`combinations` в один JSON-файл и переиспользует те же type guard'ы для
валидации импортируемых данных.

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
    usePalette.ts            CRUD для палитры (+ replace для импорта)
    usePrimaryColor.ts       основной цвет: хранение, синхронизация в
                              заблокированные ряды (PRIMARY_ROW_INDICES)
    useWorkingSquare.ts      цвет по ряду, resetColors (рядов фиксировано 7)
    useSavedCombinations.ts  сохранение/список комбинаций (+ replace для импорта)
    useClampedPosition.ts    позиционирование поповера/меню с учётом краёв экрана
  utils/
    color.ts                 валидация и нормализация hex
    id.ts                    генерация id
    combinationsFile.ts      сериализация/парсинг JSON-файла экспорта-импорта
  components/
    GrannySquare.tsx          SVG-квадрат из концентрических рядов
                               (подсветка activeRowId, блокировка lockedRowIndices)
    RowContextMenu.tsx        всплывающее меню у курсора («Изменить цвет»)
    ColorPickerPopover.tsx    немодальное окно выбора цвета для ряда
    HeartSwatch.tsx           сердечко-цвет (галочка/крестик/метка "используется")
    Palette.tsx               список HeartSwatch палитры + удаление
    AddColorButton.tsx        кнопка + AddColorModal для добавления цветов
    AddColorModal.tsx         вкладки "свой цвет" / библиотека, singleSelect-режим
    AddColorForm.tsx          hex-инпут + Сохранить/Удалить
    LibraryColorPicker.tsx    выбор цветов из библиотеки пряжи
    AddPrimaryColorButton.tsx кнопка открытия выбора основного цвета
    PrimaryColorSwatch.tsx    превью выбранного основного цвета
    ResetColorsModal.tsx      подтверждение сброса цветов квадрата
    ImportCombinationsButton.tsx выбор файла + ImportCombinationsModal
    ImportCombinationsModal.tsx  подтверждение замены данных импортом
    SavedCombinations.tsx     сетка мини-превью GrannySquare + экспорт в файл
docs/
  requirements.md
  architecture.md
  reference/main-screen.pdf
```

## Поток взаимодействия

1. `App` держит связку из четырёх хуков (`usePalette`, `useWorkingSquare`,
   `usePrimaryColor`, `useSavedCombinations`) и раскладывает layout: квадрат
   слева, палитра и кнопки-действия справа, сохранённые комбинации снизу.
   Квадрат — фиксированные 7 рядов, `addRow`/`removeRow` не существует.
2. Ряды 6 и 7 (`PRIMARY_ROW_INDICES`) заблокированы для точечного клика
   (`lockedRowIndices` в `GrannySquare`) и всегда показывают `primaryColor`:
   `usePrimaryColor` синхронизирует их цвет напрямую через
   `useWorkingSquare.setRowColor` при каждом изменении основного цвета.
3. Клик по незаблокированному ряду в `GrannySquare` поднимает
   `onRowClick(rowId, position)` → `App` открывает `RowContextMenu` в точке
   клика; ряд подсвечивается как `activeRowId`. Позиция меню и попапа
   выбора цвета клэмпится в границы экрана через `useClampedPosition`.
4. «Изменить цвет» — открывает `ColorPickerPopover` поверх экрана
   (немодальный, закрывается кликом по фону). Клик по сердечку — временный
   локальный state попапа (превью), не пишет в `useWorkingSquare` до
   «Сохранить»; уже использованные в квадрате цвета помечаются меткой.
5. «Сохранить» в попапе — коммитит цвет в `useWorkingSquare`, закрывает
   попап. «Закрыть» — просто закрывает без коммита.
6. «Добавить цвета» открывает `AddColorButton` → `AddColorModal` (вкладки
   «свой цвет» / библиотека), «Сохранить» там валидирует hex через
   `utils/color.ts` и пишет в `usePalette.addColor`/`addLibraryColors`.
7. «Добавить основной цвет» открывает тот же `AddColorModal` в режиме
   `singleSelect` — выбор коммитится через `usePrimaryColor.setPrimaryColor`
   и сразу применяется к рядам 6–7 (см. пункт 2).
8. «Сбросить» — открывает `ResetColorsModal`; подтверждение вызывает
   `useWorkingSquare.resetColors(preserveIds)`, где `preserveIds` — ряды 6–7,
   чтобы не потерять основной цвет.
9. Крестик на сердечке в `Palette` — `usePalette.removeColor(id)`; ряды с
   этим `colorId` в рабочем квадрате и в сохранённых комбинациях остаются
   как есть в данных, но рендерятся как непокрашенные (цвет не найден в
   палитре) — так удаление палитры не ломает раньше сохранённое.
10. «Сохранить» у квадрата — `useSavedCombinations.save(currentRows)`,
    комбинация уходит в сетку `SavedCombinations` (рендерится тем же
    `GrannySquare` в компактном режиме, `readOnly`).
11. «Сохранить комбинации» в `SavedCombinations` — `utils/combinationsFile.ts`
    сериализует `{ palette, primaryColor, combinations }` в JSON и скачивает
    файл. «Загрузить комбинации» в `ImportCombinationsButton` парсит и
    валидирует такой файл (переиспользуя type guard'ы хуков), затем через
    `ImportCombinationsModal` просит подтвердить полную замену текущих
    палитры/основного цвета/комбинаций (`App.handleImportCombinations`
    вызывает `replace` у всех трёх хуков).

## Точки расширения под бэклог

- Раскладка кардигана: новый экран/секция, переиспользует `GrannySquare`
  и `SavedCombination[]` как есть.
- Калькулятор пряжи: отдельный модуль, на входе — количество рядов и их
  цвета, тоже не требует изменения текущей модели.
