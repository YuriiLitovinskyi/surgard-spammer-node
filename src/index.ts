import { Socket } from "net";
import * as dotenv from 'dotenv';
dotenv.config();

enum SurgardEvent {'E', 'R', 'P'};

interface InputData {
    ip: string,
    port: number,
    typeLineChannel: string,
    contactIdIdentifier: string,
    deviceNumber: string,
    surgardCode: string,
    eventType: SurgardEvent | string,
    groupNumber: string,
    zoneUserNumber: string,
    msgCount: number,
    intervalBtwMsgs: number,
    endOfMessage: string
};

class Message {
    private static readEnv(): InputData {
        return {
            ip: process.env.IP || '127.0.0.1',
            port: Number(process.env.PORT) || 20003,
            typeLineChannel: process.env.TYPE_LINE_CHANNEL || '5000',
            contactIdIdentifier: process.env.CONTACT_ID_IDENTIFIER || '18',
            deviceNumber: process.env.DEVICE_NUMBER || '0001',
            surgardCode: process.env.SURGARD_CODE || '100',
            eventType: process.env.EVENT_TYPE || 'E',
            groupNumber: process.env.GROUP_NUMBER || '01',
            zoneUserNumber: process.env.ZONE_USER_NUMBER || '001',
            msgCount: Number(process.env.MSG_COUNT) || 1, 
            intervalBtwMsgs: Number(process.env.INTERVAL_BTW_MSGS) || 100,
            endOfMessage: process.env.END_OF_MESSAGE || '0x14' // where 0x14 => 14 HEX =>  => end of surgard message, terminator 
        };
    };

    public static send(){
        const settings = Message.readEnv();
      
        const { ip, port, typeLineChannel, contactIdIdentifier, deviceNumber, surgardCode, eventType, groupNumber, zoneUserNumber, msgCount, intervalBtwMsgs, endOfMessage } = settings;

        const msg = `${typeLineChannel} ${contactIdIdentifier}${deviceNumber}${eventType}${surgardCode}${groupNumber}${zoneUserNumber}${String.fromCharCode(Number(endOfMessage))}`;
      
        const client = new Socket();
        
        client.connect({ port, host: ip }, async () => {
            console.log(`\nTCP connection established with the server ${ip}:${port} \n`);
            
            for(let i = 0; i < msgCount; i++){
                await new Promise((resolve) => setTimeout(resolve, intervalBtwMsgs));

                client.write(msg);
                console.log(`Sending surgard message code: "${msg}"`);                               
            };
            
            client.end();
        });

        client.on('error', (err) => {
            console.error(`An error occurred while trying to establish the connection! Check ip, port and if server is running! \n Error: ${err}`);
            process.exit(1);
        });

        client.on('end', () => {
            console.log('Requested an end to the TCP connection');
        });
    };
};

try {
    Message.send();    
} catch (error) {
    console.error(`An Error ocurred: ${error}`);
};