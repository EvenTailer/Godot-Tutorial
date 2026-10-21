import type { Stage } from '../types'

/**
 * Этап 06 — Звук и «juice».
 * Цель этапа: игра начинает «отзываться»: звук, отдача, тряска, замедление.
 */
export const stage06: Stage = {
  id: '06',
  number: 6,
  slug: '06-zvuk-i-juice',
  title: 'Звук и «juice»',
  shortTitle: 'Звук и juice',
  subtitle: 'Аудио-шины, экранная тряска, hit-stop и другие приёмы, которые делают игру «живой»',
  weeks: '13–14',
  hours: 10,
  goal: 'Научиться добавлять звук и визуальную обратную связь так, чтобы действия ощущались «весомыми».',
  outcome:
    'Удары, прыжки, подбор предметов и получение урона звучат и выглядят по-разному; громкость управляется из настроек.',
  topics: [
    {
      id: 'audio-nodes',
      title: 'Узлы воспроизведения звука',
      term: 'AudioStreamPlayer',
      summary:
        'AudioStreamPlayer звучит без позиции, AudioStreamPlayer2D — с позицией в 2D, AudioStreamPlayer3D — в 3D.',
      why:
        'Звук — половина ощущения игры. Плюс правильная озвучка даёт игроку информацию, которую не видно: что-то сломалось, кто-то рядом, вот опасность.',
      details: [
        'AudioStreamPlayer2D — громкость зависит от расстояния до слушателя (Camera2D).',
        'У него есть attenuation — насколько быстро звук стихает с расстоянием.',
        'AudioStreamPlayer — для музыки, голоса и звуков интерфейса: ему позиция не нужна.',
        'Свойство stream — сам звук (ресурс .ogg или .wav).',
        'Сигнал finished срабатывает, когда звук договорил — удобно для очереди звуков.',
      ],
      diagramRef: 'audio-bus',
    },
    {
      id: 'buses',
      title: 'Аудио-шины',
      term: 'Audio Bus',
      summary:
        'Шина — это канал с именем и своим набором эффектов. По умолчанию есть Master, Music, SFX.',
      why:
        'Шины решают бытовую задачу: игрок хочет слышать музыку тише, а звуки — громче. Без шин пришлось бы менять громкость каждого звука вручную.',
      details: [
        'Управление: нижняя панель → вкладка Audio. Там видны шины и их эффекты.',
        'Назначить шину: свойство Bus узла AudioStreamPlayer.',
        'Шина Master — конечная точка всех шин. Её громкость = общая громкость игры.',
        'Эффекты на шине: Reverb, Compressor, EQ. Compressor не даёт звуку «захлебнуться», когда звучит всё сразу.',
        'Громкость шины меняется кодом: AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Music"), -6.0).',
      ],
      diagramRef: 'audio-bus',
    },
    {
      id: 'import-audio',
      title: 'Импорт звука',
      term: 'AudioStream',
      summary:
        'Для коротких звуков используйте WAV (без потерь), для музыки и длинных звуков — Ogg Vorbis. В настройках импорта есть Loop.',
      why:
        'Неправильный формат и настройки импорта — причина «некоторых звуков не слышно» и «музыка проигрывается с задержкой».',
      details: [
        'WAV — короткие эффекты: выстрел, щелчок, удар. Размер файла больше, зато без потерь и без задержки декодирования.',
        'Ogg Vorbis — музыка и длинные звуки: файл меньше, декодируется в фоне.',
        'Для зацикливаемого звука (ветер, гул) включите Import → Loop.',
        'В настройках проекта: Project Settings → Audio → Driver → Mix Rate.',
        'Если звук «играет один раз и пропадает» — проверьте, не включено ли затухание (Fade Out) в настройках импорта.',
      ],
    },
    {
      id: 'juice',
      title: 'Что такое «juice»',
      term: 'Game Feel / Juice',
      summary:
        'Juice — обратная связь: отдача, тряска экрана, вспышка, замедление времени, звук на каждое действие.',
      why:
        'Одна и та же механика с juice воспринимается как «отличная игра», без — как прототип. Это самый дешёвый способ поднять качество.',
      details: [
        'Отдача (knockback) — персонаж отлетает от удара.',
        'Тряска экрана — короткое смещение камеры. Делается через offset камеры, а не через перемещение игрока.',
        'Hit-stop — замедление на 2–3 кадра в момент удара. Реализуется через Engine.time_scale = 0.05.',
        'Вспышка — modulate меняется на красный на 0.1 секунды.',
        'Звук на каждое действие: шаг, прыжок, удар, подбор. Даже простой «вуш» поднимает восприятие.',
      ],
      diagramRef: 'state-machine',
    },
    {
      id: 'screen-shake',
      title: 'Тряска экрана',
      term: 'Camera2D.offset',
      summary:
        'Тряска — это случайное смещение camera.offset, которое затухает со временем.',
      why:
        'Тряска делает удар «сильнее» без единой строки физики. Реализуется в _process на самой камере, чтобы не дёргать сам игровой объект.',
      details: [
        'camera.offset = Vector2(randf_range(-1, 1), randf_range(-1, 1)) * strength.',
        'strength затухает каждый кадр: strength = move_toward(strength, 0.0, delta * 30).',
        'Тряска должна быть короткой: 0.1–0.25 секунды.',
        'Отключайте тряску, если включено prefers-reduced-motion... в игре — настройка «снижение тряски» в опциях.',
        'Сильнее тряска — наносите больше урона, а не всегда.',
      ],
    },
    {
      id: 'sound-design',
      title: 'Звуковой дизайн: правила простые',
      term: 'Sound Design',
      summary:
        'Разные звуки для разных событий, разная громкость для музыки и эффектов, минимальная длительность для повторяющихся.',
      why:
        'Одинаковый звук на все действия утомляет. А музыка на максимальной громкости «съедает» эффекты — игрок не слышит, что произошло.',
      details: [
        'Типовые события: шаг, прыжок, приземление, удар, получение урона, подбор, победа, поражение.',
        'Музыка — тише эффектов: обычно -8…-12 дБ относительно Master.',
        'Звуки, повторяющиеся каждый кадр (движок, шуршание), делайте короткими и тихими.',
        'Частотный диапазон: высокие частоты — «звонкость», низкие — «вес». Удар должен быть в низких частотах.',
        'Проверяйте звук в наушниках и на колонке телефона: игра идёт в разных условиях.',
      ],
      diagramRef: 'audio-bus',
    },
  ],
  steps: [
    {
      id: 's6-1',
      title: 'Подготовить шины',
      where: 'Нижняя панель → вкладка Audio',
      action:
        'Откройте вкладку Audio внизу редактора. Убедитесь, что есть шины Master, Music и SFX. Если SFX нет — добавьте: нажмите «+» рядом с Master и переименуйте новую шину.',
      result: 'В проекте три шины: Master, Music, SFX.',
      note: 'Создавать новые шины вручную не нужно: они появляются автоматически, когда вы назначаете несуществующее имя в свойстве Bus.',
      diagramRef: 'audio-bus',
    },
    {
      id: 's6-2',
      title: 'Добавить звук в игру',
      where: 'Add Child Node → AudioStreamPlayer2D',
      action:
        'Добавьте AudioStreamPlayer2D под игроком. Перетащите звуковой файл в свойство Stream. Задайте Bus = SFX.',
      result: 'Звук играет в позиции игрока.',
      note: 'Файл .ogg/.wav импортируется как ресурс AudioStream — просто перетащите файл в FileSystem и потом в поле Stream.',
    },
    {
      id: 's6-3',
      title: 'Проиграть звук по событию',
      where: 'Скрипт игрока',
      action:
        'В функции прыжка вызовите `$JumpSound.play()`. Для звука с задержкой используйте `play()` повторно — узел не даст звуку наложиться на себя.',
      result: 'Каждый прыжок сопровождается звуком.',
    },
    {
      id: 's6-4',
      title: 'Зациклить музыку',
      where: 'AudioStreamPlayer (не 2D)',
      action:
        'Добавьте AudioStreamPlayer на уровень, назначьте Bus = Music, включите зацикливание в настройках импорта файла и вызовите play() в _ready().',
      result: 'Музыка играет по кругу.',
      note: 'Если музыка проигралась и остановилась — в настройках импорта не включён Loop.',
      diagramRef: 'audio-bus',
    },
    {
      id: 's6-5',
      title: 'Громкость в настройках',
      where: 'AudioServer + шины',
      action:
        'Создайте функцию `set_music_volume(percent: float)`, которая переводит проценты в децибелы и вызывает AudioServer.set_bus_volume_db().',
      result: 'Ползунок в настройках меняет громкость музыки на лету.',
      note:
        'Децибелы — логарифмическая шкала. 0 дБ — исходная громкость, -6 дБ — вдвое тише на слух.',
    },
    {
      id: 's6-6',
      title: 'Тряска экрана',
      where: 'Скрипт камеры',
      action:
        'Добавьте в камеру метод shake(strength: float), который включает тряску, и в _process затухайте её и пишите в camera.offset.',
      result: 'При попадании камера коротко вздрагивает.',
      diagramRef: 'state-machine',
    },
    {
      id: 's6-7',
      title: 'Отдача и вспышка при уроне',
      where: 'Скрипт игрока',
      action:
        'При получении урона задайте velocity в сторону от источника, вызовите shake у камеры и запустите Tween, меняющий modulate:self_modulate на красный и обратно.',
      result: 'Попадание читается мгновенно: отдача, звук, тряска, вспышка.',
      note: 'Отдача делается в _physics_process через velocity, а не изменением position — иначе вы обойдёте физику.',
    },
  ],
  code: [
    {
      id: 'audio-manager',
      title: 'Менеджер звука с шинами',
      file: 'res://audio_manager.gd',
      language: 'gdscript',
      code: `extends Node

const SFX_BUS := "SFX"
const MUSIC_BUS := "Music"

var _music: AudioStreamPlayer
var _sfx_pool: Array[AudioStreamPlayer] = []
var _pool_index := 0

func _ready() -> void:
	_music = AudioStreamPlayer.new()
	_music.bus = MUSIC_BUS
	add_child(_music)

	for i in range(6):
		var player := AudioStreamPlayer.new()
		player.bus = SFX_BUS
		add_child(player)
		_sfx_pool.append(player)

func play_sfx(stream: AudioStream, volume_db: float = 0.0, pitch: float = 1.0) -> void:
	if stream == null:
		return
	var player: AudioStreamPlayer = _sfx_pool[_pool_index]
	_pool_index = (_pool_index + 1) % _sfx_pool.size()
	player.stream = stream
	player.volume_db = volume_db
	player.pitch_scale = pitch
	player.play()

func play_music(stream: AudioStream) -> void:
	_music.stream = stream
	_music.play()

func set_bus_volume(bus_name: String, percent: float) -> void:
	var index := AudioServer.get_bus_index(bus_name)
	if index < 0:
		return
	AudioServer.set_bus_volume_db(index, linear_to_db(clampf(percent / 100.0, 0.0, 1.0)))

func get_bus_volume(bus_name: String) -> float:
	var index := AudioServer.get_bus_index(bus_name)
	if index < 0:
		return 0.0
	return db_to_linear(AudioServer.get_bus_volume_db(index)) * 100.0
`,
      explanation:
        'Пул из шести проигрывателей — стандартный приём. Один AudioStreamPlayer при повторном play() перезапускает звук с начала, а не играет два сразу: если ударов подряд десять, звук должен быть слышен десять раз, а не один. `linear_to_db` переводит «проценты громкости» в децибелы — так громкость меняется линейно для пользователя, а не логарифмически.',
      versionNote:
        'AudioServer.set_bus_volume_db и get_bus_index существуют в Godot 4.x без изменений.',
    },
    {
      id: 'screen-shake',
      title: 'Тряска экрана',
      file: 'res://camera.gd',
      language: 'gdscript',
      code: `extends Camera2D

@export var max_strength: float = 12.0
@export var decay: float = 40.0

var _strength := 0.0
var _rng := RandomNumberGenerator.new()

func _ready() -> void:
	_rng.randomize()

func shake(strength: float) -> void:
	_strength = min(_strength + strength, max_strength)

func _process(delta: float) -> void:
	if _strength <= 0.0:
		offset = Vector2.ZERO
		return
	_strength = move_toward(_strength, 0.0, decay * delta)
	var magnitude := _strength / max_strength
	offset = Vector2(
		_rng.randf_range(-1.0, 1.0),
		_rng.randf_range(-1.0, 1.0)
	) * max_strength * magnitude
`,
      explanation:
        'Сила тряски хранится в переменной и каждый кадр затухает через `move_toward` — она не прыгает сразу в ноль. Смещение берётся из RandomNumberGenerator: `-1..1` означает случайное направление, а величина смещения пропорциональна оставшейся силе. Пока сила нулевая, `offset` сбрасывается в ноль — иначе камера «залипнет» в смещённом положении.',
      versionNote:
        'RandomNumberGenerator в Godot 4 не требует вызова randomize() вручную в _ready — он инициализируется случайно сам, но явный вызов не мешает.',
    },
    {
      id: 'damage-feedback',
      title: 'Полная обратная связь при уроне',
      file: 'res://player.gd',
      language: 'gdscript',
      code: `extends CharacterBody2D

signal health_changed(value: int)

@onready var sprite: Sprite2D = $Sprite2D
@onready var camera: Camera2D = $Camera2D
@onready var hurt_sound: AudioStreamPlayer2D = $HurtSound

var health: int = 100

func take_damage(amount: int, from_position: Vector2 = Vector2.ZERO) -> void:
	health = max(health - amount, 0)
	health_changed.emit(health)

	var direction := 1.0
	if global_position.x < from_position.x:
		direction = -1.0
	velocity.x = direction * 240.0
	velocity.y = -180.0

	hurt_sound.play()
	camera.shake(8.0)
	_flash(Color(1.0, 0.4, 0.4))

func _flash(color: Color) -> void:
	sprite.modulate = color
	var tween := create_tween()
	tween.tween_property(sprite, "modulate", Color.WHITE, 0.18)
`,
      explanation:
        'Четыре канала обратной связи за одну функцию: цифра здоровья, отдача, звук, тряска камеры, цветовая вспышка. Каждый из них работает по отдельности, но вместе они превращают попадание из «цифра уменьшилась» в «меня ударили». Отдача задаётся через velocity, поэтому персонаж подчиняется физике, а не телепортируется.',
      versionNote:
        'Свойство modulate у Sprite2D принимает Color; прозрачность задаётся как modulate.a.',
    },
    {
      id: 'music-crossfade',
      title: 'Смена музыки с переходом',
      file: 'res://music.gd',
      language: 'gdscript',
      code: `extends AudioStreamPlayer

@export var fade_time: float = 1.2

var _next_stream: AudioStream = null
var _current: AudioStream = null

func play_music(stream: AudioStream) -> void:
	if stream == _current and playing:
		return
	_next_stream = stream
	var tween := create_tween()
	tween.tween_property(self, "volume_db", -40.0, fade_time * 0.5)
	tween.tween_callback(_swap_stream)
	tween.tween_property(self, "volume_db", 0.0, fade_time * 0.5)

func _swap_stream() -> void:
	stream = _next_stream
	_current = _next_stream
	if stream != null:
		play()
`,
      explanation:
        'Кросс-фейд — это «затухание старого, проигрывание нового». Твин сначала уводит громкость к -40 дБ (почти тишина), в этот момент меняется поток, потом громкость возвращается. Проверка `stream == _current` защищает от повторного вызова с тем же треком — иначе музыка перезапускалась бы каждые 0.5 секунды.',
      versionNote:
        'Свойство stream и метод get_stream_playback() есть у AudioStreamPlayer; в примере сравнивается сохранённая ссылка _current — это надёжнее, чем сравнивать поток.',
    },
  ],
  tasks: [
    {
      id: 't6-1',
      title: 'Звуковая библиотека',
      description:
        'Соберите 6 звуков: шаг, прыжок, приземление, удар, урон, подбор. Расставьте их по шинам SFX и проверьте громкость на фоне музыки.',
      level: 1,
      hint: 'Можно синтезировать звуки в Audacity или взять свободные из OpenGameArt.',
    },
    {
      id: 't6-2',
      title: 'Тряска по силе урона',
      description:
        'Сделайте так, чтобы слабый удар тряс камеру слабее, а сильный — заметно. Добавьте настройку в опциях, отключающую тряску полностью.',
      level: 2,
      hint: 'Передавайте силу в shake() как параметр и складывайте её с текущей через min().',
    },
    {
      id: 't6-3',
      title: 'Hit-stop',
      description:
        'При критическом попадании замораживайте игру на 3–4 кадра: Engine.time_scale = 0.05, затем верните 1.0 через await.',
      level: 3,
      hint: 'time_scale влияет на весь движок. Возвращать его нужно гарантированно — используйте await get_tree().create_timer(0.06, true, false, true).timeout.',
    },
    {
      id: 't6-4',
      title: 'Пул звуков',
      description:
        'Сделайте так, чтобы 10 быстрых ударов подряд были слышны все 10 раз. Проверьте, что для этого хватает пула из 4–6 проигрывателей.',
      level: 3,
      hint: 'Один AudioStreamPlayer при повторном play() начинает звук заново.',
    },
  ],
  project: {
    title: 'Звуковой и тактильный слой игры',
    brief:
        'Возьмите игру с этапа 03 и добавьте ей звук и juice: шаги, прыжок, урон с отдачей, тряска камеры, вспышка при попадании.',
    requirements: [
      'Минимум 5 звуковых событий, привязанных к действиям.',
      'Музыка на отдельной шине, эффекты — на другой.',
      'Настройка громкости музыки и эффектов, сохраняемая между запусками.',
      'Отдача, тряска и вспышка при получении урона.',
      'Настройка «отключить тряску» в опциях.',
    ],
    stretch: [
      'Сделайте кросс-фейд при смене музыки (например, при входе в босса).',
      'Добавьте затухание звука при паузе — музыка должна приглушаться.',
      'Сделайте разные варианты звука удара (3 варианта, случайный) — так атака не звучит как робот.',
    ],
  },
  criteria: [
    {
      id: 'c6-1',
      text: 'Различаю AudioStreamPlayer, 2D и 3D версии',
      check: 'Объясняю, какой узел выбрать для музыки, для звука удара и для звука шага.',
    },
    {
      id: 'c6-2',
      text: 'Умею работать с шинами и менять громкость из кода',
      check:
        'Пишу функцию, которая ставит громкость шины Music по процентам, и знаю, зачем нужен AudioServer.get_bus_index.',
    },
    {
      id: 'c6-3',
      text: 'Знаю, почему нужен пул проигрывателей',
      check: 'Объясняю разницу между «звук играет один раз» и «звук наложился сам на себя».',
    },
    {
      id: 'c6-4',
      text: 'Умею делать тряску экрана через camera.offset',
      check:
        'Пишу shake(strength) с затуханием и объясняю, почему тряска не должна двигать сам игровой объект.',
    },
    {
      id: 'c6-5',
      text: 'Связываю звук с событием, а не с таймером',
      check:
        'Показываю, что звук играет по сигналу/вызову действия, а не «каждые N секунд».',
    },
    {
      id: 'c6-6',
      text: 'Понимаю, что juice — это несколько каналов сразу',
      check:
        'Называю минимум 4 канала обратной связи (звук, отдача, тряска, вспышка, замедление) и реализую три.',
    },
  ],
  resources: [
    {
      title: 'Аудио в Godot — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/audio/index.html',
      kind: 'docs',
    },
    {
      title: 'Шины и эффекты — официальный туториал',
      url: 'https://docs.godotengine.org/en/stable/tutorials/audio/buses.html',
      kind: 'docs',
    },
    {
      title: 'Справочник AudioStreamPlayer2D',
      url: 'https://docs.godotengine.org/en/stable/classes/class_audiostreamplayer2d.html',
      kind: 'reference',
    },
    {
      title: 'OpenGameArt — бесплатные звуки и музыка',
      url: 'https://opengameart.org/',
      kind: 'tool',
      note: 'Проверяйте лицензию каждого файла: CC0, CC-BY или CC-BY-SA.',
    },
  ],
  diagrams: ['audio-bus', 'state-machine'],
  versionNotes: [
    {
      version: '4.0',
      text: 'Аудио-шины настраиваются в нижней панели редактора (вкладка Audio) — в Godot 3 там же, но набор эффектов отличался.',
    },
    {
      version: '4.0',
      text: 'Появились отдельные классы AudioStreamPlayer2D/3D с позиционированием; в Godot 3 позиционирование было на том же узле через флаги.',
    },
  ],
}
