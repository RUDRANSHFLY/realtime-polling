import { WebSocketGateway } from "@nestjs/websockets";


@WebSocketGateway({
    cors : {
        orgin : '*',
     }
})