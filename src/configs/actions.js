const ACTIONS = {
    'astersay.actions.AioHttpAction': {
        name: 'http запрос ',
        type: 'aiohttp',
    },
    'astersay.actions.BooleanizeAction': {
        name: 'Булево ',
        type: 'booleanize',
    },
    'astersay.actions.CaptureAction': {
        name: 'Прослушивание ',
        type: 'capture',
    },
    'astersay.actions.ConvertAction': {
        name: 'Конверт ',
        type: 'convert',
    },
    'astersay.actions.ParseNameAction': {
        name: 'Обработка имен',
        type: 'parse_name',
    },
    'astersay.actions.PauseAction': {
        name: 'Пауза ',
        type: 'pause',
    },
    'astersay.actions.SayAction': {
        name: 'Фраза ',
        type: 'say',
    },
    'astersay.actions.SearchByBufferAction': {
        name: 'Искать внутри буффера',
        type: 'search_by_buffer',
    },
    'astersay.actions.SilenceAction': {
        name: 'Событие тишины',
        type: 'silence',
    },
    'astersay.actions.VariableSetAction': {
        name: 'Переменная ',
        type: 'variable_set',
    },
}

export default ACTIONS
