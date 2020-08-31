import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import styles from './styles';
import { homeImages } from '../../constants/images';


export default function ImageSlider() {
    const classes = styles();

    const duration = {
        leavingScreen: 1000,
        enteringScreen: 2000,
    }

    const [image, setImages] = React.useState(homeImages[0])
    const [animate, setAnimate] = React.useState(true)
    const [imageIndex, setImageIndex] = React.useState(0)

    useEffect(() => {
        let interval = setInterval(() => {
            setAnimate(animate => !animate)
            if (imageIndex === homeImages.length - 1) {
                setImageIndex(0)
            } else {
                setImageIndex(imageIndex => imageIndex + 1)
            }
            setAnimate(animate => !animate)
            setImages(homeImages[imageIndex])
        }, 10000);
        return () => clearInterval(interval)
    }, [imageIndex])

    return (
        <React.Fragment>
            <Fade in={animate} timeout={{ enter: duration.enteringScreen, exit: duration.leavingScreen }}>
                <div className={classes.gridImages}>
                    <img src={image.uri} className={classes.bigImage} style={image.style} alt={image.alt} />
                    <Typography component="h4" variant="h5" className={classes.imagestitles} >
                        {image.title}
                    </Typography>
                </div>
            </Fade>
        </React.Fragment>
    );
}