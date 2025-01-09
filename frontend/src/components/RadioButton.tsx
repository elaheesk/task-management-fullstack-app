import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';


const RadioButton = ({ radioName, radioValue, radioLabel, handleOnchangeRadio, checked }: any) => {
 
    return (
        <FormControlLabel name={radioName} value={radioValue} control={<Radio size="small" sx={{
            '& .MuiSvgIcon-root': {
                fontSize: 16,
            },
        }} />} label={radioLabel} onChange={handleOnchangeRadio} checked={checked} />
    )
}
export default RadioButton;