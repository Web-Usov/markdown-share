# Заголовок первого уровня
## Заголовок второго уровня
### Заголовок третьего уровня
#### Заголовок четвертого уровня
##### Заголовок пятого уровня
###### Заголовок шестого уровня

## Форматирование текста

**Жирный текст** и *курсивный текст*
***Жирный и курсивный текст***
~~Зачеркнутый текст~~
`Моноширинный текст`

## Списки

### Маркированный список
- Первый пункт
  - Вложенный пункт
    - Еще более вложенный пункт
- Второй пункт
- Третий пункт

### Нумерованный список
1. Первый пункт
   1. Вложенный пункт
      1. Еще более вложенный пункт
2. Второй пункт
3. Третий пункт

### Список задач
- [x] Выполненная задача
- [ ] Невыполненная задача
- [x] Еще одна выполненная задача

## Цитаты

> Это цитата первого уровня
>> Это вложенная цитата
>>> Это цитата третьего уровня

## Код

Встроенный код: `const hello = "world";`

Блок кода с подсветкой синтаксиса:

```javascript
function greeting(name) {
  console.log(`Привет, ${name}!`);
  return {
    message: "Hello",
    timestamp: new Date()
  };
}
```

## Таблицы

| Заголовок 1 | Заголовок 2 | Заголовок 3 |
|-------------|:-----------:|------------:|
| По левому   | По центру   | По правому  |
| краю        | выровнено   | краю        |
| текст       | текст       | текст       |

## Ссылки и изображения 

[Ссылка с title](https://example.com "Это title ссылки")
[Простая ссылка](https://example.com)

![Альтернативный текст](https://placehold.co/600x400 "Подпись к изображению")

## Горизонтальные линии

---
***
___

## Lorem long

Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, `quod`. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. 

## Эмодзи

:smile: :heart: :thumbsup: :rocket:

## Математические формулы (если поддерживается)

Встроенная формула: $E = mc^2$

Формула на отдельной строке:

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

## Сноски

Текст со сноской[^1] и еще одной[^2].

[^1]: Это первая сноска
[^2]: Это вторая сноска с дополнительным *форматированием*

## Определения

Термин
: Определение термина
: Второе определение термина

Другой термин
: Определение другого термина


# Code and Syntax Highlighting

```
Inline `code` has `back-ticks around` it.
```

Inline `code` has `back-ticks around` it.

```c#
using System.IO.Compression;

#pragma warning disable 414, 3021

namespace MyApplication
{
    [Obsolete("...")]
    class Program : IInterface
    {
        public static List<int> JustDoIt(int count)
        {
            Console.WriteLine($"Hello {Name}!");
            return new List<int>(new int[] { 1, 2, 3 })
        }
    }
}
```

```css
@font-face {
  font-family: Chunkfive; src: url('Chunkfive.otf');
}

body, .usertext {
  color: #F0F0F0; background: #600;
  font-family: Chunkfive, sans;
}

@import url(print.css);
@media print {
  a[href^=http]::after {
    content: attr(href)
  }
}
```

```javascript
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}

export  $initHighlight;
```

```php
require_once 'Zend/Uri/Http.php';

namespace Location\Web;

interface Factory
{
    static function _factory();
}

abstract class URI extends BaseURI implements Factory
{
    abstract function test();

    public static $st1 = 1;
    const ME = "Yo";
    var $list = NULL;
    private $var;

    /**
     * Returns a URI
     *
     * @return URI
     */
    static public function _factory($stats = array(), $uri = 'http')
    {
        echo __METHOD__;
        $uri = explode(':', $uri, 0b10);
        $schemeSpecific = isset($uri[1]) ? $uri[1] : '';
        $desc = 'Multi
line description';

        // Security check
        if (!ctype_alnum($scheme)) {
            throw new Zend_Uri_Exception('Illegal scheme');
        }

        $this->var = 0 - self::$st;
        $this->list = list(Array("1"=> 2, 2=>self::ME, 3 => \Location\Web\URI::class));

        return [
            'uri'   => $uri,
            'value' => null,
        ];
    }
}

echo URI::ME . URI::$st1;

__halt_compiler () ; datahere
datahere
datahere */
datahere
```