import Pbf from 'pbf';
import {ReceiveLog, SendLog, SendEntry, ReceiveEntry} from './heartbeat'


const pbf2obj = (data, proto) => {
    const pbf = new Pbf(data);
    return proto.read(pbf);
};

const getSendEntry = (data) => pbf2obj(data, SendEntry);

const getReceiveEntry = (data) => pbf2obj(data, ReceiveEntry);

const getReceiveLog = (data) => pbf2obj(data, ReceiveLog);

const getSendLog = (data) => pbf2obj(data, SendLog);

export {getReceiveLog, getSendLog, getReceiveEntry, getSendEntry};
