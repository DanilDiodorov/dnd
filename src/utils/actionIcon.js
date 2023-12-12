import VolumeUpIcon from '@mui/icons-material/VolumeUp'

const actionIcon = (type) => {
    switch (type) {
        case 'astersay.actions.CaptureAction':
            return <VolumeUpIcon />
        default:
            return <></>
    }
}

export default actionIcon
