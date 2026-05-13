# Кредити стокових фото

Стокові фото, використані на сайті. Усі — безкоштовні для комерційного використання, без вотермарків. Атрибуція не обов'язкова, але рекомендована (можна додати у футер чи окрему сторінку).

## Pexels License

[Pexels License](https://www.pexels.com/license/) дозволяє безкоштовне використання у комерційних і некомерційних цілях. Атрибуція не обов'язкова, але вітається.

| Файл | Слот | Автор | Сторінка |
|---|---|---|---|
| stock-memorial-table | `poslugy.pomynalnyi-obid` | Kampus Production | [pexels.com/photo/8871516](https://www.pexels.com/photo/8871516/) |
| stock-wooden-cross | `tovary.khresty` | Karola G | [pexels.com/photo/6769912](https://www.pexels.com/photo/6769912/) |
| stock-wooden-cross-flowers | `tovary.khresty.alt` | Shox | [pexels.com/photo/34351057](https://www.pexels.com/photo/34351057/) |
| stock-formal-suit | `tovary.odiah` | Raana Jenab | [pexels.com/photo/32392072](https://www.pexels.com/photo/32392072/) |
| stock-suit-hanger | `tovary.odiah.alt` | Filip Sestrenek | [pexels.com/photo/11474337](https://www.pexels.com/photo/11474337/) |
| stock-church-candles | `tovary.aksesuary` | Emre Akyol | [pexels.com/photo/17841194](https://www.pexels.com/photo/17841194/) |
| stock-orthodox-icon | `tovary.aksesuary.icon` | Ron Lach | [pexels.com/photo/10618918](https://www.pexels.com/photo/10618918/) |
| stock-brass-band | `poslugy.orkestr.alt` | Kari Alfonso | [pexels.com/photo/33968490](https://www.pexels.com/photo/33968490/) |

## Unsplash License

[Unsplash License](https://unsplash.com/license) дозволяє безкоштовне використання у комерційних і некомерційних цілях. Атрибуція не обов'язкова.

| Файл | Слот | Автор | Сторінка |
|---|---|---|---|
| stock-trumpet-bw | `poslugy.orkestr` | Gilles Gravier | [unsplash.com/photos/hLwh2H6RXsU](https://unsplash.com/photos/hLwh2H6RXsU) |
| stock-open-book-candle | `poslugy.psaltyr-synhumator` | Sixteen Miles Out | [unsplash.com/photos/1N8e3hMTAb8](https://unsplash.com/photos/1N8e3hMTAb8) |
| stock-cross-candle-table | `tovary.aksesuary.cross-candle` | Maegan Martin | [unsplash.com/photos/u_BxRvxX6aQ](https://unsplash.com/photos/u_BxRvxX6aQ) |

## Як оновити список

1. Додай новий запис у [scripts/download-stock.mjs](scripts/download-stock.mjs)
2. Запусти `pnpm download:stock`
3. Запусти `pnpm optimize:images`
4. Додай метадані у [data/photos.json](data/photos.json) під відповідний `*.stock` ключ
5. Внеси сюди рядок із кредитом

## Рекомендації при заміні

Зрештою стокові фото варто замінити на власні (виробництво пам'ятників, склад труни, костюми у власному магазині тощо). До того часу — стокові служать гідним placeholder'ом без шкоди для довіри:

- Жодне фото не містить вотермарка
- Усі фото — у нейтральному, поважному тоні
- Тематика чітко відповідає послузі/категорії
- Кольорова палітра гармонує з основним архівом (теплі тони, дерево, свічки, золото)
