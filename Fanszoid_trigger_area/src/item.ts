import * as EthereumController from "@decentraland/EthereumController"
import { TriggerableTileSquare, TriggerableTileSquareSystem } from './area'

export type Props = {
  enabled: boolean
  fanzEventId: string
  vipTickets?: string
  superVipTickets?: string
  onAccessGranted?: Actions
  onVIPAccessGranted?: Actions
  onSuperVIPAccessGranted?: Actions
  onAccessDenied?: Actions
}

let graphUrl = "https://api.thegraph.com/subgraphs/name/fanz-events/fanz-events-matic"

let getGraphReqBody = ( owner: string, eventId: string ) => {
    return {
        query: "{ balances( where: {type: Ticket, owner: \"" + owner+ "\", event: \"" + eventId + "\"}) {\n    ticket {\n      name\n    }\n  }\n}\n"
    }
}

let userAddress: string

export default class FanzAccessTrigger implements IScript<Props> {
  init() {
    engine.addSystem(new TriggerableTileSquareSystem())
  }
  spawn(host: Entity, props: Props, channel: IChannel) {
    const trigger = new TriggerableTileSquare()
    trigger.enabled = props.enabled

    let vipTickets = props.vipTickets && props.vipTickets.length > 0 ? props.vipTickets.split(',') : [];
    let superVipTickets = props.superVipTickets && props.superVipTickets.length > 0 ? props.superVipTickets.split(',') : [];
    
    channel.handleAction('enable', (action) => {
      if (action.sender === channel.id) {
        trigger.enabled = true
      }
    })

    channel.handleAction('disable', (action) => {
      if (action.sender === channel.id) {
        trigger.enabled = false
      }
    })

    trigger.onEnter = () => {
      if (trigger.enabled && !trigger.checked) {
        executeTask(async () => {
            try {
                userAddress = await EthereumController.getUserAccount()
                let response = await fetch(graphUrl, {
                  headers: { "Content-Type": "application/json" },
                  method: "POST",
                  body: JSON.stringify(getGraphReqBody(userAddress, props.fanzEventId)),
                })
                let json = await response.json()
                log("vipTickets: ", vipTickets)
                log("superVipTickets: ", superVipTickets)

                let ticketsFound = []
                if( json.data && json.data.balances ) {
                  ticketsFound = json.data.balances.map(tb => tb.ticket.name);
                }

                let vipAccess = false;
                let superVipAccess = false;
                if( ticketsFound.length > 0) {
                  log("access granted!")
                  channel.sendActions(props.onAccessGranted)

                  trigger.checked = true;
                  
                  if( ticketsFound.some(ticket => vipTickets.indexOf(ticket) >= 0) ) {
                    vipAccess = true;
                  }
                  if( ticketsFound.some(ticket => superVipTickets.indexOf(ticket) >= 0) ) {
                    vipAccess = true;
                    superVipAccess = true;
                  }

                  if(vipAccess) {
                    log("VIP access granted!")
                    channel.sendActions(props.onVIPAccessGranted)
                  }
                  if(superVipAccess) {
                    log("Super VIP access granted!")
                    channel.sendActions(props.onSuperVIPAccessGranted)
                  }
                } else {
                  log("Access denied")
                  channel.sendActions(props.onAccessDenied)

                  trigger.checked = true;
                }

            } catch {
                log("failed to query graph")
            }
        })
      }
    }

    host.addComponent(trigger)
  }
}
