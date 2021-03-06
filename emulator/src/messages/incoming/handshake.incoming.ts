import { IIncomingHeader } from '../../interfaces';

import { IncomingPacket } from '../incomingPacket';

export class IncomingHandshake
{
    static pongEvent(packet: IncomingPacket): number
    {
        if(packet._decoded._header != IIncomingHeader.PONG_COMPOSER) return;

        console.log(packet);
    }
}