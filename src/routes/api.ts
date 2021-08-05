import express from "express";
import {Request, Response, NextFunction} from "express";
import axios from "axios";
import {apiKey} from "../bin/config";

const router = express.Router();
const key = apiKey;

router.post('/api1', function (req: Request, res: Response, next: NextFunction) {

    const str: string = req.body.str;
    const type: 'text' | 'ssml' = req.body.type;
    const languageCode: string = req.body.languageCode;
    const voiceName: string = req.body.voiceName;
    const speed: number = Number(req.body.speed);
    const pitch: number = Number(req.body.pitch);
    const audioDeviceProfile: number = Number(req.body.audioDeviceProfile);

    const data = {
        audioConfig: {
            audioEncoding: 'MP3',
            pitch: pitch,
            speakingRate: speed
        },
        input: (type === 'text') ? {text: str} : {ssml: str},
        voice: {
            languageCode: languageCode,
            name: voiceName
        }
    };

    switch (audioDeviceProfile) {

        case 2:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['wearable-class-device'];
            break;
        case 3:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['handset-class-device'];
            break;
        case 4:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['headphone-class-device'];
            break;
        case 5:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['small-bluetooth-speaker-class-device'];
            break;
        case 6:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['medium-bluetooth-speaker-class-device'];
            break;
        case 7:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['large-home-entertainment-class-device'];
            break;
        case 8:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['large-automotive-class-device'];
            break;
        case 9:
            // @ts-ignore
            data.audioConfig.effectsProfileId = ['telephony-class-application'];
            break;
    }

    axios
        .post('https://texttospeech.googleapis.com/v1beta1/text:synthesize', data, {
            headers: {
                'X-Goog-Api-Key': key
            }
        })
        .then((response) => {
            res.send(response.data.audioContent);

        })
        .catch(error => {
            res.send(error);
        });

});

router.post('/api2', function (req: Request, res: Response, next: NextFunction) {

    axios
        .post('https://texttospeech.googleapis.com/v1beta1/text:synthesize', req.body, {
            headers: {
                'X-Goog-Api-Key': key
            }
        })
        .then((response) => {
            res.send(response.data.audioContent);

        })
        .catch(error => {
            res.status(500);
            res.send(error);
        });
});

export default router;