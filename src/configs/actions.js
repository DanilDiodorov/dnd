import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined'
import HttpOutlinedIcon from '@mui/icons-material/HttpOutlined'
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VoiceOverOffOutlinedIcon from '@mui/icons-material/VoiceOverOffOutlined'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'

const ACTIONS = {
    'astersay.actions.CaptureAction': {
        name: 'Прослушивание ',
        type: 'capture',
        icon: <MicNoneOutlinedIcon />,
    },
    'astersay.actions.SayAction': {
        name: 'Фраза ',
        type: 'say',
        icon: <VolumeUpOutlinedIcon />,
    },
    'astersay.actions.AioHttpAction': {
        name: 'http запрос ',
        type: 'aiohttp',
        icon: <HttpOutlinedIcon />,
    },
    'astersay.actions.BooleanizeAction': {
        name: 'Булево ',
        type: 'booleanize',
        icon: <CheckBoxOutlinedIcon />,
    },
    'astersay.actions.ConvertAction': {
        name: 'Конверт ',
        type: 'convert',
        icon: <ChangeCircleOutlinedIcon />,
    },
    'astersay.actions.ParseNameAction': {
        name: 'Обработка имен',
        type: 'parse_name',
        icon: <BadgeOutlinedIcon />,
    },
    'astersay.actions.PauseAction': {
        name: 'Пауза ',
        type: 'pause',
        icon: <PauseCircleOutlineOutlinedIcon />,
    },
    'astersay.actions.SearchByBufferAction': {
        name: 'Искать внутри буффера',
        type: 'search_by_buffer',
        icon: <SearchOutlinedIcon />,
    },
    'astersay.actions.SilenceAction': {
        name: 'Событие тишины',
        type: 'silence',
        icon: <VoiceOverOffOutlinedIcon />,
    },
    'astersay.actions.VariableSetAction': {
        name: 'Переменная ',
        type: 'variable_set',
        icon: <DataObjectOutlinedIcon />,
    },
}

export default ACTIONS
