# Parameter Editor


[![Просмотры README](https://vbr.nathanchung.dev/badge?page_id=Richbanker.Parameter-Editor&text=README_Views)](https://github.com/Richbanker/Parameter-Editor)

Редактор параметров с возможностью drag-and-drop сортировки, историей изменений и уведомлениями.

## Технологический стек

- **Frontend Framework**: React 18
- **TypeScript**: Для типизации и улучшения разработки
- **State Management**: Zustand (для управления состоянием)
- **Drag and Drop**: @dnd-kit (для реализации drag-and-drop функциональности)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library
- **Notifications**: React-Toastify
- **Date Handling**: date-fns
- **Form Validation**: Zod

## Функциональность

- 📝 Редактирование параметров моделей
- 🔄 Drag-and-drop сортировка параметров
- 📋 История изменений с возможностью отмены/повтора действий
- 🔔 Система уведомлений
- 💾 Автоматическое сохранение изменений
- 📱 Адаптивный дизайн
- 🎨 Современный UI с использованием Tailwind CSS

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone [url-репозитория]
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

4. Для сборки проекта:
```bash
npm run build
```

## Тестирование

```bash
npm test
```

## Структура проекта

```
src/
├── components/         # React компоненты
│   ├── parameters/    # Компоненты для работы с параметрами
│   ├── history/       # Компоненты истории изменений
│   └── ui/            # UI компоненты
├── store/             # Zustand store
├── types/             # TypeScript типы
├── utils/             # Утилиты
└── hooks/             # React хуки
```

## Лицензия

MIT 