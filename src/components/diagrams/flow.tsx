import * as React from 'react'
import { DiagramSvg } from './canvas'
import {
  DiagramChip,
  DiagramEdge,
  DiagramFrame,
  DiagramNode,
  EdgeLabel,
} from './primitives'
import { diagramColor, diagramFont } from './tokens'

/* ------------------------------------------------------------------ */
/*  4. Типы данных в GDScript                                          */
/* ------------------------------------------------------------------ */

export function GdscriptTypingDiagram() {
  const rows: Array<[string, string, string]> = [
    ['var hp := 10', 'int', 'целое'],
    ['var speed := 240.0', 'float', 'дробное'],
    ['var name := "Иван"', 'String', 'строка'],
    ['var alive := true', 'bool', 'логическое'],
    ['var pos := Vector2(1, 2)', 'Vector2', 'вектор'],
  ]
  return (
    <DiagramSvg viewBox="0 0 560 320" title="Типы данных в GDScript">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={360} height={200} title="Объявление и тип" />
          {rows.map(([code, type, meaning], index) => (
            <React.Fragment key={code}>
              <DiagramNode x={32} y={40 + index * 34} width={200} height={28} title={code} titleSize={11} />
              <DiagramEdge
                from={[232, 54 + index * 34]}
                to={[272, 54 + index * 34]}
                kind="weak"
                markerId={m}
              />
              <DiagramNode
                x={272}
                y={40 + index * 34}
                width={88}
                height={28}
                title={type}
                subtitle={meaning}
                variant="strong"
                titleSize={11}
              />
            </React.Fragment>
          ))}
          <DiagramFrame x={396} y={16} width={148} height={200} title="Правила" />
          <text
            x={408}
            y={62}
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            style={{ fill: diagramColor.text }}
          >
            {' := выводит тип'}
          </text>
          <text
            x={408}
            y={84}
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            style={{ fill: diagramColor.text }}
          >
            {' : задаёт тип'}
          </text>
          <text
            x={408}
            y={106}
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            style={{ fill: diagramColor.text }}
          >
            {' без : = Variant'}
          </text>
          <DiagramNode
            x={16}
            y={236}
            width={300}
            height={44}
            title="7 / 2 == 3"
            subtitle="целочисленное деление"
            variant="accent"
          />
          <DiagramNode
            x={336}
            y={236}
            width={208}
            height={44}
            title="7.0 / 2 == 3.5"
            subtitle="явный float"
            variant="accent"
          />
          <EdgeLabel x={280} y={306}>int и float не смешиваются молча</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  5. Порядок вызовов _ready и _process                                */
/* ------------------------------------------------------------------ */

export function ReadyProcessOrderDiagram() {
  return (
    <DiagramSvg viewBox="0 0 600 300" title="Порядок вызовов _ready и _process">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={568} height={120} title="Один раз при входе в дерево" />
          <DiagramNode x={36} y={52} width={140} height={44} title="_enter_tree()" />
          <DiagramEdge from={[176, 74]} to={[216, 74]} markerId={m} />
          <DiagramNode x={216} y={52} width={140} height={44} title="_ready()" variant="accent" />
          <DiagramEdge from={[356, 74]} to={[396, 74]} markerId={m} />
          <DiagramNode x={396} y={52} width={168} height={44} title="дети тоже готовы" subtitle="можно брать $Sibling" />

          <DiagramFrame x={16} y={152} width={568} height={120} title="Каждый кадр" />
          <DiagramNode x={36} y={188} width={150} height={44} title="_process(delta)" subtitle="каждый кадр" />
          <DiagramEdge from={[186, 210]} to={[236, 210]} kind="weak" markerId={m} />
          <DiagramNode x={236} y={188} width={180} height={44} title="_physics_process(delta)" subtitle="60 раз в секунду" />
          <DiagramEdge from={[416, 210]} to={[466, 210]} kind="weak" markerId={m} />
          <DiagramNode x={466} y={188} width={98} height={44} title="следующий кадр" />

          <EdgeLabel x={300} y={292}>родитель вызывает _ready раньше детей — сверху вниз</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  6. Жизненный цикл узла                                             */
/* ------------------------------------------------------------------ */

export function NodeLifecycleDiagram() {
  const steps = ['_enter_tree', '_ready', 'работа', '_exit_tree', 'удаление']
  return (
    <DiagramSvg viewBox="0 0 600 280" title="Жизненный цикл узла">
      {(m) => (
        <>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <DiagramNode
                x={16 + index * 116}
                y={60}
                width={100}
                height={44}
                title={step}
                variant={index === 1 || index === 2 ? 'accent' : 'node'}
                titleSize={11}
              />
              {index < steps.length - 1 ? (
                <DiagramEdge
                  from={[116 + index * 116, 82]}
                  to={[132 + index * 116, 82]}
                  markerId={m}
                />
              ) : null}
            </React.Fragment>
          ))}
          <DiagramFrame x={16} y={128} width={568} height={90} title="Правила" />
          <EdgeLabel x={300} y={160}>выход обратный: сначала дети, потом родитель</EdgeLabel>
          <EdgeLabel x={300} y={182}>в _ready дети уже готовы — ссылки на соседей безопасны</EdgeLabel>
          <EdgeLabel x={300} y={204}>в _exit_tree отключают сигналы, ведущие наружу</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  7. Поток сигналов                                                  */
/* ------------------------------------------------------------------ */

export function SignalsDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 290" title="Поток сигналов: emit и connect">
      {(m) => (
        <>
          <DiagramNode x={24} y={40} width={150} height={54} title="Отправитель" subtitle="Player" variant="accent" />
          <DiagramNode x={386} y={40} width={150} height={54} title="Получатель" subtitle="HUD" variant="accent" />
          <DiagramEdge from={[174, 67]} to={[386, 67]} label="emit(health)" markerId={m} />
          <DiagramChip x={228} y={48} text="сигнал" width={104} />
          <DiagramEdge
            from={[386, 120]}
            to={[174, 120]}
            kind="weak"
            label="connect(handler)"
            markerId={m}
            path="M 386 120 L 174 120"
          />
          <DiagramFrame x={24} y={156} width={512} height={112} title="Почему так удобно" />
          <EdgeLabel x={280} y={190}>отправитель не знает, кто его слушает</EdgeLabel>
          <EdgeLabel x={280} y={214}>один сигнал — много получателей</EdgeLabel>
          <EdgeLabel x={280} y={238}>отписаться: disconnect(handler)</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  8. Инстанцирование сцены                                           */
/* ------------------------------------------------------------------ */

export function SceneInstancingDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 300" title="Инстанцирование сцены">
      {(m) => (
        <>
          <DiagramNode x={24} y={32} width={170} height={54} title="enemy.tscn" subtitle="PackedScene" variant="accent" />
          <DiagramEdge from={[194, 59]} to={[244, 59]} label="instantiate()" markerId={m} />
          <DiagramNode x={244} y={32} width={150} height={54} title="Enemy (Node2D)" subtitle="ещё не в дереве" />
          <DiagramEdge from={[319, 86]} to={[319, 126]} markerId={m} />
          <DiagramNode x={244} y={126} width={150} height={54} title="настройка" subtitle="позиция, свойства" />
          <DiagramEdge from={[319, 180]} to={[319, 216]} markerId={m} />
          <DiagramNode x={244} y={216} width={150} height={54} title="add_child()" subtitle="теперь в дереве" variant="strong" />
          <DiagramFrame x={414} y={32} width={130} height={238} title="Дерево" />
          <DiagramNode x={426} y={80} width={106} height={40} title="World" titleSize={11} />
          <DiagramEdge from={[479, 120]} to={[479, 150]} markerId={m} />
          <DiagramNode x={426} y={150} width={106} height={40} title="Enemy" titleSize={11} />
          <DiagramEdge from={[479, 190]} to={[479, 214]} markerId={m} />
          <DiagramNode x={426} y={214} width={106} height={40} title="Enemy" titleSize={11} />
          <EdgeLabel x={280} y={292}>подписку на сигнал делают до add_child()</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  10. Слои и маски коллизий                                          */
/* ------------------------------------------------------------------ */

export function CollisionLayersDiagram() {
  return (
    <DiagramSvg viewBox="0 0 600 320" title="Слои и маски коллизий">
      {(m) => (
        <>
          <DiagramNode
            x={24}
            y={40}
            width={170}
            height={60}
            title="Player"
            subtitle="layer 2 · mask 1"
            variant="accent"
          />
          <DiagramNode
            x={406}
            y={40}
            width={170}
            height={60}
            title="World"
            subtitle="layer 1 · mask 0"
            variant="accent"
          />
          <DiagramNode
            x={215}
            y={150}
            width={170}
            height={60}
            title="Enemy"
            subtitle="layer 3 · mask 1|2"
            variant="accent"
          />
          <DiagramNode
            x={215}
            y={244}
            width={170}
            height={56}
            title="Pickup"
            subtitle="layer 4 · mask 2"
            variant="accent"
          />

          <DiagramEdge from={[194, 70]} to={[406, 70]} label="1 & 2 — совпадение" markerId={m} />
          <DiagramEdge
            from={[300, 150]}
            to={[300, 100]}
            kind="flow"
            label="маска врага видит мир и игрока"
            markerId={m}
            path="M 300 150 L 300 100"
          />
          <DiagramEdge
            from={[300, 244]}
            to={[300, 210]}
            kind="weak"
            markerId={m}
            path="M 300 244 L 300 210"
          />

          <DiagramFrame x={24} y={150} width={160} height={150} title="Слои" />
          <EdgeLabel x={104} y={178}>1 — мир</EdgeLabel>
          <EdgeLabel x={104} y={200}>2 — игрок</EdgeLabel>
          <EdgeLabel x={104} y={222}>3 — враги</EdgeLabel>
          <EdgeLabel x={104} y={244}>4 — подбираемое</EdgeLabel>
          <EdgeLabel x={104} y={272}>5 — опасное</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  11. Порядок обработки ввода                                        */
/* ------------------------------------------------------------------ */

export function InputOrderDiagram() {
  const steps = [
    '_input()',
    'GUI (кнопки, поля)',
    '_unhandled_input()',
    '_shortcut_input()',
    '_unhandled_key_input()',
  ]
  return (
    <DiagramSvg viewBox="0 0 600 300" title="Порядок обработки ввода">
      {(m) => (
        <>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <DiagramNode
                x={120}
                y={16 + index * 52}
                width={280}
                height={40}
                title={step}
                variant={index === 0 ? 'accent' : 'node'}
                titleSize={11}
              />
              {index < steps.length - 1 ? (
                <DiagramEdge from={[260, 56 + index * 52]} to={[260, 68 + index * 52]} markerId={m} />
              ) : null}
            </React.Fragment>
          ))}
          <DiagramFrame x={420} y={16} width={164} height={250} title="Важно" />
          <EdgeLabel x={502} y={62}>accept_event() —</EdgeLabel>
          <EdgeLabel x={502} y={84}>останавливает</EdgeLabel>
          <EdgeLabel x={502} y={106}>событие</EdgeLabel>
          <EdgeLabel x={502} y={146}>Для «сырого» ввода</EdgeLabel>
          <EdgeLabel x={502} y={168}>используйте</EdgeLabel>
          <EdgeLabel x={502} y={190}>_unhandled_input</EdgeLabel>
          <EdgeLabel x={502} y={228}>is_action_pressed()</EdgeLabel>
          <EdgeLabel x={502} y={250}>не зависит от GUI</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  12. Машина состояний игрока                                        */
/* ------------------------------------------------------------------ */

export function StateMachineDiagram() {
  return (
    <DiagramSvg viewBox="0 0 600 320" title="Машина состояний игрока">
      {(m) => (
        <>
          <DiagramNode x={40} y={40} width={130} height={44} title="IDLE" variant="accent" />
          <DiagramNode x={235} y={40} width={130} height={44} title="RUN" variant="accent" />
          <DiagramNode x={430} y={40} width={130} height={44} title="JUMP" variant="accent" />
          <DiagramNode x={235} y={190} width={130} height={44} title="FALL" variant="accent" />
          <DiagramNode x={40} y={190} width={130} height={44} title="HURT" variant="accent" />

          <DiagramEdge from={[170, 62]} to={[235, 62]} label="скорость > 0" markerId={m} />
          <DiagramEdge from={[365, 62]} to={[430, 62]} label="прыжок" markerId={m} />
          <DiagramEdge
            from={[495, 84]}
            to={[330, 190]}
            label="начал падать"
            markerId={m}
            path="M 495 84 L 495 150 L 330 150 L 330 190"
          />
          <DiagramEdge
            from={[235, 212]}
            to={[170, 212]}
            label="приземлился"
            markerId={m}
            path="M 235 212 L 170 212"
          />
          <DiagramEdge
            from={[105, 84]}
            to={[105, 190]}
            kind="weak"
            label="урон"
            markerId={m}
            path="M 105 84 L 105 190"
          />
          <DiagramEdge
            from={[105, 234]}
            to={[105, 84]}
            kind="weak"
            label="восстановился"
            markerId={m}
            path="M 105 234 L 90 234 L 90 84"
          />
          <DiagramFrame x={16} y={252} width={568} height={52} title="Правило" />
          <EdgeLabel x={300} y={284}>одно состояние в один момент — поведение всегда предсказуемо</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  13. Слои тайловой карты                                             */
/* ------------------------------------------------------------------ */

export function TilemapLayersDiagram() {
  return (
    <DiagramSvg viewBox="0 0 600 300" title="Слои тайловой карты">
      {() => (
        <>
          <DiagramFrame x={16} y={16} width={340} height={250} title="Сцена" />
          <DiagramNode x={36} y={48} width={300} height={44} title="TileMapLayer: Декор впереди" subtitle="z_index 10" />
          <DiagramNode x={36} y={100} width={300} height={44} title="TileMapLayer: Декор" subtitle="z_index 0" />
          <DiagramNode x={36} y={152} width={300} height={44} title="TileMapLayer: Земля" subtitle="коллизия в TileSet" variant="accent" />
          <DiagramNode x={36} y={204} width={300} height={44} title="Player" subtitle="Y-сортировка" variant="strong" />

          <DiagramFrame x={376} y={16} width={208} height={250} title="Порядок" />
          <EdgeLabel x={480} y={62}>Y-сортировка —</EdgeLabel>
          <EdgeLabel x={480} y={84}>кто ниже, тот</EdgeLabel>
          <EdgeLabel x={480} y={106}>ближе к зрителю</EdgeLabel>
          <EdgeLabel x={480} y={146}>z_index —</EdgeLabel>
          <EdgeLabel x={480} y={168}>жёсткий порядок</EdgeLabel>
          <EdgeLabel x={480} y={190}>слоёв</EdgeLabel>
          <EdgeLabel x={480} y={228}>удаление слоя</EdgeLabel>
          <EdgeLabel x={480} y={250}>стирает его тайлы</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  14. Анимации и состояния                                            */
/* ------------------------------------------------------------------ */

export function AnimationStateDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 280" title="Анимации и состояния">
      {(m) => (
        <>
          <DiagramNode x={24} y={32} width={140} height={44} title="IDLE" variant="accent" />
          <DiagramNode x={24} y={100} width={140} height={44} title="RUN" variant="accent" />
          <DiagramNode x={24} y={168} width={140} height={44} title="JUMP" variant="accent" />

          <DiagramEdge from={[164, 54]} to={[244, 54]} markerId={m} />
          <DiagramEdge from={[164, 122]} to={[244, 122]} markerId={m} />
          <DiagramEdge from={[164, 190]} to={[244, 190]} markerId={m} />

          <DiagramNode x={244} y={32} width={150} height={44} title="idle" subtitle="AnimatedSprite2D" />
          <DiagramNode x={244} y={100} width={150} height={44} title="run" subtitle="AnimatedSprite2D" />
          <DiagramNode x={244} y={168} width={150} height={44} title="jump" subtitle="AnimatedSprite2D" />

          <DiagramFrame x={414} y={32} width={130} height={180} title="Правило" />
          <EdgeLabel x={479} y={78}>переключать</EdgeLabel>
          <EdgeLabel x={479} y={100}>только при</EdgeLabel>
          <EdgeLabel x={479} y={122}>смене имени</EdgeLabel>
          <EdgeLabel x={479} y={162}>иначе play()</EdgeLabel>
          <EdgeLabel x={479} y={184}>каждый кадр</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  15. Якоря и раскладка интерфейса                                    */
/* ------------------------------------------------------------------ */

export function UiAnchorsDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 300" title="Якоря и раскладка интерфейса">
      {() => (
        <>
          <DiagramFrame x={16} y={16} width={300} height={250} title="родитель (Control)" />
          <text
            x={26}
            y={36}
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            style={{ fill: diagramColor.muted }}
          >
            anchor: 0 — 0
          </text>
          <DiagramNode x={36} y={52} width={120} height={40} title="Top Left" titleSize={11} />
          <DiagramNode x={176} y={52} width={120} height={40} title="Top Right" titleSize={11} />
          <DiagramNode x={36} y={122} width={120} height={40} title="Bottom Left" titleSize={11} />
          <DiagramNode x={176} y={122} width={120} height={40} title="Bottom Right" titleSize={11} />
          <DiagramNode x={106} y={192} width={120} height={40} title="Center" titleSize={11} variant="accent" />

          <DiagramFrame x={336} y={16} width={208} height={250} title="Инструменты" />
          <EdgeLabel x={440} y={62}>PRESET_FULL_RECT</EdgeLabel>
          <EdgeLabel x={440} y={84}>растянуть</EdgeLabel>
          <EdgeLabel x={440} y={122}>PRESET_CENTER</EdgeLabel>
          <EdgeLabel x={440} y={144}>по центру</EdgeLabel>
          <EdgeLabel x={440} y={182}>VBox / HBox</EdgeLabel>
          <EdgeLabel x={440} y={204}>раскладывают сами</EdgeLabel>
          <EdgeLabel x={440} y={242}>жёсткие координаты</EdgeLabel>
          <EdgeLabel x={440} y={262}>ломаются</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  16. Аудио-шины                                                     */
/* ------------------------------------------------------------------ */

export function AudioBusDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 290" title="Аудио-шины">
      {(m) => (
        <>
          <DiagramNode x={24} y={32} width={150} height={44} title="Музыка" subtitle="AudioStreamPlayer" />
          <DiagramNode x={24} y={96} width={150} height={44} title="Эффекты" subtitle="AudioStreamPlayer2D" />
          <DiagramNode x={24} y={160} width={150} height={44} title="Интерфейс" subtitle="AudioStreamPlayer" />

          <DiagramEdge from={[174, 54]} to={[244, 76]} markerId={m} />
          <DiagramEdge from={[174, 118]} to={[244, 100]} markerId={m} />
          <DiagramEdge from={[174, 182]} to={[244, 124]} markerId={m} />

          <DiagramNode x={244} y={58} width={130} height={44} title="шина Music" variant="accent" />
          <DiagramNode x={244} y={122} width={130} height={44} title="шина SFX" variant="accent" />
          <DiagramNode x={244} y={186} width={130} height={44} title="шина SFX" variant="accent" />

          <DiagramEdge from={[374, 80]} to={[424, 110]} markerId={m} />
          <DiagramEdge from={[374, 144]} to={[424, 118]} markerId={m} />
          <DiagramEdge from={[374, 208]} to={[424, 126]} markerId={m} />

          <DiagramNode x={424} y={90} width={112} height={54} title="Master" subtitle="общая громкость" variant="strong" />

          <DiagramFrame x={24} y={226} width={512} height={52} title="Правило" />
          <EdgeLabel x={280} y={258}>музыка тише эффектов: игрок должен слышать, что произошло</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  22. Пайплайн шейдера                                                */
/* ------------------------------------------------------------------ */

export function ShaderPipelineDiagram() {
  return (
    <DiagramSvg viewBox="0 0 620 300" title="Пайплайн шейдера">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={588} height={130} title="Данные на входе" />
          <DiagramNode x={36} y={52} width={150} height={56} title="TEXTURE" subtitle="текстура узла" variant="accent" />
          <DiagramNode x={216} y={52} width={150} height={56} title="UV" subtitle="координаты 0..1" variant="accent" />
          <DiagramNode x={396} y={52} width={190} height={56} title="uniform" subtitle="amount, color" variant="accent" />

          <DiagramEdge from={[111, 108]} to={[230, 168]} markerId={m} />
          <DiagramEdge from={[291, 108]} to={[280, 168]} markerId={m} />
          <DiagramEdge from={[491, 108]} to={[330, 168]} kind="weak" markerId={m} />

          <DiagramNode x={200} y={168} width={220} height={56} title="fragment()" subtitle="считает новый цвет" variant="strong" />

          <DiagramEdge from={[310, 224]} to={[310, 264]} markerId={m} />
          <DiagramNode x={200} y={264} width={220} height={40} title="COLOR" subtitle="на экран" variant="accent" />

          <EdgeLabel x={540} y={186}>TEXTURE, UV, COLOR —</EdgeLabel>
          <EdgeLabel x={540} y={208}>встроенные переменные</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  23. Бюджет кадра                                                   */
/* ------------------------------------------------------------------ */

export function PerfProfilingDiagram() {
  return (
    <DiagramSvg viewBox="0 0 620 300" title="Бюджет кадра: куда уходит время">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={588} height={120} title="Кадр при 60 FPS = 16.6 мс" />
          <DiagramNode x={36} y={52} width={150} height={52} title="Физика" subtitle="2 мс" />
          <DiagramNode x={206} y={52} width={150} height={52} title="Скрипты" subtitle="3 мс" variant="accent" />
          <DiagramNode x={376} y={52} width={208} height={52} title="Отрисовка" subtitle="9 мс" />
          <DiagramEdge from={[186, 78]} to={[206, 78]} markerId={m} />
          <DiagramEdge from={[356, 78]} to={[376, 78]} markerId={m} />

          <DiagramFrame x={16} y={156} width={588} height={124} title="Что делать" />
          <EdgeLabel x={40} y={188}>1. найти столбец, где много времени</EdgeLabel>
          <EdgeLabel x={40} y={214}>2. найти функцию, которую зовут чаще всего</EdgeLabel>
          <EdgeLabel x={40} y={240}>3. убрать лишнюю работу: пул, @onready, отключить узлы</EdgeLabel>
          <EdgeLabel x={40} y={266}>4. замерить снова — цифры важнее ощущений</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}
