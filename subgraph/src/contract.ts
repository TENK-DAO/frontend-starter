import { near, log, json, JSONValueKind, JSONValue, BigInt, ByteArray } from "@graphprotocol/graph-ts";
import { Account, Token, Contract, Transfer, Mint, Burn } from "../generated/schema";

export function handleReceipt(
  receiptWithOutcome: near.ReceiptWithOutcome
): void {

  const receipt = receiptWithOutcome.receipt;
  const outcome = receiptWithOutcome.outcome;
  const block = receiptWithOutcome.block;

  const actions = receipt.actions;

  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i],
      receipt,
      block,
      outcome
    );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  block: near.Block,
  outcome: near.ExecutionOutcome
): void {

  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }

  // this mapping method ingests receipts by function calls
  // refer to docs on mapping methods
  const functionCall = action.toFunctionCall();

  function updateUser(
    address: string,
    remove: boolean,
    increaseTransferred: boolean,
    ts: string,
  ): void {
    let user = Account.load(address)

    // if account doesn't exist save new account
    if (!user) {
      user = new Account(address)
      user.total_owned = BigInt.zero()
      user.total_transferred = BigInt.zero()
      user.total_minted = BigInt.zero()
      user.total_burned = BigInt.zero()
    }

    user.total_owned = remove
      ? (user.total_owned = user.total_owned.minus(BigInt.fromI32(1)))
      : (user.total_owned = user.total_owned.plus(BigInt.fromI32(1)))

    if (increaseTransferred) {
      user.total_transferred = user.total_transferred.plus(BigInt.fromI32(1))
    }

    user.last_updated = ts
    user.save()
  }

  if (functionCall.methodName == 'nft_mint_one' ||
    functionCall.methodName == 'nft_mint_many' ||
    functionCall.methodName == 'link_callback' ||
    functionCall.methodName == 'nft_mint' ||
    functionCall.methodName == 'mint_special'
  ) {
    for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
      let outcomeLog = outcome.logs[logIndex].toString();
      const receiptId = receipt.id.toBase58();

      let mint = new Mint(`${receiptId}`);
      log.info('outcomeLog {}', [outcomeLog])

      let parsed = outcomeLog;
      if (outcomeLog.startsWith("EVENT_JSON:")) {
        parsed = outcomeLog.replace('EVENT_JSON:', '')
      }

      // find key/value pairs in event object for NEP-297 format
      // ("standard": "", "version": "<#.#.#>", "event": "", "data": {})
      let jsonData = json.try_fromString(parsed)
      const jsonObject = jsonData.value.toObject()

      let eventStandard = jsonObject.get('standard')
      if (eventStandard) {
        if (eventStandard) {
          mint.standard = eventStandard.toString()
        }
      }

      let eventVersion = jsonObject.get('version')
      if (eventVersion) {
        if (eventVersion) {
          mint.version = eventVersion.toString()
        }
      }

      let eventEvent = jsonObject.get('event')
      if (eventEvent) {
        if (eventEvent) {
          mint.event = eventEvent.toString()
        }
      }

      let eventData = jsonObject.get('data')
      if (eventData) {
        let eventArray: JSONValue[] = eventData.toArray()

        let data = eventArray[0].toObject()
        const tokenIds = data.get('token_ids')
        const owner_id = data.get('owner_id')
        if (!tokenIds || !owner_id) return

        let ids: JSONValue[] = tokenIds.toArray()

        // insert contract metadata --> can also be assigned and updated through fetching most recent 'new' or 'new_default_metadata'
        let contract = Contract.load("futurenft.near")
        if (!contract) {
          contract = new Contract("futurenft.near")
          contract.id = "futurenft.near"
          contract.name = "NEAR Future"
          contract.symbol = "nearfuture"
          contract.base_uri = "https://bafybeigxj7qbjear55zwzfbam42via5c7ycawfpb5lpy2qqxhnomn2lnga.ipfs.dweb.link/"
          contract.media_uri = "https://bafybeiazrw5wem27wql5wojx44yzhoezeh4frkrujdvctrxftv24km7lse.ipfs.dweb.link/"
          contract.copies = BigInt.zero();
          contract.total_minted = BigInt.zero();
          contract.total_burned = BigInt.zero();
        }

        for (let i = 0; i < ids.length; i++) {
          let claimedByLinkdrop = false
          const receiptId = receipt.id.toBase58();

          // Maps the JSON formatted log to the LOG entity
          let mint = new Mint(`${receiptId}`);
          if (ids[i].toString() != "" || ids[i].toString() != null) {
            let tokenId = ids[i].toString()

            let token = Token.load(tokenId)

            let account = Account.load(owner_id.toString())
            if (!account) {
              account = new Account(owner_id.toString())
              account.total_owned = BigInt.zero()
              account.total_transferred = BigInt.zero()
              account.total_minted = BigInt.zero()
              account.total_burned = BigInt.zero()
            }
            if (functionCall.methodName == 'link_callback') {
              claimedByLinkdrop = true;
            }

            if (!token) {
              token = new Token(tokenId)
              token.tokenId = tokenId
              token.image = contract.media_uri + tokenId + '.png'
              const metadata = contract.base_uri + tokenId + '.json'
              token.metadata = metadata
              token.contract = contract.id
              mint.contract = contract.id
              token.mintedBy = owner_id.toString()
              token.mintedByLinkdrop = "false"
            }

            contract.copies = contract.copies.plus(BigInt.fromI32(1));
            contract.total_minted = contract.total_minted.plus(BigInt.fromI32(1));

            mint.tokenId = tokenId
            mint.nft = token.id
            mint.ownerId = owner_id.toString()
            mint.owner = owner_id.toString()

            token.ownerId = owner_id.toString()
            token.owner = owner_id.toString()
            token.mintedBy = owner_id.toString()
            token.burned = "false"

            mint.idx = receiptId.toString()
            mint.timestamp = block.header.timestampNanosec.toString()
            mint.blockHash = block.header.hash.toBase58().toString()
            mint.blockHeight = block.header.height.toString()

            token.minted_timestamp = block.header.timestampNanosec.toString()
            token.minted_blockHeight = block.header.height.toString()

            if (claimedByLinkdrop) {
              token.mintedByLinkdrop = "true";
            }

            account.total_owned = account.total_owned.plus(BigInt.fromI32(1));
            account.total_minted = account.total_minted.plus(BigInt.fromI32(1));
            account.last_updated = mint.timestamp;

            token.save()
            mint.save()
            account.save()
            contract.save()
          }
        }
      }
    }
  }


  if (functionCall.methodName == 'nft_burn') {
    for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
      let outcomeLog = outcome.logs[logIndex].toString();

      const receiptId = receipt.id.toBase58();

      let burn = new Burn(`${receiptId}`);
      log.info('outcomeLog {}', [outcomeLog])

      let parsed = outcomeLog;
      if (outcomeLog.startsWith("EVENT_JSON:")) {
        parsed = outcomeLog.replace('EVENT_JSON:', '')
      }
      // let parsed = outcomeLog.replace('EVENT_JSON:', '')

      let jsonData = json.try_fromString(parsed)
      const jsonObject = jsonData.value.toObject()

      let eventStandard = jsonObject.get('standard')
      if (eventStandard) {
        if (eventStandard) {
          burn.standard = eventStandard.toString()
        }
      }

      let eventVersion = jsonObject.get('version')
      if (eventVersion) {
        if (eventVersion) {
          burn.version = eventVersion.toString()
        }
      }

      let eventEvent = jsonObject.get('event')
      if (eventEvent) {
        if (eventEvent) {
          burn.event = eventEvent.toString()
        }
      }

      let eventData = jsonObject.get('data')
      if (eventData) {
        let eventArray: JSONValue[] = eventData.toArray()

        let data = eventArray[0].toObject()
        const tokenIds = data.get('token_ids')
        const owner_id = data.get('owner_id')
        if (!tokenIds || !owner_id) return

        let ids: JSONValue[] = tokenIds.toArray()

        let contract = Contract.load("futurenft.near")
        if (!contract) {
          contract = new Contract("futurenft.near")
          contract.id = "futurenft.near"
          contract.name = "NEAR Future"
          contract.symbol = "nearfuture"
          contract.base_uri = "https://bafybeigxj7qbjear55zwzfbam42via5c7ycawfpb5lpy2qqxhnomn2lnga.ipfs.dweb.link/"
          contract.media_uri = "https://bafybeiazrw5wem27wql5wojx44yzhoezeh4frkrujdvctrxftv24km7lse.ipfs.dweb.link/"
          contract.copies = BigInt.zero();
          contract.total_minted = BigInt.zero();
          contract.total_burned = BigInt.zero();
        }

        for (let i = 0; i < ids.length; i++) {
          const receiptId = receipt.id.toBase58();

          // Maps the JSON formatted log to the LOG entity
          let burn = new Burn(`${receiptId}`);
          if (ids[i].toString() != "" || ids[i].toString() != null) {
            let tokenId = ids[i].toString()
            let token = Token.load(tokenId)
            if (!token) {
              return
            }

            let account = Account.load(token.ownerId.toString())
            if (!account) {
              account = new Account(owner_id.toString())
              account.total_owned = BigInt.zero()
              account.total_transferred = BigInt.zero()
              account.total_minted = BigInt.zero()
              account.total_burned = BigInt.zero()
            }

            contract.copies = contract.copies.minus(BigInt.fromI32(1));
            contract.total_burned = contract.total_burned.plus(BigInt.fromI32(1));

            burn.tokenId = tokenId
            burn.nft = token.id
            burn.ownerId = owner_id.toString()
            burn.owner = owner_id.toString()

            token.burned = "true"
            token.burnedBy = token.ownerId.toString()
            token.prev_ownerId = token.ownerId.toString()
            token.ownerId = owner_id.toString()
            token.owner = owner_id.toString()

            burn.idx = receiptId.toString()
            burn.timestamp = block.header.timestampNanosec.toString()
            burn.blockHash = block.header.hash.toBase58().toString()
            burn.blockHeight = block.header.height.toString()

            account.total_owned = account.total_owned.plus(BigInt.fromI32(1));
            account.total_burned = account.total_burned.plus(BigInt.fromI32(1));
            account.last_updated = burn.timestamp;

            token.save()
            burn.save()
            account.save()
            contract.save()
          }
        }
      }
    }
  }



  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "nft_transfer" ||
    functionCall.methodName == "nft_transfer_payout" ||
    functionCall.methodName == "nft_transfer_call"
  ) {

    const receiptId = receipt.id.toBase58();

    // Maps the JSON formatted log to the LOG entity
    let transfer = new Transfer(`${receiptId}`);
    if (outcome.logs[0] != null) {
      transfer.id = receiptId;
      transfer.idx = receiptId;

      log.info('unparsed outcome.logs[0] for nft_transfer -> {}', [outcome.logs[0]])

      let parsed = outcome.logs[0].replace('EVENT_JSON:', '')

      let jsonData = json.try_fromString(parsed)
      if (jsonData.value != null) {
        const jsonObject = jsonData.value.toObject()

        let eventStandard = jsonObject.get('standard')
        if (eventStandard) {
          if (eventStandard) {
            transfer.standard = eventStandard.toString()
          }
        }

        let eventVersion = jsonObject.get('version')
        if (eventVersion) {
          if (eventVersion) {
            transfer.version = eventVersion.toString()
          }
        }

        let eventEvent = jsonObject.get('event')
        if (eventEvent) {
          if (eventEvent) {
            transfer.event = eventEvent.toString()
          }
        }

        let eventData = jsonObject.get('data')
        if (eventData) {
          let eventArray: JSONValue[] = eventData.toArray()
          let data = eventArray[0].toObject()
          const authorized_id = data.get('authorized_id')
          if (authorized_id) {
            transfer.authorizedId = authorized_id.toString();
          }
          const old_owner_id = data.get('old_owner_id')
          const new_owner_id = data.get('new_owner_id')
          const tokenIds = data.get('token_ids')

          if (!new_owner_id || !old_owner_id || !tokenIds) return

          let contract = Contract.load("futurenft.near")
          if (!contract) {
            contract = new Contract("futurenft.near")
            contract.id = "futurenft.near"
            contract.name = "NEAR Future"
            contract.symbol = "nearfuture"
            contract.base_uri = "https://bafybeigxj7qbjear55zwzfbam42via5c7ycawfpb5lpy2qqxhnomn2lnga.ipfs.dweb.link/"
            contract.media_uri = "https://bafybeiazrw5wem27wql5wojx44yzhoezeh4frkrujdvctrxftv24km7lse.ipfs.dweb.link/"
            contract.copies = BigInt.zero();
            contract.total_minted = BigInt.zero();
            contract.total_burned = BigInt.zero();
          }

          const ids: JSONValue[] = tokenIds.toArray()
          const tokenId = ids[0].toString()

          let token = Token.load(tokenId)

          if (!token) {
            log.error("FAILED TRANSFER: {}", [`should not be processing a tokenId for a transfer that does not exist: ${tokenId}`])
            return;
          }

          token.ownerId = new_owner_id.toString()
          token.owner = new_owner_id.toString()
          token.prev_ownerId = old_owner_id.toString()
          token.prev_owner = old_owner_id.toString()
          token.total_transfers = token.total_transfers.plus(BigInt.fromI32(1))

          transfer.idx = receiptId.toString()
          transfer.methodName = functionCall.methodName;
          transfer.nft = token.id
          transfer.tokenId = token.id
          transfer.old_ownerId = old_owner_id.toString()
          transfer.new_ownerId = new_owner_id.toString()
          transfer.from = old_owner_id.toString()
          transfer.to = new_owner_id.toString()
          transfer.timestamp = block.header.timestampNanosec.toString()
          transfer.blockHash = block.header.hash.toBase58().toString()
          transfer.blockHeight = block.header.height.toString()
          // added 3rd param to increase total number of transfers
          updateUser(new_owner_id.toString(), false, true, transfer.timestamp)
          updateUser(old_owner_id.toString(), true, true, transfer.timestamp)

          if (functionCall.methodName == "nft_transfer") {
            transfer.is_marketSale = "false";
          }
          if (functionCall.methodName == "nft_transfer_payout") {
            transfer.is_marketSale = "true";

            token.save()
            contract.save()
          }
        }
        transfer.save()
      }

    } else {
      log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
    }
  }
}
