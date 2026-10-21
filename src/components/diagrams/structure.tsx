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
/*  1. Дерево сцены и путь к узлу                                       */
/* ------------------------------------------------------------------ */

export function SceneTreeDiagram() {
  return (
    <DiagramSvg viewBox="0 0 520 320" title="Дерево сцены и путь к узлу">
      {(m) => (
        <>
          <DiagramNode x={170} y={16} width={180} height={40} title="Main (Node2D)" variant="accent" />
          <DiagramEdge from={[260, 56]} to={[260, 92]} markerId={m} />
          <DiagramEdge from={[260, 92]} to={[110, 92]} path="M 260 92 L 110 92" markerId={m} />
          <DiagramEdge from={[260, 92]} to={[410, 92]} path="M 260 92 L 410 92" markerId={m} />
          <DiagramNode x={40} y={92} width={140} height={40} title="Player" subtitle="CharacterBody2D" />
          <DiagramNode x={340} y={92} width={140} height={40} title="Level" subtitle="TileMapLayer" />
          <DiagramEdge from={[110, 132]} to={[110, 168]} markerId={m} />
          <DiagramEdge from={[110, 168]} to={[70, 168]} path="M 110 168 L 70 168" markerId={m} />
          <DiagramEdge from={[110, 168]} to={[150, 168]} path="M 110 168 L 150 168" markerId={m} />
          <DiagramNode x={10} y={168} width={120} height={38} title="Sprite2D" />
          <DiagramNode x={140} y={168} width={140} height={38} title="CollisionShape2D" />
          <DiagramFrame x={10} y={226} width={470} height={78} title="Путь к узлу" />
          <DiagramChip x={30} y={252} text="$Main/Player/Sprite2D" width={200} />
          <DiagramChip x={250} y={252} text="%HealthBar" width={120} />
          <EdgeLabel x={210} y={292}>
            $ — по имени, % — по уникальному имени
          </EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  2. Структура проекта на диске                                      */
/* ------------------------------------------------------------------ */

export function ProjectStructureDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 330" title="Структура проекта на диске">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={300} height={250} title="Папка проекта (коммитим)" />
          <DiagramNode x={36} y={44} width={250} height={34} title="project.godot" subtitle="настройки проекта" />
          <DiagramNode x={36} y={88} width={250} height={34} title="scenes/" subtitle="сцены .tscn" />
          <DiagramNode x={36} y={132} width={250} height={34} title="scripts/" subtitle="скрипты .gd" />
          <DiagramNode x={36} y={176} width={250} height={34} title="resources/" subtitle="данные .tres" />
          <DiagramNode
            x={36}
            y={220}
            width={250}
            height={34}
            title=".godot/"
            subtitle="кэш движка — не коммитим"
            variant="strong"
          />
          <DiagramFrame x={336} y={16} width={208} height={250} title="Данные игрока" />
          <DiagramNode
            x={356}
            y={44}
            width={170}
            height={34}
            title="user://"
            subtitle="во время работы игры"
            variant="accent"
          />
          <DiagramNode x={356} y={90} width={170} height={34} title="save.json" subtitle="прогресс" />
          <DiagramNode x={356} y={136} width={170} height={34} title="settings.cfg" subtitle="настройки" />
          <DiagramEdge
            from={[316, 141]}
            to={[356, 61]}
            kind="weak"
            label="запись"
            markerId={m}
            path="M 316 141 L 336 141 L 336 61 L 356 61"
          />
          <DiagramNode x={356} y={196} width={170} height={34} title="export/" subtitle="сборки — не коммитим" />
          <EdgeLabel x={280} y={298}>res:// — только чтение в экспортированной игре</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  3. Git: рабочее дерево, индекс, коммит                             */
/* ------------------------------------------------------------------ */

export function GitWorkflowDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 280" title="Git: рабочее дерево, индекс, коммит">
      {(m) => (
        <>
          <DiagramNode x={20} y={40} width={140} height={54} title="Рабочее дерево" subtitle="файлы на диске" />
          <DiagramEdge from={[160, 67]} to={[216, 67]} label="git add" markerId={m} />
          <DiagramNode x={216} y={40} width={120} height={54} title="Индекс" subtitle="staging" variant="accent" />
          <DiagramEdge from={[336, 67]} to={[392, 67]} label="git commit" markerId={m} />
          <DiagramNode x={392} y={40} width={140} height={54} title="Коммиты" subtitle="история" />
          <DiagramEdge
            from={[462, 94]}
            to={[462, 140]}
            kind="weak"
            label="git log / checkout"
            markerId={m}
            path="M 462 94 L 462 140"
          />
          <DiagramNode x={392} y={140} width={140} height={44} title="Точка отката" variant="strong" />
          <DiagramFrame x={20} y={140} width={300} height={110} title="Типичный цикл" />
          <DiagramEdge from={[90, 194]} to={[150, 194]} markerId={m} />
          <DiagramNode x={150} y={174} width={130} height={40} title="Правим файл" />
          <EdgeLabel x={90} y={238}>1. коммит  2. правка  3. проверка  4. коммит</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  9. Ресурс или узел?                                                */
/* ------------------------------------------------------------------ */

export function ResourceVsNodeDiagram() {
  return (
    <DiagramSvg viewBox="0 0 560 310" title="Ресурс или узел">
      {() => (
        <>
          <DiagramFrame x={16} y={16} width={250} height={250} title="Node — поведение" />
          <DiagramNode x={36} y={44} width={210} height={38} title="Живёт в дереве сцены" variant="accent" />
          <DiagramNode x={36} y={94} width={210} height={34} title="Есть _ready()" />
          <DiagramNode x={36} y={138} width={210} height={34} title="Участвует во вводе" />
          <DiagramNode x={36} y={182} width={210} height={34} title="Не сохраняется в файл" />
          <DiagramNode x={36} y={222} width={210} height={34} title="Sprite2D, Player, UI" />

          <DiagramFrame x={294} y={16} width={250} height={250} title="Resource — данные" />
          <DiagramNode x={314} y={44} width={210} height={38} title="Живёт вне дерева" variant="accent" />
          <DiagramNode x={314} y={94} width={210} height={34} title="Нет _ready()" />
          <DiagramNode x={314} y={138} width={210} height={34} title="Не участвует во вводе" />
          <DiagramNode x={314} y={182} width={210} height={34} title="Сохраняется в .tres" />
          <DiagramNode x={314} y={222} width={210} height={34} title="ItemData, StatsData" />
          <EdgeLabel x={280} y={290}>вопрос: «это поведение или данные?»</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  19. Автолоад + ресурс + сцена                                       */
/* ------------------------------------------------------------------ */

export function AutoloadArchitectureDiagram() {
  return (
    <DiagramSvg viewBox="0 0 620 330" title="Архитектура: автолоад, ресурс, сцена">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={588} height={130} title="Слой сервисов (автолоады)" />
          <DiagramNode x={36} y={44} width={160} height={52} title="ScoreManager" subtitle="очки" variant="accent" />
          <DiagramNode
            x={230}
            y={44}
            width={160}
            height={52}
            title="AudioManager"
            subtitle="звук и музыка"
            variant="accent"
          />
          <DiagramNode
            x={424}
            y={44}
            width={160}
            height={52}
            title="SaveManager"
            subtitle="сохранения"
            variant="accent"
          />

          <DiagramFrame x={16} y={166} width={588} height={120} title="Слой игры" />
          <DiagramNode x={36} y={194} width={160} height={52} title="Сцена уровня" subtitle="поведение" />
          <DiagramNode x={230} y={194} width={160} height={52} title="Компоненты" subtitle="здоровье, ввод" />
          <DiagramNode x={424} y={194} width={160} height={52} title="Ресурсы" subtitle="данные предметов" />

          <DiagramEdge from={[116, 96]} to={[116, 194]} kind="weak" label="сигналы" markerId={m} />
          <DiagramEdge from={[310, 96]} to={[310, 194]} kind="weak" label="сигналы" markerId={m} />
          <DiagramEdge from={[504, 96]} to={[504, 194]} kind="weak" label="вызовы" markerId={m} />

          <DiagramFrame x={16} y={286} width={588} height={36} title="Слой интерфейса" />
          <EdgeLabel x={310} y={312}>интерфейс читает сервисы, но сервисы не знают про интерфейс</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  20. Рефакторинг: жирный узел → компоненты                           */
/* ------------------------------------------------------------------ */

export function RefactorArchitectureDiagram() {
  return (
    <DiagramSvg viewBox="0 0 600 300" title="Рефакторинг: из «жирного» узла в компоненты">
      {(m) => (
        <>
          <EdgeLabel x={140} y={30}>было</EdgeLabel>
          <DiagramFrame x={30} y={40} width={220} height={230} />
          <DiagramNode x={50} y={70} width={180} height={170} title="Player.gd" variant="accent" />
          <text
            x={140}
            y={108}
            textAnchor="middle"
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fill={diagramColor.muted}
          >
            движение
          </text>
          <text
            x={140}
            y={130}
            textAnchor="middle"
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fill={diagramColor.muted}
          >
            анимация
          </text>
          <text
            x={140}
            y={152}
            textAnchor="middle"
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fill={diagramColor.muted}
          >
            здоровье
          </text>
          <text
            x={140}
            y={174}
            textAnchor="middle"
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fill={diagramColor.muted}
          >
            звук
          </text>
          <text
            x={140}
            y={196}
            textAnchor="middle"
            fontSize={diagramFont.small}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fill={diagramColor.muted}
          >
            счёт
          </text>

          <DiagramEdge from={[258, 155]} to={[320, 155]} label="разделить" markerId={m} />

          <EdgeLabel x={460} y={30}>стало</EdgeLabel>
          <DiagramFrame x={328} y={40} width={242} height={230} />
          <DiagramNode x={348} y={62} width={202} height={40} title="Player (контейнер)" variant="accent" />
          <DiagramEdge from={[449, 102]} to={[449, 128]} markerId={m} />
          <DiagramNode x={348} y={128} width={202} height={38} title="MovementComponent" />
          <DiagramNode x={348} y={172} width={202} height={38} title="HealthComponent" />
          <DiagramNode x={348} y={216} width={202} height={38} title="AudioComponent" />
          <EdgeLabel x={300} y={290}>поведение не изменилось — изменилась структура</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  21. Устройство 3D-сцены                                            */
/* ------------------------------------------------------------------ */

export function Scene3dDiagram() {
  return (
    <DiagramSvg viewBox="0 0 620 340" title="Устройство 3D-сцены">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={588} height={220} title="3D-сцена" />
          <DiagramNode x={36} y={44} width={150} height={48} title="DirectionalLight3D" subtitle="солнце" variant="accent" />
          <DiagramNode x={36} y={104} width={150} height={48} title="WorldEnvironment" subtitle="небо, ambient" variant="accent" />
          <DiagramNode x={36} y={164} width={150} height={48} title="Camera3D" subtitle="точка обзора" variant="accent" />

          <DiagramNode x={250} y={60} width={150} height={48} title="MeshInstance3D" subtitle="видимая форма" />
          <DiagramNode x={250} y={124} width={150} height={48} title="CollisionShape3D" subtitle="форма столкновений" />
          <DiagramNode x={250} y={188} width={150} height={48} title="CharacterBody3D" subtitle="игрок" />

          <DiagramNode x={460} y={124} width={130} height={48} title="Mesh + Shape" subtitle="два узла" variant="strong" />

          <DiagramEdge from={[186, 68]} to={[250, 84]} kind="weak" label="свет" markerId={m} />
          <DiagramEdge from={[186, 128]} to={[250, 148]} kind="weak" label="фон" markerId={m} />
          <DiagramEdge from={[186, 188]} to={[250, 212]} kind="weak" label="взгляд" markerId={m} />
          <DiagramEdge from={[400, 84]} to={[460, 148]} kind="weak" markerId={m} />
          <DiagramEdge from={[400, 148]} to={[460, 148]} kind="weak" markerId={m} />

          <DiagramFrame x={16} y={252} width={588} height={72} title="Правило" />
          <EdgeLabel x={310} y={292}>у каждого видимого объекта — отдельный узел коллизии</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  17. Сохранение и загрузка                                          */
/* ------------------------------------------------------------------ */

export function SaveSystemDiagram() {
  return (
    <DiagramSvg viewBox="0 0 600 300" title="Сохранение и загрузка">
      {(m) => (
        <>
          <DiagramNode x={16} y={40} width={130} height={54} title="Состояние" subtitle="Dictionary" variant="accent" />
          <DiagramEdge from={[146, 67]} to={[196, 67]} label="JSON.stringify" markerId={m} />
          <DiagramNode x={196} y={40} width={120} height={54} title="Текст JSON" />
          <DiagramEdge from={[316, 67]} to={[366, 67]} label="FileAccess" markerId={m} />
          <DiagramNode x={366} y={40} width={120} height={54} title="user://save.json" variant="strong" />
          <DiagramEdge
            from={[426, 94]}
            to={[426, 150]}
            kind="weak"
            label="чтение"
            markerId={m}
            path="M 426 94 L 426 150"
          />
          <DiagramNode x={366} y={150} width={120} height={54} title="Проверка типа" subtitle="это Dictionary?" />
          <DiagramEdge
            from={[366, 177]}
            to={[316, 177]}
            kind="flow"
            label="да"
            markerId={m}
            path="M 366 177 L 316 177"
          />
          <DiagramEdge
            from={[426, 204]}
            to={[426, 240]}
            kind="weak"
            label="нет → стартуем с нуля"
            markerId={m}
            path="M 426 204 L 426 240"
          />
          <DiagramEdge
            from={[316, 177]}
            to={[146, 177]}
            kind="flow"
            label="JSON.parse_string"
            markerId={m}
            path="M 316 177 L 146 177"
          />
          <DiagramEdge from={[146, 177]} to={[81, 94]} kind="flow" markerId={m} path="M 146 177 L 81 177 L 81 94" />
          <EdgeLabel x={300} y={280}>битый файл не должен ронять игру</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  18. Модель данных инвентаря                                        */
/* ------------------------------------------------------------------ */

export function InventoryDataDiagram() {
  return (
    <DiagramSvg viewBox="0 0 600 300" title="Модель данных инвентаря">
      {(m) => (
        <>
          <DiagramFrame x={16} y={16} width={250} height={200} title="Справочник предметов (в проекте)" />
          <DiagramNode x={36} y={44} width={210} height={38} title="potion.tres" subtitle="id: potion" />
          <DiagramNode x={36} y={94} width={210} height={38} title="sword.tres" subtitle="id: sword" />
          <DiagramNode x={36} y={144} width={210} height={38} title="shield.tres" subtitle="id: shield" />

          <DiagramFrame x={320} y={16} width={264} height={200} title="Данные игрока (сохраняются)" />
          <DiagramNode x={340} y={44} width={224} height={60} title="Dictionary[String, int]" subtitle="{ potion: 2, sword: 1 }" variant="accent" />
          <DiagramNode x={340} y={120} width={224} height={38} title="Состояние мира" subtitle="позиции не сохраняем" />

          <DiagramEdge from={[246, 63]} to={[340, 74]} kind="weak" label="по id" markerId={m} />
          <DiagramEdge from={[246, 113]} to={[340, 84]} kind="weak" markerId={m} />
          <DiagramEdge from={[246, 163]} to={[340, 94]} kind="weak" markerId={m} />

          <DiagramNode x={120} y={248} width={360} height={38} title="user://save.json" subtitle="только id и количество" variant="strong" />
          <DiagramEdge from={[452, 216]} to={[300, 248]} kind="flow" markerId={m} path="M 452 216 L 452 236 L 300 236 L 300 248" />
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  24. Экспорт: от проекта к игре                                     */
/* ------------------------------------------------------------------ */

export function ExportPresetsDiagram() {
  return (
    <DiagramSvg viewBox="0 0 620 320" title="Экспорт: от проекта к игре">
      {(m) => (
        <>
          <DiagramNode x={16} y={40} width={130} height={54} title="Проект" subtitle="исходники" variant="accent" />
          <DiagramEdge from={[146, 67]} to={[196, 67]} markerId={m} />
          <DiagramNode x={196} y={40} width={140} height={54} title="Пресет" subtitle="export_presets.cfg" />
          <DiagramEdge from={[336, 67]} to={[386, 67]} markerId={m} />
          <DiagramNode x={386} y={40} width={140} height={54} title="Шаблоны" subtitle="движок под платформу" />
          <DiagramEdge from={[456, 94]} to={[456, 140]} markerId={m} path="M 456 94 L 456 140" />
          <DiagramNode x={386} y={140} width={140} height={54} title="Сборка" subtitle=".exe + .pck" variant="strong" />

          <DiagramFrame x={16} y={140} width={330} height={150} title="Настройки релиза" />
          <DiagramNode x={36} y={168} width={290} height={34} title="имя и версия приложения" />
          <DiagramNode x={36} y={210} width={290} height={34} title="размер окна 1280×720" />
          <DiagramNode x={36} y={252} width={290} height={34} title="иконка и заставка" />

          <DiagramFrame x={366} y={212} width={238} height={92} title="Что дальше" />
          <EdgeLabel x={485} y={248}>запустить на чужом компьютере</EdgeLabel>
          <EdgeLabel x={485} y={268}>и опубликовать страницу проекта</EdgeLabel>
        </>
      )}
    </DiagramSvg>
  )
}

/* ------------------------------------------------------------------ */
/*  25. Архитектура финального проекта                                 */
/* ------------------------------------------------------------------ */

export function FinalProjectArchitectureDiagram() {
  return (
    <DiagramSvg viewBox="0 0 620 320" title="Архитектура финального проекта">
      {(m) => (
        <>
          <DiagramNode
            x={200}
            y={16}
            width={220}
            height={50}
            title="GameDirector"
            subtitle="уровни и переходы"
            variant="accent"
          />
          <DiagramFrame x={16} y={92} width={280} height={200} title="Сервисы (автолоады)" />
          <DiagramNode x={36} y={120} width={240} height={38} title="SaveManager" subtitle="слоты сохранений" />
          <DiagramNode x={36} y={168} width={240} height={38} title="ScoreManager" subtitle="очки и рекорды" />
          <DiagramNode x={36} y={216} width={240} height={38} title="AudioManager" subtitle="звук и музыка" />

          <DiagramFrame x={324} y={92} width={280} height={200} title="Игровые модули" />
          <DiagramNode x={344} y={120} width={240} height={38} title="Уровень" subtitle="сцена уровня" />
          <DiagramNode x={344} y={168} width={240} height={38} title="Игрок" subtitle="компоненты" />
          <DiagramNode x={344} y={216} width={240} height={38} title="Интерфейс" subtitle="HUD и меню" />

          <DiagramEdge from={[280, 66]} to={[156, 120]} kind="weak" label="вызовы" markerId={m} />
          <DiagramEdge from={[340, 66]} to={[464, 120]} kind="weak" label="события" markerId={m} />
          <DiagramEdge from={[300, 139]} to={[344, 139]} kind="weak" markerId={m} />
          <DiagramEdge from={[300, 187]} to={[344, 187]} kind="weak" markerId={m} />
        </>
      )}
    </DiagramSvg>
  )
}
