import {
    makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';


export const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(3)
    },
    textField: {
        width: '80%',
        maxWidth: '80%',
        minWidth: '80%',
        minHeight: '180px'
    },
    padded: {
        margin: theme.spacing(1, 0)
    }
}));
